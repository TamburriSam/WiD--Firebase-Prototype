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
  const [listForRoom, setListForRoom] = useState([]);
  const [what, setWhat] = useState(false);

  useEffect(() => {
    let LSroomId = localStorage.getItem("room_id");
    let LSuserId = localStorage.getItem("user_id");
    let LSg1Start = localStorage.getItem("g1");

    listInLS();

    setroomID(LSroomId);
    setuserID(LSuserId);
    createCells();
  }, []);

  useEffect(() => {
    userListFromDB();
  }, [listForRoom]);

  const createCells = () => {
    let inputList = document.getElementById("input-list");

    let html;
    for (let i = 0; i < 26; i++) {
      html += `<li><input class="input-cell"></input></li>`;
    }
    inputList.innerHTML = html;
  };

  const userListFromDB = () => {
    let received_list = document.getElementById("received_word_list");
    const LS_ITEM_list_one = localStorage
      .getItem("list_one_received")
      .split(",");

    let html;

    LS_ITEM_list_one.map((item) => {
      html += `<li class="list_item">${item}</li>`;
    });

    received_list.innerHTML = html;

    console.log(listForRoom);
  };

  const listInLS = () => {
    const LS_ITEM_list_one = localStorage.getItem("list_one_received");

    if (LS_ITEM_list_one) {
      setListForRoom(LS_ITEM_list_one.split(","));
      setWhat(true);
      console.log(`list for room`, listForRoom);
    } else {
      areThereLists();
    }
  };

  const defaultList = () => {
    let list = [];
    let defaultList = [];

    db.collection("rooms")
      .doc(roomID)
      .get()
      .then((doc) => {
        list.push(doc.data().list_one);
      })
      .then(() => {
        list.forEach((user) => {
          defaultList = user[0];
          setListForRoom(defaultList);
          console.log(defaultList);
        });
      });
  };

  //to be used on mount
  const areThereLists = () => {
    let arr = [];
    db.collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          arr.push(doc);
        });
      })
      .then(() => {
        arr.length > 1 ? selectAList() : defaultList();
      });
  };

  const selectAList = () => {
    let personSelected, personSelectedListOne, personSelectedUID;

    let haventBeenUsedLists = [];

    db.collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let ids = doc.data().uid;
          let t1 = doc.data().t1;

          if (ids !== userID && t1 == false) {
            haventBeenUsedLists.push(doc.data());
          }
        });
      })
      .then(() => {
        console.log(`havent been used`, haventBeenUsedLists);
        let random = Math.floor(Math.random() * haventBeenUsedLists.length);

        personSelected = haventBeenUsedLists[random];
        personSelectedListOne = personSelected.list_one_input;
        personSelectedUID = personSelected.uid;

        console.log(
          `person selected`,
          personSelected,
          personSelectedListOne,
          personSelectedUID
        );
      })
      .then(() => {
        localStorage.setItem("list_one_received", personSelectedListOne);
        setListForRoom(personSelectedListOne);
        updateUsersTurn(personSelectedUID);
      });
  };

  const updateUsersTurn = (id) => {
    return db.collection("users").doc(id).update({
      t1: true,
    });
  };

  const magnifyWords = (e) => {
    let inputCells = document.querySelectorAll("input-cell");

    inputCells.forEach((cell) => {
      cell.addEventListener("click", () => {
        console.log(e.target);
      });
    });
  };

  const test = () => {
    console.log(listForRoom);
  };

  return (
    <div>
      <h1>Game Two</h1>
      <p>{userID}</p>
      <button onClick={test}>test</button>
      <div
        id='list_container'
        style={{ display: "flex", justifyContent: "space-around" }}
      >
        <div>
          <ul id='received_word_list'></ul>
        </div>

        <form>
          <label>User Input List</label>
          <ul id='input-list'></ul>

          <button type='submit' value={roomID}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Game2;
