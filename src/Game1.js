import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import ArrowCircleRightTwoToneIcon from "@mui/icons-material/ArrowCircleRightTwoTone";
import Main from "./Main.js";
import Game2 from "./Game2.js";
import "./styles/Game.css";
import Button from "@mui/material/Button";
import { useTimer } from "react-timer-hook";
import CurrentRoom from "./CurrentRoom.js";
import Typing from "react-typing-animation";
import Timer from "./Timer.js";
import TypeWriterEffect from "react-typewriter-effect";
import Typewriter from "typewriter-effect/dist/core";
import "./styles/Game1.css";

function Game1({ expiryTimestamp, testGame, Game1_to_Game2 }) {
  const db = firebase.firestore();

  const [roomID, setroomID] = useState("");
  const [userID, setuserID] = useState("");
  const [g2Start, setG2Start] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [mounted, setmounted] = useState(false);
  const [time, setTime] = useState(false);
  const [num, setNum] = useState("");

  useEffect((e) => {
    console.log("mounted");
    window.addEventListener("click", magnifyWords);
    window.addEventListener("keyup", magnifyWordsWithTab);

    let LSroomId = localStorage.getItem("room_id");
    let LSuserId = localStorage.getItem("user_id");
    let LSg1Start = localStorage.getItem("g1");

    setroomID(LSroomId);
    setuserID(LSuserId);
    populateAlphabet();

    var app = document.querySelector(".instructions11");

    /*   var typewriter = new Typewriter(app, {
      loop: false,
      delay: 75,
    });
    typewriter
      .typeString(
        `Here's a list of letters.
    Replace each letter with a word that you think you might like to write
    with.
    The word can begin with the letter or not.
    Let your mind run free!`
      )
      .pauseFor(1000)
      .start(); */

    return () => {
      window.removeEventListener("click", magnifyWords);
      window.removeEventListener("keyup", magnifyWordsWithTab);
      setmounted(true);
      setLoading(true);
      setTime(true);
      console.log("unmounting");
    };
  }, []);

  useEffect(() => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 420); // 10 minutes timer
    restart(time, true);
  }, [time]);

  const shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

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
            list_one_input: firebase.firestore.FieldValue.arrayUnion(
              word.value
            ),
          });
        });
      })
      .then(() => {
        setTimeout(() => {
          Game1_to_Game2();
        }, 4000);
      });
  };

  const populateAlphabet = () => {
    createCells();
    let alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
    let received_list = document.querySelector(".received_list");
    let inpList = document.querySelector(".inp-list");
    let buttonContainer = document.getElementById("button-container");
    let shuffledAlpha = shuffle(alphabet);
    let count = 0;
    let html = "";

    /* alphabet.map((letter) => {
      html += `<li><input type="text" data-id="${count}" class="input-cell"/> <span class="placeholder">${letter}</span></li>`;
      count++;
    });
    listofInp.innerHTML = html; */

    alphabet.map((letter) => {
      html += `<li class="list_item passed-words letter">${letter}</li>`;

      count++;
    });
    received_list.innerHTML = html;
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
    let userUID = localStorage.getItem("user_id");
    let userRef = db.collection("users").doc(userUID);
    let inputList = document.querySelectorAll(".input-cell1");
    let game_one_list = [];

    inputList.forEach((cell) => {
      game_one_list.push(cell.value);
    });

    userRef.update({
      list_one_input: game_one_list,
    });

    updateUserListToMainRoom(game_one_list);
  };

  const updateUserListToMainRoom = (list) => {
    let roomUID = localStorage.getItem("room_id");
    let roomRef = db.collection("rooms").doc(roomUID);
    let randomInt = Math.floor(Math.random() * 200);
    let list_one;

    //overwriting entire document
    list_one = {
      [randomInt]: {
        0: userID,
        1: list,
      },
    };

    return roomRef
      .set(
        {
          list_one,
        },
        { merge: true }
      )
      .then(() => {
        localStorage.setItem("g1", true);
        Game1_to_Game2();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateFinishedGameTick = () => {
    db.collection("users").doc(userID).update({ t1: true });
  };

  if (isLoading) {
    return <div className='App'>Loading...</div>;
  }

  const timer = (
    <div style={{ fontSize: "22px" }}>
      <span>{minutes}</span>:<span>{seconds}</span>
    </div>
  );

  const continueBtn = (
    <Button
      variant='outlined'
      id='continueBtn'
      type='submit'
      value={roomID}
      color='success'
    >
      Continue
    </Button>
  );

  const magnifyWords = (e) => {
    let selected = document.querySelectorAll(".selected-text");
    let currentNumber = e.target.dataset.id;
    let passedWords = document.querySelectorAll(".passed-words");

    console.log(currentNumber, "click");

    if (e.target.className === "input-cell1") {
      setNum(currentNumber);
      passedWords[currentNumber].className =
        "passed-words selected-text letter";
      for (let i = 0; i < selected.length; i++) {
        selected[i].classList.remove("selected-text");
        return (selected[i].className = "list_item passed-words letter");
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
        setNum(currentNumber);
        passedWords[currentNumber].className =
          "passed-words selected-text letter";
        for (let i = 0; i < selected.length; i++) {
          selected[i].classList.remove("selected-text");
          return (selected[i].className = "list_item passed-words letter");
        }
      } else {
        return false;
      }
    }
  };

  return (
    <div>
      <div className='main-container'>
        <div className='instructionAndTimerContainer'>
          <div className='instructions11 g1'>
            <h2>Instructions</h2>

            <p className='instruction-text'>
              Here is a list of letters <br></br>
              <br></br>
              Click the box to the left <br></br>
              of the top one and, in <br></br>
              that box, write a word <br></br>
              that letter suggests to you<br></br>
              <br></br>
              The word might begin with <br></br>
              the letter but doesn't have to. <br></br>
              <br></br>
              Pick a word you might like to write with. <br></br>
              Let your imagination run free!<br></br>
              <br></br>
              Now do the same for each letter <br></br>
              All the way down the column <br></br>
            </p>
          </div>
          <div className='t1 timer'>
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
}

export default Game1;
