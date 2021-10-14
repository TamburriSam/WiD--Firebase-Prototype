import firebase from "firebase/app";
import Nav from "./Nav";
import "./Nav.css";
import "firebase/firestore";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import React from "react";
import CurrentRoom from "./CurrentRoom";
import RoomLI from "./RoomLI";

function Rooms() {
  const db = firebase.firestore();
  const [roomName, setRoomName] = useState("");
  const [roomCount, setRoomCount] = useState("");
  const [displayName, setdisplayName] = useState("");
  const [roomID, setroomID] = useState("");
  const [userID, setuserID] = useState("");
  const [roomFromDb, setroomFromDb] = useState("");
  const [count, setCount] = useState(0);
  const [isAuth, setIsAuth] = useState();
  const userLocal = JSON.parse(localStorage.getItem("user"));

  const [data, setData] = useState();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setdisplayName(user.displayName);
        setuserID(user.uid);
        console.log("ok");
      } else {
        console.log("not ok");
      }
    });
  }, [isAuth]);

  const createRoom = () => {
    if (typeof roomCount === "number" && roomCount < 40 && roomCount > 1) {
      db.collection("rooms").add({
        name: roomName,
        total_count: parseInt(roomCount),
        active_count: 0,
        list_one: [],
        list_two: [],
        list_three: [],
        list_four: [],
        users: {},
      });
    } else {
      alert("Must Enter Number Over 1 and Less than 40");
    }
  };

  const validNum = (num) => {
    if (typeof num === "number" && num > 2) {
      setRoomCount(num);
    } else {
      alert("Must be number");
    }
  };

  const setUpRooms = (data) => {
    let r = document.querySelector(".tbody1"); //if there is data

    if (data.length) {
      let html = "";
      console.log(data);

      setData(data);

      data.forEach((doc) => {
        console.log(doc.data());
      });

      /*   data.forEach((doc) => {
        const room = doc.data();

        //console.log("Iterated snapshot", room);

        const li = `<tr>
        <td>${room.name}</td>
         <td>${room.active_count}/${room.total_count} Active </td>
          <td>




           <button data-id="btn" class="waves-effect waves-light btn room-select" id="${doc.id}">Join</button> 





            </td>
          </tr><br>`;

        html += li;
      });
      r.innerHTML = html; */
    }
  };

  const watchForCount = (id) => {
    /*     let docref = db.collection("rooms").doc(roomName);
     */
    console.log(id);

    /* return db.runTransaction((transaction) => {
      return transaction.get(docref).then((doc) => {
  
        if (
          doc.data().active_count < doc.data().total_count &&
          !doc.data().users.includes(firebase.auth().currentUser.displayName)
        ) {
          let newCount = doc.data().active_count + 1;
          transaction.update(docref, { active_count: newCount });
          transaction.update(docref, {
            users: firebase.firestore.FieldValue.arrayUnion(
              firebase.auth().currentUser.displayName
            ),
          });
           checkForLetter(); 
        } else if (
          doc.data().users.includes(firebase.auth().currentUser.displayName)
        ) {
            checkForLetter(); 
        }
      });
    }); */
  };

  /*  document.body.addEventListener("click", function (e) {
    let currentUser = firebase.auth().currentUser.uid;
    let email = firebase.auth().currentUser.email;
    if (e.target.dataset.id == "btn") {
      setroomID(e.target.id);
      let rooms = db.collection("rooms").doc(e.target.id);
      let id = e.target.id;

      let userInfo = {
        [currentUser]: {
          name: displayName,

          favorite_letter: "",
             uid: currentUser,
          flag: parseInt(0),
          rooms_joined: id,
          user_name: email,
          list_one_input: [],
          list_two_input: [],
          list_three_input: [],
          recipients: [],
          list_four_input: [],
          list_one_received: [],
          list_two_received: [],
          list_three_received: [],
          list_four_received: [],
        },
      };

      console.log("ok");

      return rooms
        .set(
          {
            users: userInfo,
          },
          { merge: true }
        )
        .then(() => {
          console.log("user added");

          watchForCount(id);
                    randomWordLists();
           
        })
        .catch((err) => {
          console.log(`Err on line 254`, err);
        });
    }
  }); */

  return (
    <div className='background'>
      <Nav name={`Hello ${displayName}`} />
      <div className='liveRoom'>
        <div id='active-container'>
          <h1>Active Rooms</h1>
          <br />
          <br />

          <button className='waves-effect waves-light btn' id='createNewRoom'>
            Create New Room
            {count}
          </button>
          <br />

          <br />
          <br />
        </div>
        <br />
        <div id='create-room'>
          <input
            type='text'
            id='room-name'
            onChange={(e) => setRoomName(e.target.value)}
            placeholder='Room Name'
            required
          />
          <input
            type='text'
            id='room-count'
            placeholder='Room Count'
            onChange={(e) => setRoomCount(parseInt(e.target.value))}
            required
          />
          <button
            onClick={createRoom}
            className='creater waves-effect waves-light btn create-room'
          >
            Create Room
          </button>
        </div>
        <table className='table1 centered'>
          <thead>
            <tr>
              <th>Group Name</th>
              <th>Members Active</th>
              <th></th>
            </tr>
          </thead>

          <tbody className='tbody1'>
            <tr></tr>
          </tbody>
        </table>
      </div>
      <TextField id='outlined-basic' label='Username' variant='outlined' />
      <TextField id='filled-basic' label='Filled' variant='filled' />
      <TextField id='standard-basic' label='Standard' variant='standard' />

      <RoomLI data={data} /* clickMe={clickMe} */ />
    </div>
  );
}

export default Rooms;
