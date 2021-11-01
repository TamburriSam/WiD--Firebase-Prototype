import firebase from "firebase/app";
import Nav from "./Nav";
import "./Nav.css";
import "firebase/firestore";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import React from "react";
import CurrentRoom from "./CurrentRoom";
import RoomLI from "./RoomLI";
import { isCompositeComponent } from "react-dom/cjs/react-dom-test-utils.production.min";

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

  const auth = firebase.auth();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setdisplayName(user.displayName);
        setuserID(user.uid);
        console.log("logged in");
      } else {
        console.log("logged out");
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

  const createNewProfile = (e) => {
    setroomID(e.target.id);
    let rooms = db.collection("rooms").doc(e.target.id);
    let id = e.target.id;
    setroomID(e.target.id);
    const currentUser = auth.currentUser.uid;
    const email = auth.currentUser.email;

    const userInfo = {
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

    watchForCount(id, userInfo);
  };

  function watchForCount(id, userInfo) {
    let activeCount, totalCount;
    let roomRef = db.collection("rooms").doc(id);

    roomRef.get().then((doc) => {
      let users = doc.data().users;
      let userArray = [];
      activeCount = doc.data().active_count;
      totalCount = doc.data().total_count;

      for (const prop in users) {
        userArray.push(users[prop].uid);
      }

      if (!userArray.includes(userID) && activeCount < totalCount) {
        roomRef
          .set(
            {
              users: userInfo,
            },
            { merge: true }
          )
          .then(() => {
            console.log("user added");
            roomRef
              .update({
                active_count: activeCount + 1,
              })
              .then(() => {
                console.log("Document successfully updated!");
                removeUsersFromOtherRooms();
              })
              .catch((error) => {
                console.error("Error updating document: ", error);
              });
          });
      }
    });
  }

  const removeUsersFromOtherRooms = () => {
    const snapshot = db
      .collection("rooms")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((collection) => {
          collection.data().users.forEach((user) => {
            console.log(user);
          });
        });
      });

    console.log(snapshot);
  };

  const watchForTotalCount = () => {};

  return (
    <div className='background'>
      {/*     <Nav name={`Hello ${displayName}`} /> */}
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
          <button onClick={createRoom} className='creater btn create-room'>
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

      <RoomLI data={data} createNewProfile={createNewProfile} />
      <button onClick={removeUsersFromOtherRooms}>test</button>
    </div>
  );
}

export default Rooms;
