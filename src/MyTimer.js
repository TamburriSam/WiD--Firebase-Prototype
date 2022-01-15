import React, { useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";
import firebase from "firebase/app";

function MyTimer({ expiryTimestamp }) {
  const db = firebase.firestore();

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
      console.warn("onExpire called");
      console.log("ding");

      isAllEntered();
    },
  });

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 3); // 10 minutes timer
    restart(time, true);
  }, []);

  const isAllEntered = (list) => {
    let inputList = document.querySelectorAll(".input-cell");
    let userRef = db.collection("users").doc(localStorage.getItem("user_id"));
    let wordsRef = db.collection("words").doc("words");
    let words = "";

    wordsRef
      .get()
      .then((doc) => {
        words = doc.data().words;
      })
      .then(() => {
        inputList.forEach((word) => {
          let randomInt = Math.floor(Math.random() * 900);
          let allWords = [];

          if (word.value == "") {
            word.value = words[randomInt];
          }
        });
      })
      .then(() => {
        inputList.forEach((word) => {
          userRef.update({
            list: firebase.firestore.FieldValue.arrayUnion(word.value),
          });
        });
      });
  };

  return (
    <div
      style={{
        textAlign: "center",
        backgroundColor: "white",
        position: "relative",
        margin: "auto",
        width: "15vw",
        borderRadius: "3px",
      }}
    >
      <div style={{ fontSize: "22px" }}>
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
    </div>
  );
}

export default MyTimer;
