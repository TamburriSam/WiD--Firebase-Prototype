import React, { useEffect } from "react";
import { useTimer } from "react-timer-hook";

function MyTimer({ expiryTimestamp }) {
  const {
    seconds,
    minutes,

    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });

  useEffect(() => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 360); // 10 minutes timer
    restart(time, true);
  }, []);

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
