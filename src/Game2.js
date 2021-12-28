import { alpha } from "@mui/material";
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import RoomLI from "./RoomLI";

const Game2 = () => {
  const db = firebase.firestore();

  const [roomID, setroomID] = useState("");
  const [userID, setuserID] = useState("");
  const [g3Start, setG3Start] = useState(false);

  useEffect(() => {
    let LSroomId = localStorage.getItem("room_id");
    let LSuserId = localStorage.getItem("user_id");
    let LSg1Start = localStorage.getItem("g1");

    setroomID(LSroomId);
    setuserID(LSuserId);
    createCells();
  }, []);

  const createCells = () => {
    let inputList = document.getElementById("input-list");

    let html;
    for (let i = 0; i < 26; i++) {
      html += `<li><input></input></li>`;
    }
    inputList.innerHTML = html;
  };

  const selectAList = () => {
    let roomRef = db.collection("rooms").doc(roomID);

    let query = db.collection("rooms");
    let list = [];

    let listForRoom = [];

    let defaultList = [];

    db.collection("rooms")
      .doc(roomID)
      .get()
      .then((doc) => {
        list.push(doc.data().list_one);
      })
      .then(() => {
        list.forEach((user) => {
          console.log(user);
          defaultList = user[0];
          for (const prop in user) {
            if (user[prop][0] !== userID) {
              listForRoom.push(user[prop][1]);
            }
          }
        });

        console.log(defaultList);
        listForRoom.shift();
        console.log(listForRoom);
      });
  };

  return (
    <div>
      <h1>Game Two</h1>
      <p>{userID}</p>
      <button onClick={selectAList}>test</button>
      <form>
        <div>
          <ul id='received_word_list'></ul>
        </div>
      </form>

      <form>
        <label>User Input List</label>
        <ul id='input-list'></ul>

        <button type='submit' value={roomID}>
          Continue
        </button>
      </form>
    </div>
  );
};

export default Game2;
