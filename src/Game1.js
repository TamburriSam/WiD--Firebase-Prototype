import { alpha } from "@mui/material";
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import RoomLI from "./RoomLI";
import Game2 from "./Game2.js";
import "./Game.css";
import Button from "@mui/material/Button";

function Game1() {
  const db = firebase.firestore();

  const [roomID, setroomID] = useState("");
  const [userID, setuserID] = useState("");
  const [g2Start, setG2Start] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
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
  }, []);

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

  const populateAlphabet = () => {
    let alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
    let listofInp = document.querySelector("#input-list1");
    let buttonContainer = document.getElementById("button-container");
    let shuffledAlpha = shuffle(alphabet);
    let count = 0;
    let html = "";

    console.log(shuffledAlpha.length);

    alphabet.map((letter) => {
      html += `<li><input type="text" data-id="${count}" class="input-cell"> </input><span class="placeholder">${letter}</span> </li>`;
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

    console.log(game_one_list);
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
    return <Game2 />;
  }

  return (
    <div>
      <h1>Game One</h1>
      <form onSubmit={(e) => allEntered(e)}>
        <div id='list-container'>
          <div id='input-form'>
            <ul id='input-list1'></ul>
          </div>
        </div>
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
        </div>
      </form>
    </div>
  );
}

export default Game1;
