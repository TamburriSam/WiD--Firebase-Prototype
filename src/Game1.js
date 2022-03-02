import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import Game2 from "./Game2.js";
import "./styles/Game.css";
import Button from "@mui/material/Button";
import { useTimer } from "react-timer-hook";
import CurrentRoom from "./CurrentRoom.js";
import Typing from "react-typing-animation";
import Timer from "./Timer.js";

function Game1({ expiryTimestamp, testGame }) {
  const db = firebase.firestore();

  const [roomID, setroomID] = useState("");
  const [userID, setuserID] = useState("");
  const [g2Start, setG2Start] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [mounted, setmounted] = useState(false);

  let content = null;

  let instruction = null;

  useEffect((e) => {
    /*   const time = new Date();
    time.setSeconds(time.getSeconds() + 420); // 10 minutes timer
    restart(time, true);
 */

    if (!mounted) {
      console.log("ok");
    }

    document.body.addEventListener("click", doThis);

    let LSroomId = localStorage.getItem("room_id");
    let LSuserId = localStorage.getItem("user_id");
    let LSg1Start = localStorage.getItem("g1");

    if (LSg1Start) {
      setG2Start(true);
    } else {
      setroomID(LSroomId);
      setuserID(LSuserId);
      populateAlphabet();
    }

    return () => {
      setmounted(true);
      setLoading(true);
      console.log("unmounting");
    };
  }, []);

  const doThis = (e) => {
    let current = e.target;
    let nextSibling = current.nextElementSibling;

    /*   while (nextSibling) {
      console.log(nextSibling);
      nextSibling = nextSibling.nextElementSibling;

      nextSibling.className == 'highlight'
    } */
  };

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
    let inputList = document.querySelectorAll(".input-cell");
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
          setG2Start(true);
        }, 4000);
      });
  };

  const populateAlphabet = () => {
    let alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
    let listofInp = document.querySelector("#input-list1");
    let buttonContainer = document.getElementById("button-container");
    let shuffledAlpha = shuffle(alphabet);
    let count = 0;
    let html = "";

    alphabet.map((letter) => {
      html += `<li><input type="text" data-id="${count}" class="input-cell"/> <span class="placeholder">${letter}</span></li><hr>`;
      count++;
    });
    listofInp.innerHTML = html;
  };

  const allEntered = (e) => {
    e.preventDefault();
    let inputList = document.querySelectorAll(".input-cell");

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
    let inputList = document.querySelectorAll(".input-cell");
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
        setG2Start(true);
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

  if (g2Start) {
    setLoading(true);
    testGame();
    /*  return <Game2 />; */
  }

  let animated = (
    <Typing>
      Here's a list of letters<br></br>
      Replace each letter with a word that you think you might like to write
      with.<br></br>
      The word can begin with the letter or not.<br></br>
      Let your mind run free!<br></br>
    </Typing>
  );

  return (
    <div>
      <h1>Game One</h1>

      <div
        style={{
          backgroundColor: "#e5e5e5",
          position: "relative",
          textAlign: "center",
          margin: "auto",
          border: "2px solid grey",
          width: "68vw",
          padding: "5px",
          borderRadius: "5px",
          marginBottom: "10px",
          height: "fit-content",
        }}
        id='instruction-game'
      >
        {animated}
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
            top: "12px",
          }}
        >
          {/*   {Timer} */}
        </div>
      </div>
      <form onSubmit={(e) => allEntered(e)}>
        <div id='list-container'>
          <div id='input-form'>
            <ul id='input-list1'></ul>
          </div>
        </div>
        <div className='overlay'></div>
        <div className='overlay'></div>
        <div id='button-container'>
          <Button
            variant='outlined'
            id='continueBtn'
            color='success'
            type='submit'
            value={roomID}
          >
            Continue
          </Button>
          <div id='timer' style={{ backgroundColor: "white" }}>
            {content}
          </div>
        </div>
      </form>
    </div>
  );
}

export default Game1;
