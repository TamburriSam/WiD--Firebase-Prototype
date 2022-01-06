import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import RoomLI from "./RoomLI";
import Game3 from "./Game3";

const Game2 = () => {
  const db = firebase.firestore();

  const [roomID, setroomID] = useState("");
  const [userID, setuserID] = useState("");
  const [g3Start, setG3Start] = useState(false);
  const [listForRoom, setListForRoom] = useState([]);
  const [what, setWhat] = useState(false);
  const [g3, setG3] = useState(false);
  let [g2Start, setG2start] = useState(localStorage.getItem("g2"));

  useEffect(() => {
    let LSroomId = localStorage.getItem("room_id");
    let LSuserId = localStorage.getItem("user_id");

    /*  localStorage.setItem("g2", true); */

    let g2LS = localStorage.getItem("g2");

    if (g2LS == "true") {
      setG3(true);
    }

    console.log("mounted");

    isThereAListInLS();

    setroomID(LSroomId);
    setuserID(LSuserId);
    createCells();
  }, []);

  const createCells = () => {
    let inputList = document.getElementById("input-list");

    let html;
    for (let i = 0; i < 26; i++) {
      html += `<li><input class="input-cell"></input></li>`;
    }
    inputList.innerHTML = html;
  };

  const isThereAListInLS = () => {
    const LS_ITEM_list_one = localStorage.getItem("list_one_received");
    const LS_ITEM_list_two = localStorage.getItem("list_two_received");

    if (LS_ITEM_list_one) {
      displayListFromDB(LS_ITEM_list_one);
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
      let personSelected, personSelectedListOne, personSelectedUID;

      let haventBeenUsedLists = [];

      let roomUID = localStorage.getItem("room_id");
      let userUID = localStorage.getItem("user_id");

      console.log(`USER ID`, userUID);

      db.collection("users")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let ids = doc.data().uid;
            let t1 = doc.data().t1;
            let rooms_joined = doc.data().rooms_joined;
            let list_one_input = doc.data().list_one_input;
            let listlength = list_one_input.length;
            console.log(listlength);

            console.log(rooms_joined === roomUID);

            console.log(list_one_input);

            console.log(list_one_input.length === 26);
            console.log(list_one_input.length);

            if (ids !== userUID && t1 == false && rooms_joined === roomUID) {
              haventBeenUsedLists.push(doc.data());
              console.log(haventBeenUsedLists);
            } else {
              return false;
            }
          });
        })
        .then(() => {
          haventBeenUsedLists.map((item) => {
            let list_one = item.list_one_input;

            if (list_one.length == 26) {
              console.log(`havent been used`, haventBeenUsedLists);
              let random = Math.floor(
                Math.random() * haventBeenUsedLists.length
              );

              personSelected = haventBeenUsedLists[random];
              personSelectedListOne = personSelected.list_one_input;
              personSelectedUID = personSelected.uid;

              console.log(
                `person selected`,
                personSelected,
                personSelectedListOne,
                personSelectedUID
              );

              localStorage.setItem("list_one_received", personSelectedListOne);
              console.log("person selected", personSelectedListOne);
              displayListFromDB(personSelectedListOne);
            } else {
              defaultList();
            }
          });
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

          console.log(defaultList);
        });
      });
  };

  const displayListFromDB = (list) => {
    let received_list = document.getElementById("received_word_list");

    let html;

    if (typeof list === "string") {
      list = list.split(",");
    }

    list.map((item) => {
      html += `<li class="list_item">${item}</li>`;
    });

    received_list.innerHTML = html;

    console.log(listForRoom);
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
    let LSuserId = localStorage.getItem("user_id");

    let userRef = db.collection("users").doc(LSuserId);
    let inputList = document.querySelectorAll(".input-cell");
    let game_two_list = [];

    inputList.forEach((cell) => {
      game_two_list.push(cell.value);
    });

    userRef.update({
      list_two_input: game_two_list,
    });

    updateUserListToMainRoom(game_two_list);

    console.log(game_two_list);
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
        setG3(true);
      });
  };

  if (g3) {
    return <Game3 />;
  }

  return (
    <div>
      <h1>Game Two</h1>
      <p>{userID}</p>
      <button onClick={areThereLists}>test</button>
      <div
        id='list_container'
        style={{ display: "flex", justifyContent: "space-around" }}
      >
        <div>
          <ul id='received_word_list'></ul>
        </div>

        <form onSubmit={(e) => allEntered(e)}>
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
