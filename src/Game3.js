import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import Game4 from "./Game4";
import Button from "@mui/material/Button";
import { useTimer } from "react-timer-hook";
import "./styles/Game.css";

import "./styles/Game1.css";

const Game3 = ({ expiryTimestamp, Game3_to_Game4 }) => {
  const db = firebase.firestore();

  const [roomID, setroomID] = useState("");
  const [userID, setuserID] = useState("");

  useEffect(() => {
    console.log("mounted");
    window.scrollTo(0, 0);

    let LSroomId = localStorage.getItem("room_id");
    let LSuserId = localStorage.getItem("user_id");
    const time = new Date();
    time.setSeconds(time.getSeconds() + 420); // 10 minutes timer
    restart(time, true);

    console.log("mounted");

    isThereAListInLS();

    setroomID(LSroomId);
    setuserID(LSuserId);
    setTimeout(() => {
      createCells();
    }, 1);

    return () => {
      console.log("unmounting g3");
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
            list_three_input: firebase.firestore.FieldValue.arrayUnion(
              word.value
            ),
          });
        });
      })
      .then(() => {
        setTimeout(() => {
          Game3_to_Game4();
        }, 4000);
      });
  };

  const createCells = () => {
    let inputList = document.querySelector(".inp-list");

    let html = "";
    let count = 0;

    for (let i = 0; i < 26; i++) {
      html += `<li><input data-id="${count}" class="input-cell1"></input></li>`;
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
      let personSelected, personSelectedListTwo, personSelectedUID;

      let haventBeenUsedLists = [];

      let roomUID = localStorage.getItem("room_id");
      let userUID = localStorage.getItem("user_id");

      db.collection("users")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let ids = doc.data().uid;
            let t2 = doc.data().t2;
            let rooms_joined = doc.data().rooms_joined;
            let list_two_input = doc.data().list_two_input;

            if (
              ids !== userUID &&
              t2 == false &&
              rooms_joined === roomUID &&
              list_two_input.length === 26
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
            displayListFromDB(haventBeenUsedLists[0].list_two_input);

            localStorage.setItem(
              "list_two_received",
              haventBeenUsedLists[0].list_two_input
            );
          } else if (haventBeenUsedLists.length > 1) {
            haventBeenUsedLists.map((item) => {
              let random = Math.floor(
                Math.random() * haventBeenUsedLists.length
              );

              personSelected = haventBeenUsedLists[random];
              personSelectedListTwo = personSelected.list_two_input;
              personSelectedUID = personSelected.uid;

              localStorage.setItem("list_two_received", personSelectedListTwo);
              displayListFromDB(personSelectedListTwo);
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
        list.push(doc.data().list_two);
      })
      .then(() => {
        list.forEach((user) => {
          defaultList = user[0];
          localStorage.setItem("list_two_received", defaultList);
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
        Game3_to_Game4();
      });
  };

  return (
    <div>
      <div className='main-container'>
        <div className='instructionAndTimerContainer'>
          <div className='instructions11'>
            <h2>Instructions</h2>
            Here's another column.<br></br>
            Do the same as you did in the previous step: create a column of
            words.
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

export default Game3;
