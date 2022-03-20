import firebase from "firebase/app";
import "firebase/firestore";
import { useEffect, useState } from "react";
import React from "react";
import RoomLI from "./RoomLI";
import InstructionMode from "./InstructionMode";
import CurrentRoom from "./CurrentRoom";
import TextField from "@mui/material/TextField";
import secondaryLogo from "./logos/whiteTextLogoOnly.png";
import ghIcon from "./logos/ghicon.png";
import SoloMode from "./SoloMode";
import Game1 from "./Game1";
import Wordtable from "./WordTable";
import Nav from "./Nav";
import Button from "@mui/material/Button";
import "./styles/Nav.css";
import background from "./logos/green3.jpg";
import uniqid from "uniqid";
import mainLogo from "./logos/whiteLogoStandalone.png";

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
  const [isLoading, setLoading] = useState(false);
  const [solo, setSolo] = useState(false);
  const [show, setShow] = useState("");
  const [instructionMode, setInstructionMode] = useState(false);

  //mount
  useEffect(() => {
    console.log("Room mounted");
    //get the username from LS and set it to a state instead of this
    const LSuserName = localStorage.getItem("username");
    const LSid = localStorage.getItem("user_id");
    const LSwaiting = localStorage.getItem("waiting");
    const LSsolo = localStorage.getItem("solo");

    if (LSsolo) {
      return <SoloMode />;
    }

    if (LSwaiting) {
      setroomLI(false);
    }

    if (LSuserName) {
      setdisplayName(LSuserName);
      setuserID(LSid);
    } else {
      console.log("not working");
    }

    return () => {
      console.log("Rooms unmounted");
    };
  }, []);

  useEffect(() => {
    if (
      localStorage.getItem("room_id") &&
      localStorage.getItem("room_id") !== "" /* &&
      !localStorage.getItem("isAdmin") */
    ) {
      console.log("ok");
      setwaitingRoom(true);
    } else {
      setwaitingRoom(false);
    }
  }, []);

  useEffect(() => {
    let LSoption = localStorage.getItem("option-solo");

    if (LSoption) {
      soloFunc();
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

    let ROOM_ID = uniqid();

    db.collection("rooms")
      .doc(ROOM_ID)
      .set({
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
        display: true,
        game_started: false,
      })
      .then(() => {
        createAdmin();
        localStorage.setItem("room_id", ROOM_ID);
      });
    document.getElementById("create-room").style.display = "none";
  };

  const closeCreateRoom = () => {
    document.getElementById("create-room").style.display = "none";
  };

  const createAdmin = () => {
    localStorage.setItem("isAdmin", true);
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
    testUpdate(currentUser, userInfoTest, e);
  };

  const testUpdate = (currentUser, userInfoTest, e) => {
    db.collection("users").doc(currentUser).set(userInfoTest);

    const LSadmin = localStorage.getItem("isAdmin");
    const LSroom_id = localStorage.getItem("room_id");
    if (LSadmin && e.target.id === LSroom_id) {
      db.collection("users").doc(currentUser).update(
        { isAdmin: true },
        {
          merge: true,
        }
      );
    }
  };

  const checkPassword = (id, userInfo) => {
    let answer = prompt("Enter Password");

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

    localStorage.setItem("currentPage", "CurrentRoom");

    roomRef.get().then((doc) => {
      let users = doc.data().users;
      let userArray = [];
      activeCount = doc.data().active_count;
      totalCount = doc.data().total_count;

      for (const prop in users) {
        userArray.push(users[prop].uid);
      }

      if (!userArray.includes(userID)) {
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
          setwaitingRoom(true);
          setroomLI(false);
          localStorage.setItem("waiting", true);
        }
      });
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
    let LSsolo = localStorage.getItem("solo");
    let LSadmin = localStorage.getItem("isAdmin");

    if (LSroomId) {
      if (LSroomId !== "" && e.target.id !== LSroomId && !LSsolo) {
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

            let user_query = db.collection("users").where("uid", "==", userID);
            user_query.get().then(function (querySnapshot) {
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
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminRoom");
  };

  const roomFullDisableBtn = () => {
    let LSroomId = localStorage.getItem("room_id");
    if (!LSroomId) {
      db.collection("rooms")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {});
        });
    } else {
      return false;
    }
  };

  const testClear = () => {
    localStorage.clear();
    window.location.reload(true);
  };

  const soloFunc = () => {
    setSolo(true);
  };

  useEffect(() => {
    const instruction_mode = localStorage.getItem("instruction_mode");

    if (instruction_mode) {
      setInstructionMode(true);
    }
  }, []);

  if (isLoading) {
    return <div className='App'>Loading...</div>;
  }

  let content = null;
  if (waitingRoom) {
    content = (
      <CurrentRoom
        name={localStorage.getItem("room")}
        createNewProfile={createNewProfile}
        removeUser={removeUser}
      />
    );
  } else if (solo) {
    content = <SoloMode />;
  } else if (roomLI) {
    content = (
      <RoomLI
        data={data}
        createNewProfile={createNewProfile}
        roomFullDisableBtn={roomFullDisableBtn}
        soloFunc={soloFunc}
        displayCreateBtns={displayCreateBtns}
      />
    );
  }

  return (
    <div className='background'>
      <div id='overlay'></div>
      <div id='liveRoom-container'>
        <div id='main-logo-container'>
          <a href='rooms.html'>
            {<img id='mainLogo' src={mainLogo} alt='' />}
            <img id='secondaryLogo' src={secondaryLogo} alt='' />
          </a>
        </div>
        <div className='liveRoom'>
          <div id='active-container'>
            <form id='create-room' onSubmit={(e) => createRoom(e)}>
              <p style={{ marginBottom: "10px" }}>
                The creator of the room will be the administrator by default.
              </p>
              <TextField
                label='Room Name'
                size='small'
                type='text'
                id='room-name'
                onChange={(e) => setRoomName(e.target.value)}
                placeholder='Room Name'
                required
              />
              <TextField
                label='Password'
                size='small'
                type='password'
                id='password'
                placeholder='Room Password'
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type='submit'
                value='Create Room'
                variant='contained'
                size='small'
                id='create-final-btn'
                className='creater create-room'
              >
                Create Room
              </Button>
              <Button onClick={closeCreateRoom} type='button'>
                Cancel
              </Button>
            </form>

            <div>{content}</div>

            <div>{instructionMode ? <InstructionMode /> : null}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rooms;
