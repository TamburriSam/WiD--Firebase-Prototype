import firebase from "firebase/app";
import "firebase/firestore";
import { useEffect, useState } from "react";
import React from "react";
import RoomLI from "./RoomLI";
import CurrentRoom from "./CurrentRoom";

function Rooms() {
  const db = firebase.firestore();

  const [roomName, setRoomName] = useState("");
  const [roomCount, setRoomCount] = useState("");
  const [displayName, setdisplayName] = useState("");
  const [roomID, setroomID] = useState("");
  const [userID, setuserID] = useState("");
  const [inRoom, setinRoom] = useState(false);
  const [data, setData] = useState();
  const [waitingRoom, setwaitingRoom] = useState(false);
  const [currentRoomName, setcurrentRoomName] = useState("");
  const [password, setPassword] = useState("");

  //auth
  useEffect(() => {
    //get the username from LS and set it to a state instead of this
    const LSuserName = localStorage.getItem("username");
    const LSid = localStorage.getItem("user_id");

    if (LSuserName) {
      setdisplayName(LSuserName);
      setuserID(LSid);
    } else {
      console.log("not working");
    }
  }, []);

  //MEMORY LEAK
  //MEMORY LEAK
  //MEMORY LEAK
  // so when you render the waiting room- the list of rooms is still updating
  // causing a no big issue error, but leaking memory and slowing appliaction
  // figure out a way to fix
  // somehow tear down waititng room

  useEffect(() => {
    if (
      localStorage.getItem("room_id") &&
      localStorage.getItem("room_id") !== ""
    ) {
      console.log("ok");
      setwaitingRoom(true);
    } else {
      setwaitingRoom(false);
    }
  }, []);

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
        poems: [],
        password: password,
      });
    } else {
      alert("Must Enter Number Over 1 and Less than 40");
    }
  };

  const createNewProfile = (e) => {
    let LSroomId = localStorage.getItem("room_id");

    if (LSroomId) {
      removeUser(e);
    }
    setroomID(e.target.id);
    let id = e.target.id;
    const currentUser = userID;
    const screenName = displayName;
    let rando = Math.floor(Math.random() * 1100);

    const userInfo = {
      name: displayName,
      favorite_letter: "",
      uid: currentUser,
      flag: parseInt(0),
      rooms_joined: id,
      user_name: screenName,
      list_one_input: [],
      list_two_input: [],
      list_three_input: [],
      recipients: [],
      list_four_input: [],
      list_one_received: [],
      list_two_received: [],
      list_three_received: [],
      list_four_received: [],
      poem: "",
    };

    checkPassword(id, userInfo);
  };

  const checkPassword = (id, userInfo) => {
    let answer = prompt("password please");

    let roomRef = db.collection("rooms").doc(id);

    roomRef.get().then((doc) => {
      let DBpassword = doc.data().password;

      if (DBpassword === answer) {
        watchForCount(id, userInfo);
      } else {
        alert("Wrong Password");
      }
    });
  };

  const watchForCount = (id, userInfo) => {
    let activeCount, totalCount;
    let roomRef = db.collection("rooms").doc(id);

    roomRef.get().then((doc) => {
      let users = doc.data().users;
      let userArray = [];
      activeCount = doc.data().active_count;
      totalCount = doc.data().total_count;

      console.log(users);

      for (const prop in users) {
        userArray.push(users[prop].uid);
      }

      if (!userArray.includes(userID) && activeCount < totalCount) {
        roomRef
          .update({
            users: firebase.firestore.FieldValue.arrayUnion(userInfo),
          })
          .then(() => {
            console.log("user added");
            setroomID(id);
            localStorage.setItem("room_id", id);
            roomRef
              .update({
                active_count: activeCount + 1,
              })
              .then(() => {
                /*                 setinRoom(true);
                 */ checkForLetter(id);
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
        let name = doc.data().name;
        setcurrentRoomName(name);
        localStorage.setItem("room", name);
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
        }
        console.log(`user profile`, userProfile);
      });
  };

  const selectAFavoriteLetter = (id) => {
    let answer = prompt("what your fav letter?");
    console.log(`room id`, id);
    //update to regex checking a-z eventually
    if (answer.length < 2 && typeof answer == "string") {
      console.log(`fav letter`, answer);
      localStorage.setItem("favorite_letter", answer);
    }

    setwaitingRoom(true);
    setinRoom(true);
  };

  const removeUser = (e) => {
    let LSroomId = localStorage.getItem("room_id");
    let userArray = [];
    let activeCount;
    let users;

    if (LSroomId) {
      if (LSroomId !== "" && e.target.id !== LSroomId) {
        db.collection("rooms")
          .doc(LSroomId)
          .get()
          .then((doc) => {
            users = doc.data().users;
            activeCount = doc.data().active_count;
            for (const prop in users) {
              userArray.push(users[prop]);
            }
          })
          .then(() => {
            userDeleted(LSroomId, userArray);
          })
          .then(() => {
            decreaseCount(activeCount);
          })
          .then(() => {
            removeLSitems();
          })
          .then(() => {
            setTimeout(() => {
              window.location.reload(true);
            }, 1000);
          });
      }
    }
  };

  const userDeleted = (roomID, userArray) => {
    const roomRef = db.collection("rooms").doc(roomID);
    roomRef
      .update({
        users: userArray.filter((post) => post.uid !== userID),
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  };

  const decreaseCount = (activeCount) => {
    let LSroomId = localStorage.getItem("room_id");
    db.collection("rooms")
      .doc(LSroomId)
      .update({
        active_count: activeCount - 1,
      });
  };

  const removeLSitems = () => {
    localStorage.removeItem("room_id");
    localStorage.removeItem("favorite_letter");
    localStorage.removeItem("waiting");
    localStorage.removeItem("room");
  };

  const startCountdown = (seconds) => {
    let counter = seconds;

    const interval = setInterval(() => {
      counter--;

      document.querySelector(
        "#waiting"
      ).innerHTML = `Game Starting in ${counter} seconds`;

      if (counter < 1) {
        clearInterval(interval);
        console.log("Ding!");
        window.location = "game1.html";
      }
    }, 1000);
  };

  //lets do a conditional render
  //if the waititng room is set to true
  //display a new component "waiting room" with the room info and participants in room
  if (waitingRoom) {
    return (
      <CurrentRoom
        name={localStorage.getItem("room")}
        favorite_letter={localStorage.getItem("favorite_letter")}
        removeUser={removeUser}
      />
    );
  }

  return (
    <div className='background'>
      {/*     <Nav name={`Hello ${displayName}`} /> */}
      <div className='liveRoom'>
        <div id='active-container'>
          <h1>Active Rooms</h1>
          <br></br>
          <p>Username: {displayName}</p>
          <p>Unique User Id: {userID}</p>
          <br />
          <br />

          <button className='btn' id='createNewRoom'>
            Create New Room
          </button>
          <br />

          <br />
          <br />
        </div>
        <button onClick={removeUser}>Test</button>
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
          <input
            type='password'
            id='password'
            placeholder='Room Password'
            onChange={(e) => setPassword(e.target.value)}
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
