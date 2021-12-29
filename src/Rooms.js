import firebase from "firebase/app";
import "firebase/firestore";
import { useEffect, useState } from "react";
import React from "react";
import RoomLI from "./RoomLI";
import CurrentRoom from "./CurrentRoom";
import "./index.css";

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
  const [roomLI, setroomLI] = useState(true);

  //mount
  useEffect(() => {
    //get the username from LS and set it to a state instead of this
    const LSuserName = localStorage.getItem("username");
    const LSid = localStorage.getItem("user_id");

    if (LSuserName) {
      setdisplayName(LSuserName);
      setuserID(LSid);
      roomFullDisableBtn();
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

  const displayCreateBtns = () => {
    document.getElementById("create-room").style.display = "block";
  };

  const createRoom = (e) => {
    e.preventDefault();
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
        password,
      });
      document.getElementById("create-room").style.display = "none";
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
      rooms_joined: id,
      user_name: screenName,
    };

    const userInfoTest = {
      name: displayName,
      favorite_letter: "",
      uid: currentUser,
      rooms_joined: id,
      user_name: screenName,
      list_one_input: [],
      list_two_input: [],
      list_three_input: [],
      list_four_input: [],
      t1: false,
      t2: false,
      t3: false,
      t4: false,
      poem: "",
    };

    checkPassword(id, userInfo);
    testUpdate(currentUser, userInfoTest);
  };

  const testUpdate = (currentUser, userInfoTest) => {
    db.collection("users").doc(currentUser).set(userInfoTest);
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
        let name = doc.data().name;
        setcurrentRoomName(name);
        randomWordsFromDB();
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
          setwaitingRoom(true);
          setroomLI(false);
          /*           selectAFavoriteLetter(id);
           */ localStorage.setItem("waiting", true);
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

  const randomWordsFromDB = () => {
    let ls = localStorage.getItem("room_id");
    let roomRef = db.collection("rooms").doc(ls);
    let wordsRef = db.collection("words").doc("words");
    let roomOneArray = [];
    let roomTwoArray = [];
    let roomThreeArray = [];
    let roomFourArray = [];
    let numbers = [];
    let wordsForRoom = [];
    let randomInt;

    for (let i = 0; i < 130; i++) {
      randomInt = Math.floor(Math.random() * 1089);

      if (!numbers.includes(randomInt)) {
        numbers.push(randomInt);
      }

      if (numbers.length >= 104) break;
    }

    wordsRef
      .get()
      .then((doc) => {
        let wordBank = doc.data().words;

        numbers.forEach((number, index) => {
          wordsForRoom.push(wordBank[number]);
        });

        roomOneArray = wordsForRoom.slice(0, 26);
        roomTwoArray = wordsForRoom.slice(26, 52);
        roomThreeArray = wordsForRoom.slice(52, 78);
        roomFourArray = wordsForRoom.slice(78, 104);
      })
      .then(() => {
        updateDefaultLists(
          roomRef,
          roomOneArray,
          roomTwoArray,
          roomThreeArray,
          roomFourArray
        );
      });
  };

  const updateDefaultLists = (roomRef, one, two, three, four) => {
    let list_one = {
      0: one,
    };

    let list_two = {
      0: two,
    };

    let list_three = {
      0: three,
    };

    let list_four = {
      0: four,
    };

    return roomRef.update({
      list_one,
      list_two,
      list_three,
      list_four,
    });
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

            var jobskill_query = db
              .collection("users")
              .where("uid", "==", userID);
            jobskill_query.get().then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                doc.ref.delete();
              });
            });
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

  const roomFullDisableBtn = () => {
    let LSroomId = localStorage.getItem("room_id");
    if (!LSroomId) {
      db.collection("rooms")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            //if ls room id not found
            if (doc.data().active_count === doc.data().total_count) {
              document.getElementById(doc.id).disabled = true;
              document.getElementById(doc.id).innerHTML = "In Session";
            }
          });
        });
    } else {
      return false;
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

  const testClear = () => {
    localStorage.clear();
    window.location.reload(true);
  };

  //lets do a conditional render
  //if the waititng room is set to true
  //display a new component "waiting room" with the room info and participants in room
  if (waitingRoom) {
    /*     setroomLI(false);
     */ return (
      <CurrentRoom
        name={localStorage.getItem("room")}
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

          <button
            className='btn'
            id='createNewRoom'
            onClick={displayCreateBtns}
          >
            Create New Room
          </button>
          <br />

          <br />
          <br />
        </div>
        <button onClick={roomFullDisableBtn}>Test</button>
        <br />
        <form id='create-room' onSubmit={(e) => createRoom(e)}>
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
          <button
            type='submit'
            value='Create Room'
            className='creater btn create-room'
          >
            Create Room
          </button>
        </form>
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
      <button onClick={testClear}>clear</button>
      {roomLI ? (
        <RoomLI data={data} createNewProfile={createNewProfile} />
      ) : null}
      {/*       <RoomLI data={data} createNewProfile={createNewProfile} />
       */}{" "}
    </div>
  );
}

export default Rooms;
