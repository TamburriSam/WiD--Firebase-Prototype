import firebase from "firebase/app";
import "firebase/firestore";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Game1 from "./Game1";
import React from "react";
import Rooms from "./Rooms";
import { isCompositeComponent } from "react-dom/test-utils";

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

  const selectAFavoriteLetter = (id) => {
    let answer = prompt("what your fav letter?");
    console.log(`room id`, id);
    //update to regex checking a-z eventually
    if (answer.length < 2 && typeof answer == "string") {
      console.log(`fav letter`, answer);
      localStorage.setItem("favorite_letter", answer);
      setroomLoad(true);
      setinRoom(true);
      setfavoriteLetter(answer);
    }

    /*  setwaitingRoom(true);
    setinRoom(true); */
  };

  useEffect(() => {
    const lsitem = localStorage.getItem("favorite_letter");
    setroomID(localStorage.getItem("room_id"));

    if (!lsitem) {
      selectAFavoriteLetter();
    } else {
      setroomLoad(true);
      setinRoom(true);
    }
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
            setTimeout(() => {
              alert("game start");
              setgameStart(true);
              window.location.reload(true);
              localStorage.setItem("game_start", true);
            }, 5000);
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

  if (gs) {
    return <Game1 />;
  }

  if (isLoading) {
    return <div className='App'>Loading...</div>;
  }

  return (
    <div>
      <button onClick={(e) => removeUser(e)}>Leave Room</button>
      <h1 className='waiting'>Waiting</h1>
      <h1>You're in room {name}</h1>
      <h2>Your favorite letter : {favoriteLetter}</h2>
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
  );
}

export default CurrentRoom;
