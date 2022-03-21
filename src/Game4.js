import { useEffect, useState } from "react";
import firebase from "firebase/app";
import Main from "./Main";
import "firebase/firestore";
import RoomLI from "./RoomLI";
import Wordtable from "./WordTable";
import "./styles/Game.css";
import Button from "@mui/material/Button";
import { useTimer } from "react-timer-hook";

const Game4 = ({ expiryTimestamp, Game4_to_WordTable }) => {
  const db = firebase.firestore();

  const [roomID, setroomID] = useState("");
  const [userID, setuserID] = useState("");

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

    console.log("mounted");

    isThereAListInLS();

    setroomID(LSroomId);
    setuserID(LSuserId);

    setTimeout(() => {
      createCells();
    }, 1);

    return () => {
      console.log("unmounting");
    };
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
          Game4_to_WordTable();
        }, 4000);
      });
  };

  const createCells = () => {
    let inputList = document.querySelector(".inp-list");

    let count = 0;
    let html = "";
    for (let i = 0; i < 26; i++) {
      html += `<li><input data-id="${count}" class="input-cell1"></input></li>`;
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

    let arr = [];
    db.collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let rooms_joined = doc.data().rooms_joined;

          if (rooms_joined == LS_room_id) {
            arr.push(doc);
          }
        });
      })
      .then(() => {
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

      db.collection("users")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let ids = doc.data().uid;
            let t3 = doc.data().t3;
            let rooms_joined = doc.data().rooms_joined;
            let list_three_input = doc.data().list_three_input;

            if (
              ids !== userUID &&
              t3 == false &&
              rooms_joined === roomUID &&
              list_three_input.length === 26
            ) {
              haventBeenUsedLists.push(doc.data());
            } else {
              return false;
            }
          });
        })
        .then(() => {
          //the first part is good- the error is here

          if (haventBeenUsedLists.length === 1) {
            displayListFromDB(haventBeenUsedLists[0].list_three_input);

            localStorage.setItem(
              "list_three_received",
              haventBeenUsedLists[0].list_three_input
            );
          } else if (haventBeenUsedLists.length > 1) {
            haventBeenUsedLists.map((item) => {
              let random = Math.floor(
                Math.random() * haventBeenUsedLists.length
              );

              personSelected = haventBeenUsedLists[random];
              personSelectedListThree = personSelected.list_three_input;
              personSelectedUID = personSelected.uid;

              localStorage.setItem(
                "list_three_received",
                personSelectedListThree
              );
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
          defaultList = user[0];
          localStorage.setItem("list_three_received", defaultList);
          displayListFromDB(defaultList);
        });
      });
  };

  const displayListFromDB = (list) => {
    let received_list = document.querySelector(".received_list");

    let html = "";

    if (typeof list === "string") {
      list = list.split(",");
    }

    list.map((item) => {
      html += `<li class="list_item">${item}</li>`;
    });

    received_list.innerHTML = html;
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
        Game4_to_WordTable();
      });
  };

  return (
    <div>
      <div className='main-container'>
        <div className='instructionAndTimerContainer'>
          <div className='instructions11'>
            <h2>Instructions</h2>
            Now do the same thing one more time.
            <br></br>
          </div>
          <div className='timer'>
            <h2>{minutes}:</h2>
            <h2>{seconds}</h2>
          </div>
        </div>
        <div className='game2'>
          <ul className='inp-list'></ul>
          <ul className='received_list'></ul>
        </div>
        <button onClick={allEntered} className='continue'>
          <p>continue</p>
          {/*  <ArrowCircleRightTwoToneIcon /> */}
        </button>
      </div>
    </div>
  );
};

export default Game4;
