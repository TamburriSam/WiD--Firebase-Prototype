import firebase from "firebase/app";
import Nav from "./Nav";
import "./Nav.css";
import "firebase/firestore";
import { useEffect, useState } from "react";
import React from "react";
import RoomLI from "./RoomLI";
import CurrentRoom from "./CurrentRoom";
import { wait } from "@testing-library/react";
function Rooms() {
  const db = firebase.firestore();
  const auth = firebase.auth();

  const [roomName, setRoomName] = useState("");
  const [roomCount, setRoomCount] = useState("");
  const [displayName, setdisplayName] = useState("");
  const [roomID, setroomID] = useState("");
  const [userID, setuserID] = useState("");
  const [isAuth, setIsAuth] = useState();
  const [inRoom, setinRoom] = useState(false);
  const [data, setData] = useState();
  const [waitingRoom, setwaitingRoom] = useState(false);
  const [loadWaitingRoom, setloadWaitingRoom] = useState(false);
  const [currentRoomName, setcurrentRoomName] = useState("");
  const [favoriteLetter, setFavoriteLetter] = useState("");

  //auth
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setdisplayName(user.displayName);
        setuserID(user.uid);
        if (localStorage.getItem("waiting")) {
          console.log("its here");
        }
        console.log(waitingRoom);
        console.log("logged in");
      } else {
        console.log("logged out");
      }
    });
  }, [isAuth]);

  //MEMORY LEAK
  //MEMORY LEAK
  //MEMORY LEAK
  // so when you render the waiting room- the list of rooms is still updating
  // causing a no big issue error, but leaking memory and slowing appliaction
  // figure out a way to fix

  useEffect(() => {
    console.log(localStorage.getItem("room_id") !== "");

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

  //game start trigger
  /*   useEffect(() => {
    if (inRoom) {
      db.collection("rooms")
        .doc(roomID)
        .onSnapshot((snapshot) => {
          let data = snapshot.data();
          let users = data.users;
          let activeCount = data.active_count;
          let totalCount = data.total_count;
          let letters = [];
          console.log(`data`, data);

          console.log("CHANGED NOWS");
          for (const prop in users) {
            if (users[prop].favorite_letter !== "") {
              letters.push(users[prop].favorite_letter);
              console.log(letters);
              console.log(letters.length);
            }
          }
          console.log(letters.length);
          console.log(totalCount);
          console.log(letters.length === totalCount);

          if (activeCount === totalCount && letters.length === totalCount) {
            alert("Game Started");
            localStorage.setItem("game_start", true);
          }
        });
    }
  }, [inRoom]); */

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
    let LSroomId = localStorage.getItem("room_id");

    if (LSroomId) {
      removeUser(e);
    }
    setroomID(e.target.id);
    let id = e.target.id;
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
    let room = db.collection("rooms").doc(id);
    console.log(`room id`, id);
    //update to regex checking a-z eventually
    if (answer.length < 2 && typeof answer == "string") {
      console.log(`fav letter`, answer);
      localStorage.setItem("favorite_letter", answer);
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
            setwaitingRoom(true);
            setinRoom(true);

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

  //NOT WORKING
  //NOT WORKING- DOESNT FILTER OUT CERTAIN INSTANCES
  //HAVE TO TEST
  const removeUser = (e) => {
    let LSroomId = localStorage.getItem("room_id");
    let userArray = [];
    let newUserList, activeCount;

    console.log("clicked");

    if (LSroomId) {
      if (LSroomId !== "" && e.target.id !== LSroomId) {
        //also put a check for if the id of the button matches user id
        //if it does- do nothing
        db.collection("rooms")
          .doc(LSroomId)
          .get()
          .then((doc) => {
            let users = doc.data().users;
            activeCount = doc.data().active_count;
            for (const prop in users) {
              userArray.push(users[prop]);
            }

            newUserList = userArray.filter((item) => {
              return item.uid !== auth.currentUser.uid;
            });

            console.log(newUserList);
          })
          .then(() => {
            db.collection("rooms").doc(LSroomId).update({
              users: newUserList,
            });
          })
          .then(() => {
            db.collection("rooms")
              .doc(LSroomId)
              .update({
                active_count: activeCount - 1,
              });
          })
          .then(() => {
            localStorage.clear();
          })
          .then(() => {
            setTimeout(() => {
              window.location.reload(true);
            }, 1000);
          });
      }
    }
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
