import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import RoomLI from "./RoomLI";
import Wordtable from "./WordTable";
import "./styles/Game.css";
import Button from "@mui/material/Button";
import { useTimer } from "react-timer-hook";

const Game4 = ({ expiryTimestamp }) => {
  const db = firebase.firestore();

  const [roomID, setroomID] = useState("");
  const [userID, setuserID] = useState("");
  const [listForRoom, setListForRoom] = useState([]);
  const [fp, setfp] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    let LSroomId = localStorage.getItem("room_id");
    let LSuserId = localStorage.getItem("user_id");
    let token = localStorage.getItem("g4");
    const time = new Date();
    time.setSeconds(time.getSeconds() + 420); // 10 minutes timer
    restart(time, true);
    /*  localStorage.setItem("g2", true); */

    let g4LS = localStorage.getItem("g4");

    if (g4LS == "true") {
      setfp(true);
    }

    if (!token) {
      console.log("mounted");

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
            list_four_input: firebase.firestore.FieldValue.arrayUnion(
              word.value
            ),
          });
        });
      })
      .then(() => {
        setTimeout(() => {
          setfp(true);
        }, 4000);
      });
  };

  const createCells = () => {
    let inputList = document.getElementById("input-list");

    let count = 0;
    let html = "";
    for (let i = 0; i < 26; i++) {
      html += `<li><input data-id="${count}" class="input-cell1"></input></li><hr>`;
      count++;
    }
    inputList.innerHTML = html;
  };

  const isThereAListInLS = () => {
    const LS_ITEM_list_one = localStorage.getItem("list_one_received");
    const LS_ITEM_list_three = localStorage.getItem("list_three_received");

    if (LS_ITEM_list_three) {
      setTimeout(() => {
        displayListFromDB(LS_ITEM_list_three);
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
      let personSelected, personSelectedListThree, personSelectedUID;

      let haventBeenUsedLists = [];

      let roomUID = localStorage.getItem("room_id");
      let userUID = localStorage.getItem("user_id");

      console.log(`USER ID`, userUID);

      db.collection("users")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let ids = doc.data().uid;
            let t3 = doc.data().t3;
            let rooms_joined = doc.data().rooms_joined;
            let list_three_input = doc.data().list_three_input;

            console.log(rooms_joined === roomUID);

            console.log(list_three_input);

            if (
              ids !== userUID &&
              t3 == false &&
              rooms_joined === roomUID &&
              list_three_input.length === 26
            ) {
              haventBeenUsedLists.push(doc.data());
              console.log(haventBeenUsedLists);
            } else {
              return false;
            }
          });
        })
        .then(() => {
          //the first part is good- the error is here

          console.log(haventBeenUsedLists[0]);

          if (haventBeenUsedLists.length === 1) {
            displayListFromDB(haventBeenUsedLists[0].list_three_input);

            localStorage.setItem(
              "list_three_received",
              haventBeenUsedLists[0].list_three_input
            );
          } else if (haventBeenUsedLists.length > 1) {
            haventBeenUsedLists.map((item) => {
              console.log(item.list_three_input);
              let random = Math.floor(
                Math.random() * haventBeenUsedLists.length
              );

              personSelected = haventBeenUsedLists[random];
              personSelectedListThree = personSelected.list_three_input;
              personSelectedUID = personSelected.uid;

              console.log(
                `person selected`,
                personSelected,
                personSelectedListThree,
                personSelectedUID
              );

              localStorage.setItem(
                "list_three_received",
                personSelectedListThree
              );
              console.log("person selected", personSelectedListThree);
              displayListFromDB(personSelectedListThree);
            });
          } else {
            defaultList();
          }
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
        list.push(doc.data().list_three);
      })
      .then(() => {
        list.forEach((user) => {
          console.log(list);
          defaultList = user[0];
          localStorage.setItem("list_three_received", defaultList);
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
    return db.collection("users").doc(id).update({ t3: true });
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
    let game_four_list = [];

    inputList.forEach((cell) => {
      game_four_list.push(cell.value);
    });

    userRef.update({
      list_four_input: game_four_list,
    });

    updateUserListToMainRoom(game_four_list);

    console.log(game_four_list);
  };

  const updateUserListToMainRoom = (list) => {
    let roomUID = localStorage.getItem("room_id");
    let roomRef = db.collection("rooms").doc(roomUID);
    let randomInt = Math.floor(Math.random() * 200);
    let list_four;

    //overwriting entire document
    list_four = {
      [randomInt]: {
        0: userID,
        1: list,
      },
    };

    return roomRef
      .set(
        {
          list_four,
        },
        { merge: true }
      )
      .then(() => {
        localStorage.setItem("g4", true);
        setfp(true);
      });
  };

  if (fp) {
    return <Wordtable />;
  }

  const test = () => {
    let room_id = localStorage.getItem("room_id");

    db.collection("rooms")
      .doc(room_id)
      .get()
      .then((doc) => {
        console.log(doc.data().list_one);
        console.log(doc.data().list_two);
      });
  };

  return (
    <div id='game2'>
      <h1>Game Four</h1>
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
          Now do the same thing one more time.<br></br>
        </div>
        <div>
          <div
            style={{
              textAlign: "center",
              backgroundColor: "white",
              position: "relative",
              margin: "auto",
              width: "15vw",
              borderRadius: "3px",
              position: "relative",
              top: "13px",
            }}
          >
            <div style={{ fontSize: "22px" }}>
              <span>{minutes}</span>:<span>{seconds}</span>
            </div>
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

export default Game4;
