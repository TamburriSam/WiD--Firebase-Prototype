import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import Game4 from "./Game4";
import Button from "@mui/material/Button";
import { useTimer } from "react-timer-hook";

const Game3 = ({ expiryTimestamp }) => {
  const db = firebase.firestore();

  const [roomID, setroomID] = useState("");
  const [userID, setuserID] = useState("");
  const [g3Start, setG3Start] = useState(false);
  const [listForRoom, setListForRoom] = useState([]);
  const [what, setWhat] = useState(false);
  const [g4, setG4] = useState(false);
  let [g2Start, setG2start] = useState(localStorage.getItem("g2"));

  useEffect(() => {
    let LSroomId = localStorage.getItem("room_id");
    let LSuserId = localStorage.getItem("user_id");
    const time = new Date();
    time.setSeconds(time.getSeconds() + 420); // 10 minutes timer
    restart(time, true);
    /*  localStorage.setItem("g2", true); */

    let g3LS = localStorage.getItem("g3");

    if (g3LS == "true") {
      setG4(true);
    }

    let token = localStorage.getItem("g3");
    console.log("mounted");

    if (!token) {
      isThereAListInLS();

      setroomID(LSroomId);
      setuserID(LSuserId);
      setTimeout(() => {
        createCells();
      }, 1);
    }
  }, []);

  const {
    seconds,
    minutes,

    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      console.warn("onExpire called");
      console.log("ding");

      isAllEntered();
    },
  });

  const isAllEntered = (list) => {
    let inputList = document.querySelectorAll(".input-cell1");
    let userRef = db.collection("users").doc(localStorage.getItem("user_id"));
    let wordsRef = db.collection("words").doc("words");
    let words = "";

    wordsRef
      .get()
      .then((doc) => {
        words = doc.data().words;
      })
      .then(() => {
        inputList.forEach((word) => {
          let randomInt = Math.floor(Math.random() * 900);
          let allWords = [];

          if (word.value == "") {
            word.value = words[randomInt];
          }
        });
      })
      .then(() => {
        inputList.forEach((word) => {
          userRef.update({
            list_three_input: firebase.firestore.FieldValue.arrayUnion(
              word.value
            ),
          });
        });
      })
      .then(() => {
        setTimeout(() => {
          setG4(true);
        }, 4000);
      });
  };

  const createCells = () => {
    let inputList = document.getElementById("input-list");

    let html = "";
    let count = 0;

    for (let i = 0; i < 26; i++) {
      html += `<li><input data-id="${count}" class="input-cell1"></input></li><hr>`;
      count++;
    }
    inputList.innerHTML = html;
  };

  const isThereAListInLS = () => {
    const LS_ITEM_list_one = localStorage.getItem("list_one_received");
    const LS_ITEM_list_two = localStorage.getItem("list_two_received");

    if (LS_ITEM_list_two) {
      setTimeout(() => {
        displayListFromDB(LS_ITEM_list_two);
      }, 1);
    } else {
      areThereLists();
    }
  };

  const areThereLists = () => {
    const LS_room_id = localStorage.getItem("room_id");

    console.log(LS_room_id);

    let arr = [];
    db.collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let rooms_joined = doc.data().rooms_joined;

          if (rooms_joined == LS_room_id) {
            arr.push(doc);
            console.log(doc.data().rooms_joined);
          }

          console.log(`wanted arr`, arr);
        });
      })
      .then(() => {
        console.log(arr.length);
        selectAList();
      });
  };

  const selectAList = () => {
    let soloLS = localStorage.getItem("solo");

    if (soloLS) {
      defaultList();
    } else {
      let personSelected, personSelectedListTwo, personSelectedUID;

      let haventBeenUsedLists = [];

      let roomUID = localStorage.getItem("room_id");
      let userUID = localStorage.getItem("user_id");

      console.log(`USER ID`, userUID);

      db.collection("users")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let ids = doc.data().uid;
            let t2 = doc.data().t2;
            let rooms_joined = doc.data().rooms_joined;
            let list_two_input = doc.data().list_two_input;
            let listlength = list_two_input.length;
            console.log(listlength);

            console.log(rooms_joined === roomUID);

            console.log(list_two_input);

            console.log(list_two_input.length === 26);
            console.log(list_two_input.length);

            if (ids !== userUID && t2 == false && rooms_joined === roomUID) {
              haventBeenUsedLists.push(doc.data());
              console.log(haventBeenUsedLists);
            } else {
              return false;
            }
          });
        })
        .then(() => {
          haventBeenUsedLists.map((item) => {
            let list_two = item.list_two_input;

            if (list_two.length == 26) {
              console.log(`havent been used`, haventBeenUsedLists);
              let random = Math.floor(
                Math.random() * haventBeenUsedLists.length
              );

              personSelected = haventBeenUsedLists[random];
              personSelectedListTwo = personSelected.list_two_input;
              personSelectedUID = personSelected.uid;

              console.log(
                `person selected`,
                personSelected,
                personSelectedListTwo,
                personSelectedUID
              );

              localStorage.setItem("list_two_received", personSelectedListTwo);
              console.log("person selected", personSelectedListTwo);
              displayListFromDB(personSelectedListTwo);
            } else {
              defaultList();
            }
          });
        })
        .then(() => {
          updateUsersTurn(personSelectedUID);
        });
    }
  };

  const defaultList = () => {
    let list = [];
    let defaultList = [];

    let room_id = localStorage.getItem("room_id");

    db.collection("rooms")
      .doc(room_id)
      .get()
      .then((doc) => {
        list.push(doc.data().list_two);
      })
      .then(() => {
        list.forEach((user) => {
          defaultList = user[0];
          localStorage.setItem("list_two_received", defaultList);
          displayListFromDB(defaultList);

          console.log(defaultList);
        });
      });
  };

  const displayListFromDB = (list) => {
    let received_list = document.getElementById("received_word_list");

    let html = "";

    if (typeof list === "string") {
      list = list.split(",");
    }

    list.map((item) => {
      html += `<li class="list_item">${item}</li><hr>`;
    });

    received_list.innerHTML = html;

    console.log(listForRoom);
  };

  const updateUsersTurn = (id) => {
    return db.collection("users").doc(id).update({ t2: true });
  };

  const allEntered = (e) => {
    e.preventDefault();
    let inputList = document.querySelectorAll(".input-cell1");

    let enteredWords = [];

    inputList.forEach((cell) => {
      if (cell.value !== "") {
        enteredWords.push(cell);
      }
    });

    if (enteredWords.length == 26) {
      updateUserInputList();
    } else {
      alert("all cells must be entered");
    }
  };

  const updateUserInputList = () => {
    let LSuserId = localStorage.getItem("user_id");

    let userRef = db.collection("users").doc(LSuserId);
    let inputList = document.querySelectorAll(".input-cell1");
    let game_three_list = [];

    inputList.forEach((cell) => {
      game_three_list.push(cell.value);
    });

    userRef.update({
      list_three_input: game_three_list,
    });

    updateUserListToMainRoom(game_three_list);

    console.log(game_three_list);
  };

  const updateUserListToMainRoom = (list) => {
    let roomUID = localStorage.getItem("room_id");
    let roomRef = db.collection("rooms").doc(roomUID);
    let randomInt = Math.floor(Math.random() * 200);
    let list_three;

    //overwriting entire document
    list_three = {
      [randomInt]: {
        0: userID,
        1: list,
      },
    };

    return roomRef
      .set(
        {
          list_three,
        },
        { merge: true }
      )
      .then(() => {
        localStorage.setItem("g3", true);
        setG4(true);
      });
  };

  if (g4) {
    return <Game4 />;
  }

  return (
    <div id='game2'>
      <h1>Game Three</h1>
      <div>
        <div
          style={{
            backgroundColor: "#e0ffe3",
            position: "relative",
            textAlign: "center",
            margin: "auto",
            border: "2px solid grey",
            width: "80vw",
            padding: "5px",
            borderRadius: "5px",
            marginBottom: "10px",
            height: "fit-content",
          }}
          id='instruction-game'
        >
          Here's another column.<br></br>
          Do the same as you did in the previous step: create a column of words.
          <br></br>
        </div>
        <div
          style={{
            textAlign: "center",
            backgroundColor: "white",
            position: "relative",
            margin: "auto",
            width: "15vw",
            borderRadius: "3px",
            position: "relative",
            top: "12px",
          }}
        >
          <div style={{ fontSize: "22px" }}>
            <span>{minutes}</span>:<span>{seconds}</span>
          </div>
        </div>
      </div>
      <p>{userID}</p>
      <div id='list_container'>
        <ul id='received_word_list'></ul>

        <div>
          <ul id='input-list'></ul>
        </div>
      </div>
      <div className='overlay2'></div>

      <form onSubmit={(e) => allEntered(e)} className='second-button-container'>
        <Button
          variant='outlined'
          id='continueBtn'
          type='submit'
          value={roomID}
          color='success'
        >
          Continue
        </Button>
      </form>
    </div>
  );
};

export default Game3;
