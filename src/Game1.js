import { alpha } from "@mui/material";
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";

function Game1() {
  const db = firebase.firestore();

  const [roomID, setroomID] = useState("");
  const [userID, setuserID] = useState("");

  useEffect(() => {
    let LSroomId = localStorage.getItem("room_id");
    let LSuserId = localStorage.getItem("user_id");

    setroomID(LSroomId);
    setuserID(LSuserId);
    populateAlphabet();
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
    let listofInp = document.querySelector("#input-list");
    let buttonContainer = document.getElementById("button-container");
    let shuffledAlpha = shuffle(alphabet);
    let count = 0;
    let html = "";

    console.log(shuffledAlpha.length);

    alphabet.map((letter) => {
      html += `<li><input type="text" data-id="${count}" class="input-cell" </input><span class="placeholder">${letter}</span> </li>`;
      count++;
    });
    listofInp.innerHTML = html;
    buttonContainer.innerHTML = `<button data-id="next-1"class="next" id="${roomID}">Continue</button>`;
    console.log(shuffledAlpha);
  };

  const updateUserInputList = () => {
    let userRef = db.collection("rooms").doc(roomID);
    let users = "";
  };

  return (
    <div>
      <button onClick={updateUserInputList}>Test</button>
      <ul id='input-list'>
        <li>hi</li>
      </ul>

      <div id='button-container'></div>
    </div>
  );
}

export default Game1;
