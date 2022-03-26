import { useEffect, useState } from "react";
import firebase from "firebase/app";
import Main from "./Main";
import "firebase/firestore";
import RoomLI from "./RoomLI";
import Game3 from "./Game3";
import { create } from "@mui/material/styles/createTransitions";
import "./styles/Game.css";
import Button from "@mui/material/Button";
import { useTimer } from "react-timer-hook";
import "./styles/Game1.css";
import ArrowCircleRightTwoToneIcon from "@mui/icons-material/ArrowCircleRightTwoTone";

const Game2 = ({ expiryTimestamp, Game2_to_Game3 }) => {
  const db = firebase.firestore();

  const [roomID, setroomID] = useState("");
  const [userID, setuserID] = useState("");
  const [g3Start, setG3Start] = useState(false);
  const [listForRoom, setListForRoom] = useState([]);
  const [what, setWhat] = useState(false);
  const [g3, setG3] = useState(false);
  let [g2Start, setG2start] = useState(localStorage.getItem("g2"));
  const [isPlaying, setIsPlaying] = useState("false");
  const [num, setNum] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    window.addEventListener("click", magnifyWords);
    window.addEventListener("keyup", magnifyWordsWithTab);

    console.log("mounted");
    window.scrollTo(0, 0);

    let LSroomId = localStorage.getItem("room_id");
    let LSuserId = localStorage.getItem("user_id");

    const time = new Date();
    time.setSeconds(time.getSeconds() + 420); // 10 minutes timer
    restart(time, true);

    let g2LS = localStorage.getItem("g2");

    let token = localStorage.getItem("g2");

    console.log("mounted");
    setLoading(false);
    if (!token) {
      isThereAListInLS();
      setroomID(LSroomId);
      setuserID(LSuserId);

      setTimeout(() => {
        createCells();
      }, 1);
    }

    return () => {
      console.log("unmounted");
      window.removeEventListener("click", magnifyWords);
      window.removeEventListener("keyup", magnifyWordsWithTab);
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
            list_two_input: firebase.firestore.FieldValue.arrayUnion(
              word.value
            ),
          });
        });
      })
      .then(() => {
        setTimeout(() => {
          Game2_to_Game3();
        }, 4000);
      });
  };

  const createCells = () => {
    let inputList = document.querySelector(".inp-list");

    let html = "";
    let count = 0;
    for (let i = 0; i < 26; i++) {
      html += `<li><input data-id="${count}" class="input-cell1"/></li>`;
      count++;
    }
    inputList.innerHTML = html;
  };

  const isThereAListInLS = () => {
    const LS_ITEM_list_one = localStorage.getItem("list_one_received");

    if (LS_ITEM_list_one) {
      setTimeout(() => {
        displayListFromDB(LS_ITEM_list_one);
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
      let personSelected, personSelectedListOne, personSelectedUID;

      let haventBeenUsedLists = [];

      let roomUID = localStorage.getItem("room_id");
      let userUID = localStorage.getItem("user_id");

      db.collection("users")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let ids = doc.data().uid;
            let t1 = doc.data().t1;
            let rooms_joined = doc.data().rooms_joined;
            let list_one_input = doc.data().list_one_input;

            if (
              ids !== userUID &&
              t1 == false &&
              rooms_joined === roomUID &&
              list_one_input.length === 26
            ) {
              haventBeenUsedLists.push(doc.data());
            } else {
              return false;
            }
          });
        })
        .then(() => {
          if (haventBeenUsedLists.length === 1) {
            displayListFromDB(haventBeenUsedLists[0].list_one_input);

            localStorage.setItem(
              "list_one_received",
              haventBeenUsedLists[0].list_one_input
            );
          } else if (haventBeenUsedLists.length > 1) {
            haventBeenUsedLists.map((item) => {
              let random = Math.floor(
                Math.random() * haventBeenUsedLists.length
              );

              personSelected = haventBeenUsedLists[random];
              personSelectedListOne = personSelected.list_one_input;
              personSelectedUID = personSelected.uid;

              localStorage.setItem("list_one_received", personSelectedListOne);
              displayListFromDB(personSelectedListOne);
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
        list.push(doc.data().list_one);
      })
      .then(() => {
        list.forEach((user) => {
          defaultList = user[0];
          localStorage.setItem("list_one_received", defaultList);
          displayListFromDB(defaultList);
        });
      });
  };

  const displayListFromDB = (list, e) => {
    let received_list = document.querySelector(".received_list");

    let html = "";

    if (typeof list === "string") {
      list = list.split(",");
    }

    list.map((item) => {
      html += `<li class="list_item passed-words">${item}</li>`;
    });

    received_list.innerHTML = html;
  };

  const updateUsersTurn = (id) => {
    return db
      .collection("users")
      .doc(id)
      .update({ t1: true })
      .catch((err) => {
        console.log("err on line 201", err);
      });
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
    let game_two_list = [];

    inputList.forEach((cell) => {
      game_two_list.push(cell.value);
    });

    userRef.update({
      list_two_input: game_two_list,
    });

    updateUserListToMainRoom(game_two_list);
  };

  const updateUserListToMainRoom = (list) => {
    let roomUID = localStorage.getItem("room_id");
    let roomRef = db.collection("rooms").doc(roomUID);
    let randomInt = Math.floor(Math.random() * 200);
    let list_two;

    //overwriting entire document
    list_two = {
      [randomInt]: {
        0: userID,
        1: list,
      },
    };

    return roomRef
      .set(
        {
          list_two,
        },
        { merge: true }
      )
      .then(() => {
        localStorage.setItem("g2", true);
        setLoading(true);
        Game2_to_Game3();
      });
  };

  const magnifyWords = (e) => {
    let selected = document.querySelectorAll(".selected-text");
    let currentNumber = e.target.dataset.id;
    let passedWords = document.querySelectorAll(".passed-words");

    console.log(currentNumber, "click");

    if (e.target.className === "input-cell1") {
      setNum(currentNumber);
      passedWords[currentNumber].className = "passed-words selected-text";
      for (let i = 0; i < selected.length; i++) {
        selected[i].classList.remove("selected-text");
        return (selected[i].className = "list_item passed-words");
      }
    } else {
      return false;
    }
  };

  const magnifyWordsWithTab = (e) => {
    if (e.keyCode === 9) {
      let selected = document.querySelectorAll(".selected-text");
      let currentNumber = e.target.dataset.id;
      let passedWords = document.querySelectorAll(".passed-words");

      console.log(currentNumber);

      if (e.target.className === "input-cell1") {
        console.log(e.target.dataset.id);
        setNum(currentNumber);
        passedWords[currentNumber].className = "passed-words selected-text";
        for (let i = 0; i < selected.length; i++) {
          selected[i].classList.remove("selected-text");
          return (selected[i].className = "list_item passed-words");
        }
      } else {
        return false;
      }
    }
  };

  if (isLoading) {
    return <div className='App'>Loading...</div>;
  }

  return (
    <div>
      <div className='main-container'>
        <div className='instructionAndTimerContainer'>
          <div id='game2-instructions' className='instructions11'>
            You've received a paper with a random classmate's words.<br></br>
            Here's someone else's list from the previous step.<br></br>
            Look at the top word. Then, at the top of the blank column, write
            the first word that comes into your head.<br></br>
            Don't question whether the connection makes sense. Trust your intial
            response!<br></br>Do the same for every word down the list.<br></br>
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
          <ArrowCircleRightTwoToneIcon />
        </button>
      </div>
    </div>
  );
};

export default Game2;
