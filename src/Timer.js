import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import Game2 from "./Game2.js";
import "./styles/Game.css";
import Button from "@mui/material/Button";
import { useTimer } from "react-timer-hook";
import CurrentRoom from "./CurrentRoom.js";
import Typing from "react-typing-animation";

const Timer = ({ seconds }) => {
  const [timeLeft, setTimeLeft] = useState("");

  const now = Date.now();
  const then = now + seconds * 1000;

  const countDown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    if (secondsLeft <= 0) {
      clearInterval(countDown);
      console.log("done!");
      return;
    }
    displayTimeLeft(secondsLeft);
  }, 1000);

  const displayTimeLeft = (seconds) => {
    let minutesLeft = Math.floor(seconds / 60);
    let secondsLeft = seconds % 60;
    minutesLeft =
      minutesLeft.toString().length === 1 ? "0" + minutesLeft : minutesLeft;
    secondsLeft =
      secondsLeft.toString().length === 1 ? "0" + secondsLeft : secondsLeft;
    return `${minutesLeft}:${secondsLeft}`;
  };

  useEffect(() => {
    setInterval(() => {
      setTimeLeft(displayTimeLeft(seconds));
    }, 1000);
  }, [seconds]);

  useEffect(() => {
    // exit early when we reach 0
    if (!timeLeft) return;

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeLeft]);

  return (
    <div>
      <h1>{timeLeft}</h1>
    </div>
  );
};

export default Timer;
