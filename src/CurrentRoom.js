import firebase from "firebase/app";
import "firebase/firestore";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Game1 from "./Game1";
import React from "react";
import Rooms from "./Rooms";
import { isCompositeComponent } from "react-dom/test-utils";
import "./CSSRoomLI.css";
import FavoriteLetter from "./FavoriteLetter";

function CurrentRoom({ name, favorite_letter, removeUser }) {
  const db = firebase.firestore();

  const [nodes, setNodes] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [roomID, setroomID] = useState("");
  const [roomLoad, setroomLoad] = useState(false);
  const [users, setUsers] = useState(false);
  const [gameStart, setgameStart] = useState(false);
  const [inRoom, setinRoom] = useState(false);
  const [favoriteLetter, setfavoriteLetter] = useState("");
  const [showLetter, setShowLetter] = useState(false);

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
    document.getElementById("current-room").style.bottom = "100px";
  };

  const startCountdown = (seconds) => {
    let counter = seconds;

    const interval = setTimeout(() => {
      counter--;

      /*    document.querySelector(
        "#waiting"
      ).innerHTML = `Game Starting in ${counter} seconds`; */

      if (counter < 1) {
        clearInterval(interval);
        console.log("Ding!");
        setgameStart(true);
        /*   window.location.reload(true); */
        localStorage.setItem("game_start", true);
      }
    }, 1000);
  };

  const handleLetterChange = () => {
    if (favoriteLetter.length < 2 && typeof favoriteLetter == "string") {
      console.log(`fav letter`, favoriteLetter);
      localStorage.setItem("favorite_letter", favoriteLetter);
      setroomLoad(true);
      setinRoom(true);
      setfavoriteLetter(favoriteLetter);
      /*   setShowLetter(false); */
      waitingRoomShift();
    }
    setinRoom(true);
    console.log("f");
    console.log(showLetter);
  };

  useEffect(() => {
    const lsitem = localStorage.getItem("favorite_letter");
    const optionLS = localStorage.getItem("option-solo");
    setroomID(localStorage.getItem("room_id"));

    console.log(`option`, optionLS);

    selectAFavoriteLetter();

    /*   if (!lsitem ) {
      console.log("letter found YAYAYAYAYAYA");
      selectAFavoriteLetter();
    } else {
      console.log("NONONONOO");
      setShowLetter(false);

      setroomLoad(true);
      setinRoom(true);
    } */
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

          let gs = localStorage.getItem("game_start");

          if (activeCount === totalCount && Boolean(gs) !== true) {
            startCountdown(9);
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
    }
  }, [users]);

  let gs = localStorage.getItem("game_start");

  const testClear = () => {
    localStorage.clear();
    window.location.reload(true);
  };

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
        handleLetterChange={handleLetterChange}
        favoriteLetter={favoriteLetter}
        setFavLetterChange={setFavLetterChange}
      />
    );
  }

  /*  if (showLetter) {
    console.log("ok");
    return (
      <FavoriteLetter
        showLetter={showLetter}
        handleLetterChange={handleLetterChange}
        favoriteLetter={favoriteLetter}
        setFavLetterChange={setFavLetterChange}
      />
    );
  } */

  return (
    <div>
      <div>{content}</div>

      {/* {content} */}
      <div id='waiting'>
        <p class='loading'>Waiting for users to join</p>
      </div>
      <div id='current-room'>
        <button onClick={(e) => removeUser(e)}>Leave Room</button>
        <h1 className='waiting'>Waiting</h1>

        <h1>You're in room {name}</h1>
        <h2>
          Your favorite letter : {localStorage.getItem("favorite_letter")}
        </h2>
        <h3>Users in room: </h3>
        {console.log(users)}
        <table>
          {nodes.map((node, index) => {
            return (
              <thead key={index.toString()}>
                <tr>
                  <td>{node}</td>

                  <td></td>
                </tr>
              </thead>
            );
          })}
        </table>
      </div>
    </div>
  );
}

export default CurrentRoom;
