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
  const auth = firebase.auth();

  const [roomName, setRoomName] = useState("");
  const [roomCount, setRoomCount] = useState("");
  const [displayName, setdisplayName] = useState("");
  const [roomID, setroomID] = useState("");
  const [userID, setuserID] = useState("");
  const [roomFromDb, setroomFromDb] = useState("");
  const [count, setCount] = useState(0);
  const [isAuth, setIsAuth] = useState();
  const [inRoom, setinRoom] = useState(false);
  const [data, setData] = useState();
  const [waitingRoom, setwaitingRoom] = useState(false);
  const [loadWaitingRoom, setloadWaitingRoom] = useState(false);
  //auth
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setdisplayName(user.displayName);
        setuserID(user.uid);
        if (localStorage.getItem("waiting")) {
          console.log("its here");
        }
        console.log("logged in");
      } else {
        console.log("logged out");
      }
    });
  }, [isAuth]);

  //if theres been a room entered before- local storage should load the waiting room for that room
  useEffect(() => {
    console.log("changed");
    console.log(roomID);

    setloadWaitingRoom(true);
  }, [waitingRoom]);

  //game room switch - takes user out of room on unmount or room switch
  useEffect(() => {
    console.log("switched");
    setTimeout(() => {
      if (roomID) {
        db.collection("rooms")
          .doc(roomID)
          .get()
          .then((doc) => {
            console.log(doc.data());
          });
      }
    }, 1000);
  }, [roomID]);

  //game start trigger
  useEffect(() => {
    if (inRoom) {
      db.collection("rooms")
        .doc(roomID)
        .onSnapshot((snapshot) => {
          let data = snapshot.data();
          let activeCount = data.active_count;
          let totalCount = data.total_count;

          if (activeCount === totalCount) {
            alert("Game Started");
          }
        });
    }
  }, [inRoom]);

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

  const watchForCount = (id, userInfo) => {
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
            setroomID(id);

            roomRef
              .update({
                active_count: activeCount + 1,
              })
              .then(() => {
                setinRoom(true);
                checkForLetter(id);
                console.log(`roomid`, id);
                console.log("Document successfully updated!");
              })
              .catch((error) => {
                console.error("Error updating document: ", error);
              });
          });
      }
    });
  };

  const checkForLetter = (id) => {
    console.log(userID);
    db.collection("rooms")
      .doc(id)
      .get()
      .then((doc) => {
        let userProfile;
        let users = doc.data().users;
        let userArray = [];
        for (const prop in users) {
          if (users[prop].uid.includes(userID)) {
            userProfile = users[prop];
          }
        }
        if (userProfile.favorite_letter == "") {
          console.log("favorite letter not found");
          selectAFavoriteLetter(id);
          localStorage.setItem("waiting", true);
          setwaitingRoom(true);
        }
        console.log(`user profile`, userProfile);
      });
  };

  const selectAFavoriteLetter = (id) => {
    let answer = prompt("what your fav letter?");
    let room = db.collection("rooms").doc(id);
    console.log(`room id`, id);
    if (answer.length < 2) {
      console.log(`fav letter`, answer);

      room.get().then((doc) => {
        return room
          .set(
            {
              users: {
                [userID]: {
                  favorite_letter: answer,
                },
              },
            },
            { merge: true }
          )
          .then(() => {
            console.log("Document successfully updated!");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
      });
    }
  };

  //the way we prevent someone from being in more than one room at a time
  //when the user clicks any join button we first need to see if there is already a room id set
  //if there is - remove them from the users array and decrease active count of room
  const removeUserFromCurrentRoomIfOtherRoomClicked = () => {};

  return (
    <div className='background'>
      {/*     <Nav name={`Hello ${displayName}`} /> */}
      <div className='liveRoom'>
        <div id='active-container'>
          <h1>Active Rooms</h1>
          <br />
          <br />

          <button className='btn' id='createNewRoom'>
            Create New Room
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
    </div>
  );
}

export default Rooms;
