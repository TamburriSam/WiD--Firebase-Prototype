import firebase from "firebase/app";
import "firebase/firestore";
import { useEffect, useState } from "react";
import Game1 from "./Game1";
import Game2 from "./Game2";
import Main_container from "./Main";
import React from "react";
import "./styles/CSSRoomLI.css";
import FavoriteLetter from "./FavoriteLetter";
import mainLogo from "./logos/whiteLogoStandalone.png";
import { useTimer } from "react-timer-hook";

import { lightBlue } from "@mui/material/colors";

function CurrentRoom({
  expiryTimestamp,
  name,
  favorite_letter,
  createNewProfile,
  CurrentRoom_to_Game1,
  GroupMode_to_Fav_letter,
}) {
  const db = firebase.firestore();
  const [nodes, setNodes] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [roomID, setroomID] = useState("");
  const [roomLoad, setroomLoad] = useState(false);
  const [users, setUsers] = useState(false);
  const [userID, setuserID] = useState(localStorage.getItem("user_id"));
  const [buttonGreeting, setButtonGreeting] = useState("Start Game");
  const [inRoom, setinRoom] = useState(false);
  const [favoriteLetter, setfavoriteLetter] = useState("");
  const [showLetter, setShowLetter] = useState(false);

  const [admin, setAdmin] = useState(false);
  const [currentRound, setCurrentRound] = useState(false);
  let gs = localStorage.getItem("game_start");
  const {
    seconds,
    minutes,

    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      startCountdown();
    },
  });

  useEffect(() => {
    const LSadmin = localStorage.getItem("isAdmin");
    if (LSadmin) {
      setAdmin(true);
    }

    console.log(currentRound);

    setroomID(localStorage.getItem("room_id"));

    selectAFavoriteLetter();
  }, []);

  useEffect(() => {
    if (inRoom) {
      db.collection("rooms")
        .doc(roomID)
        .onSnapshot((snapshot) => {
          let data = snapshot.data();
          let users = data.users;
          let game_started = data.game_started;
          let isSolo = localStorage.getItem("solo");
          let letters = [];
          let g1 = localStorage.getItem("game_start");

          for (const prop in users) {
            if (users[prop].favorite_letter !== "") {
              letters.push(users[prop].favorite_letter);
            }
          }

          let gs = localStorage.getItem("game_start");

          if ((game_started === true && Boolean(gs) !== true) || isSolo) {
            document.querySelector(".game-start").style.display = "block";
            document.querySelector(".loading").style.display = "none";

            const time = new Date();
            time.setSeconds(time.getSeconds() + 9);
            restart(time, true);

            if (isSolo) {
              mockUsers();
            }
          }
        });
    }
  }, [inRoom]);

  useEffect(() => {
    if (roomLoad) {
      db.collection("rooms")
        .doc(roomID)
        .onSnapshot((snapshot) => {
          let userArray = [];
          let users = snapshot.data().users;

          for (const prop in users) {
            userArray.push(users[prop].name);
          }

          setNodes(userArray);
          setUsers(true);
        });
    }
  }, [roomLoad]);

  useEffect(() => {
    if (users) {
      setLoading(false);
    } else {
      console.log("no users");
    }
  }, [users]);

  const selectAFavoriteLetter = (id) => {
    setroomLoad(true);
    setShowLetter(true);
  };

  const setFavLetterChange = (e) => {
    console.log(favoriteLetter);
    console.log(e.target.value.toUpperCase());
    setfavoriteLetter(e.target.value.toUpperCase());
    console.log(favoriteLetter);
  };

  const waitingRoomShift = () => {
    document.getElementById("notification").innerHTML = "Your Favorite Letter";
    document.getElementById("letterSubmit").style.display = "none";
    document.getElementById("fast-facts").style.left = "10px";
    document.getElementById("fast-facts").style.position = "absolute";
    document.getElementById("fast-facts").style.top = "130px";
    document.getElementById("waiting").style.display = "block";
    document.getElementById("current-room").style.display = "block";
    document.getElementById("current-room").style.top = "185px";

    let loadingList = document.getElementById("user-loading-list");
    loadingList.scrollTop = loadingList.scrollHeight;
  };

  const startCountdown = () => {
    localStorage.setItem("currentPage", "Game1");
    window.location.reload();

    localStorage.setItem("game_start", true);
  };

  const mockUsers = () => {
    let inputList = document.querySelector("#user-loading-list");

    let html = "";

    html += `<li>Mock Student</li>`;
    html += `<li>Mock Student</li>`;

    inputList.innerHTML += html;
  };

  const handleSoloLetterChange = () => {
    const LSfavorite_letter = localStorage.getItem("favorite_letter");

    setroomLoad(true);

    setfavoriteLetter(LSfavorite_letter.toUpperCase());

    waitingRoomShift();

    setinRoom(true);
  };

  const handleLetterChange = () => {
    if (favoriteLetter.length < 2 && typeof favoriteLetter == "string") {
      localStorage.setItem("favorite_letter", favoriteLetter.toUpperCase());
      setroomLoad(true);
      setinRoom(true);
      setfavoriteLetter(favoriteLetter.toUpperCase());

      waitingRoomShift();
    }
  };

  const terminateUser = (e) => {
    let answer = prompt(
      "Continuing will erase the room and delete all of the info and its users. Type `Y` to continue or `N` to cancel"
    );

    if (answer === "y") {
      db.collection("rooms")
        .doc(localStorage.getItem("room_id"))
        .delete()
        .then(() => {
          localStorage.removeItem("room_id");
          localStorage.removeItem("favorite_letter");
          localStorage.removeItem("waiting");
          localStorage.removeItem("room");
          localStorage.removeItem("isAdmin");
          localStorage.removeItem("adminRoom");
          window.location.reload(true);
        });
    } else {
      return false;
    }
  };

  const adminStartedGame = () => {
    setButtonGreeting("Game Started");
    let ROOMLS = localStorage.getItem("room_id");
    db.collection("rooms").doc(ROOMLS).update({ game_started: true });
  };

  const removeUser = (e) => {
    let LSroomId = localStorage.getItem("room_id");
    let userArray = [];
    let activeCount;
    let users;
    let LSsolo = localStorage.getItem("solo");
    let LSadmin = localStorage.getItem("isAdmin");

    console.log("in");

    if (LSroomId) {
      if (LSroomId !== "" && e.target.id !== LSroomId && !LSsolo) {
        console.log("here");
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
            console.log("heree");
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
            localStorage.setItem("currentPage", "Group");
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

  let content = null;

  if (isLoading) {
    return <div className='App'>Loading...</div>;
  }

  if (showLetter) {
    content = (
      <FavoriteLetter
        showLetter={showLetter}
        handleSoloLetterChange={handleSoloLetterChange}
        handleLetterChange={handleLetterChange}
        favoriteLetter={favoriteLetter.toUpperCase()}
        setFavLetterChange={setFavLetterChange}
      />
    );
  }

  return (
    <div>
      <div>{content}</div>

      <div id='waiting'>
        <p class='loading'>Waiting for users to join</p>

        <p style={{ display: "none" }} class='loading game-start'>
          Game Starting in {seconds}
        </p>
      </div>

      <div id='current-room'>
        <button id='leave-room' onClick={(e) => removeUser(e)}>
          Leave Room
        </button>
        <div className='user-online'>Users Online</div>
        {/*   {admin ? (
          <button onClick={(e) => terminateUser(e)}>Terminate Room</button>
        ) : (
          <button id='leave-room' onClick={(e) => removeUser(e)}>
            Leave Room
          </button>
        )} */}
        {/*   <button id='leave-room' onClick={(e) => removeUser(e)}>
          Leave Room
        </button> */}
        {admin ? (
          <button
            onClick={adminStartedGame}
            style={{
              backgroundColor: "red",
              top: "17px",
              position: "relative",
              border: "1px solid white",
              color: "white",
              cursor: "pointer",

              width: "10vw",
            }}
          >
            {buttonGreeting}
          </button>
        ) : null}
        <div>
          <div id='user-loading-list'>
            <ul>
              {nodes.map((node, index) => {
                return <li key={index.toString()}>{node}</li>;
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentRoom;
