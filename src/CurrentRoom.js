import firebase from "firebase/app";
import Nav from "./Nav";
import "./Nav.css";
import "firebase/firestore";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import React from "react";
import { isCompositeComponent } from "react-dom/test-utils";

function CurrentRoom(props) {
  const db = firebase.firestore();

  const [nodes, setNodes] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [roomID, setroomID] = useState("");
  const [roomLoad, setroomLoad] = useState(false);
  const [users, setUsers] = useState(false);

  useEffect(() => {
    setroomID(localStorage.getItem("room_id"));
    setroomLoad(true);
  }, []);

  useEffect(() => {
    if (roomLoad) {
      db.collection("rooms")
        .doc(roomID)
        .onSnapshot((snapshot) => {
          let userArray = [];
          userArray.push(snapshot.data().users);

          setNodes(userArray);
          setLoading(false);
          setUsers(true);
        });
    }
  }, [roomLoad]);

  //END HERE
  // THERES SOMETHING WRONG WITH WHEN THE NEW USER LIST OBJECT GETS PUSHED TO DB IT IS NAMING IT ZERO- SO WE HAVE AN EMPTY OBJECT AND THEN OTHER OBJECTS> SO WE CANT MAP THRU IT
  useEffect(() => {
    if (users) {
      console.log(nodes);

      let userArray = [];

      console.log(Object.entries(nodes));
    }
  }, [users]);

  if (isLoading) {
    return <div className='App'>Loading...</div>;
  }

  return (
    <div>
      <h1>You're in room {props.name}</h1>
      <h2>Your favorite letter : {props.favorite_letter}</h2>
      <h3>Users in room: </h3>

      {/*     <ul>
        {nodes.map((node, index) => {
          return <li>{node}</li>;
        })}
      </ul> */}
    </div>
  );
}

export default CurrentRoom;
