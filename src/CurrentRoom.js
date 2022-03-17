import firebase from "firebase/app";
import "firebase/firestore";
import { useEffect, useState } from "react";
import Game1 from "./Game1";
import Game2 from "./Game2";

import React from "react";
import "./styles/CSSRoomLI.css";
import FavoriteLetter from "./FavoriteLetter";
import mainLogo from "./logos/whiteLogoStandalone.png";
import { useTimer } from "react-timer-hook";
import genUsername from "unique-username-generator";
import { lightBlue } from "@mui/material/colors";

function CurrentRoom({
  expiryTimestamp,
  name,
  favorite_letter,
  removeUser,
  createNewProfile,
}) {
  const db = firebase.firestore();
  const genUsername = require("unique-username-generator");
  const [nodes, setNodes] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [roomID, setroomID] = useState("");
  const [roomLoad, setroomLoad] = useState(false);
  const [users, setUsers] = useState(false);
  const [gameStart, setgameStart] = useState(false);
  const [gameStart2, setgameStart2] = useState(false);
  const [inRoom, setinRoom] = useState(false);
  const [favoriteLetter, setfavoriteLetter] = useState("");
  const [showLetter, setShowLetter] = useState(false);
  const [numOfStudents, setNumOfStudents] = useState(9);
  const [count, setCount] = useState(9);
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

          if (
            (game_started === true && Boolean(gs) !== true) ||
            (isSolo && !g1)
          ) {
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
    setfavoriteLetter(e.target.value.toUpperCase());
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
    /* setgameStart(true); */
    setCurrentRound(1);
    localStorage.setItem("current_round", 1);

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

    setfavoriteLetter(LSfavorite_letter);

    waitingRoomShift();

    setinRoom(true);
  };

  const handleLetterChange = () => {
    if (favoriteLetter.length < 2 && typeof favoriteLetter == "string") {
      localStorage.setItem("favorite_letter", favoriteLetter);
      setroomLoad(true);
      setinRoom(true);
      setfavoriteLetter(favoriteLetter);

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
    let ROOMLS = localStorage.getItem("room_id");
    db.collection("rooms").doc(ROOMLS).update({ game_started: true });
  };

  const testGame = () => {
    setCurrentRound(2);
  };
  let content = null;

  useEffect(() => {
    console.log(currentRound);
  }, [currentRound]);

  if (currentRound == 1) {
    return <Game1 testGame={testGame} />;
  } else if (currentRound == 2) {
    return <Game2 />;
  }

  if (gs) {
    return <Game1 testGame={testGame} />;
  }

  /* if (gameStart) {
    return <Game1 testGame={testGame} />;
  }

  

  if (gameStart2) {
   

     setgameStart(false);
    console.log("ok done"); 
      return <Game2 />; 
  } */

  if (isLoading) {
    return <div className='App'>Loading...</div>;
  }

  if (showLetter) {
    content = (
      <FavoriteLetter
        showLetter={showLetter}
        handleSoloLetterChange={handleSoloLetterChange}
        handleLetterChange={handleLetterChange}
        favoriteLetter={favoriteLetter}
        setFavLetterChange={setFavLetterChange}
      />
    );
  }

  return (
    <div>
      <div>{content}</div>

      <div id='waiting'>
        <p class='loading'>Waiting for users to join</p>

        <p class='loading game-start'>Game Starting in {seconds}</p>
      </div>

      <div id='current-room'>
        <button id='leave-room' onClick={(e) => removeUser(e)}>
          Leave Room
        </button>
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

        <div>
          <div id='user-loading-list'>
            Users Online
            <ul>
              {nodes.map((node, index) => {
                return <li key={index.toString()}>{node}</li>;
              })}
            </ul>
          </div>
        </div>
      </div>

      {admin ? (
        <button
          onClick={adminStartedGame}
          style={{
            backgroundColor: "red",
            width: "10vw",
            position: "absolute",
            bottom: "40px",
          }}
        >
          Start Game
        </button>
      ) : null}
    </div>
  );
}

export default CurrentRoom;
