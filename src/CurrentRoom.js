import firebase from "firebase/app";
import Nav from "./Nav";
import "./Nav.css";
import "firebase/firestore";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import React from "react";

function CurrentRoom(props) {
  return (
    <div>
      <button
        data-id='btn'
        class='waves-effect waves-light btn room-select'
        id={props.id}
      ></button>
    </div>
  );
}

export default CurrentRoom;
