import firebase from "firebase/app";
import "firebase/firestore";
import { useEffect, useState } from "react";
import Game1 from "./Game1";
import React from "react";
import "./CSSRoomLI.css";
import FavoriteLetter from "./FavoriteLetter";
import mainLogo from "./logos/whiteLogoStandalone.png";
import { useTimer } from "react-timer-hook";
import genUsername from "unique-username-generator";

function CurrentRoom({ expiryTimestamp, name, favorite_letter, removeUser }) {
  const db = firebase.firestore();

  const genUsername = require("unique-username-generator");

  const [nodes, setNodes] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [roomID, setroomID] = useState("");
  const [roomLoad, setroomLoad] = useState(false);
  const [users, setUsers] = useState(false);
  const [gameStart, setgameStart] = useState(false);
  const [inRoom, setinRoom] = useState(false);
  const [favoriteLetter, setfavoriteLetter] = useState("");
  const [showLetter, setShowLetter] = useState(false);
  const [numOfStudents, setNumOfStudents] = useState(9);

  const selectAFavoriteLetter = (id) => {
    setroomLoad(true);
    setShowLetter(true);
  };

  const setFavLetterChange = (e) => {
    setfavoriteLetter(e.target.value);
  };

  const waitingRoomShift = () => {
    document.getElementById("notification").innerHTML = "Your Favorite Letter";
    document.getElementById("letterSubmit").style.display = "none";
    document.getElementById("fast-facts").style.right = "164px";
    document.getElementById("fast-facts").style.height = "71vh";
    document.getElementById("fast-facts").style.width = "63vw";
    document.getElementById("fast-facts").style.top = "87px";
    document.getElementById("waiting").style.display = "block";
    document.getElementById("current-room").style.display = "block";
    document.getElementById("current-room").style.bottom = "185px";
  };

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

  const startCountdown = () => {
    setgameStart(true);

    localStorage.setItem("game_start", true);
  };

  function mockUsers() {
    let inputList = document.querySelector("#user-loading-list");
    const username = genUsername.generateUsername();

    console.log(username);

    let userArr = [];

    let html = "";

    inputList.innerHTML += `- ${username}<br>`;
  }

  const handleSoloLetterChange = () => {
    const LSfavorite_letter = localStorage.getItem("favorite_letter");

    setroomLoad(true);

    setfavoriteLetter(LSfavorite_letter);
    mockUsers();
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
    setinRoom(true);
  };

  useEffect(() => {
    setroomID(localStorage.getItem("room_id"));

    selectAFavoriteLetter();
  }, []);

  useEffect(() => {
    console.log("ok");
    if (inRoom) {
      db.collection("rooms")
        .doc(roomID)
        .onSnapshot((snapshot) => {
          let data = snapshot.data();
          let users = data.users;
          let activeCount = data.active_count;
          let totalCount = data.total_count;
          let letters = [];

          console.log("CHANGED NOWS");
          for (const prop in users) {
            if (users[prop].favorite_letter !== "") {
              letters.push(users[prop].favorite_letter);
            }
          }

          let gs = localStorage.getItem("game_start");

          if (activeCount === totalCount && Boolean(gs) !== true) {
            document.querySelector(".loading-game-start").style.display =
              "block";
            document.querySelector(".loading").style.display = "none";

            const time = new Date();
            time.setSeconds(time.getSeconds() + 9); // 10 minutes timer
            restart(time, true);
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
      console.log(nodes);
      setLoading(false);

      nodes.map((node) => {
        console.log(node);
      });
    } else {
      console.log("no users");
    }
  }, [users]);

  let gs = localStorage.getItem("game_start");

  if (gameStart) {
    return <Game1 />;
  }

  if (gs) {
    return <Game1 />;
  }

  if (isLoading) {
    return <div className='App'>Loading...</div>;
  }

  let content = null;
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

        <p class='loading-game-start'>Game Starting in {seconds}</p>
      </div>

      <div id='current-room'>
        <button id='leave-room' onClick={(e) => removeUser(e)}>
          Leave Room
        </button>
        <div>
          <div id='user-loading-header'>
            <img id='user-loading-logo' src={mainLogo} alt='' />

            <h3 id='user-title'>User List</h3>
          </div>
          <div id='user-loading-list'>
            <table>
              {nodes.map((node, index) => {
                return (
                  <thead key={index.toString()}>
                    <tr>
                      <td>-{node}</td>

                      <td></td>
                    </tr>
                  </thead>
                );
              })}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentRoom;
