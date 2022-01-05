import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import RoomLI from "./RoomLI";
import Wordtable from "./WordTable";

const Game4 = () => {
  const db = firebase.firestore();

  const [roomID, setroomID] = useState("");
  const [userID, setuserID] = useState("");
  const [listForRoom, setListForRoom] = useState([]);
  const [fp, setfp] = useState(false);

  useEffect(() => {
    let LSroomId = localStorage.getItem("room_id");
    let LSuserId = localStorage.getItem("user_id");

    /*  localStorage.setItem("g2", true); */

    let g4LS = localStorage.getItem("g4");

    if (g4LS == "true") {
      setfp(true);
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
    const LS_ITEM_list_three = localStorage.getItem("list_three_received");

    if (LS_ITEM_list_three) {
      displayListFromDB(LS_ITEM_list_three);
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
    let personSelected, personSelectedListThree, personSelectedUID;

    let haventBeenUsedLists = [];

    let roomUID = localStorage.getItem("room_id");
    let userUID = localStorage.getItem("user_id");

    console.log(`USER ID`, userUID);

    db.collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let ids = doc.data().uid;
          let t3 = doc.data().t3;
          let rooms_joined = doc.data().rooms_joined;
          let list_three_input = doc.data().list_three_input;
          let listlength = list_three_input.length;
          console.log(listlength);

          console.log(rooms_joined === roomUID);

          if (ids !== userUID && t3 == false && rooms_joined === roomUID) {
            haventBeenUsedLists.push(doc.data());
            console.log(haventBeenUsedLists);
          } else {
            return false;
          }
        });
      })
      .then(() => {
        haventBeenUsedLists.map((item) => {
          let list_three = item.list_three_input;

          if (list_three.length == 26) {
            console.log(`havent been used`, haventBeenUsedLists);
            let random = Math.floor(Math.random() * haventBeenUsedLists.length);

            personSelected = haventBeenUsedLists[random];
            personSelectedListThree = personSelected.list_three_input;
            personSelectedUID = personSelected.uid;

            console.log(
              `person selected`,
              personSelected,
              personSelectedListThree,
              personSelectedUID
            );

            localStorage.setItem(
              "list_three_received",
              personSelectedListThree
            );
            console.log("person selected", personSelectedListThree);
            displayListFromDB(personSelectedListThree);
          } else {
            defaultList();
          }
        });
      })
      .then(() => {
        updateUsersTurn(personSelectedUID);
      });
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
          console.log(list);
          defaultList = user[0];
          localStorage.setItem("list_three_received", defaultList);
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
    return db.collection("users").doc(id).update({ t3: true });
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
    let game_four_list = [];

    inputList.forEach((cell) => {
      game_four_list.push(cell.value);
    });

    userRef.update({
      list_four_input: game_four_list,
    });

    updateUserListToMainRoom(game_four_list);

    console.log(game_four_list);
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
        localStorage.setItem("g4", true);
        setfp(true);
      });
  };

  if (fp) {
    return <Wordtable />;
  }

  const test = () => {
    let room_id = localStorage.getItem("room_id");

    db.collection("rooms")
      .doc(room_id)
      .get()
      .then((doc) => {
        console.log(doc.data().list_one);
        console.log(doc.data().list_two);
      });
  };

  return (
    <div>
      <h1>Game Four</h1>
      <p>{userID}</p>
      <button onClick={test}>test</button>
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

export default Game4;
