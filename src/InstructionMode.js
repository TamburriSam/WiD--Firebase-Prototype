import firebase from "firebase/app";
import { useEffect, useState } from "react";
import ModeSelection from "./ModeSelection";
import RoomLI from "./RoomLI";
import Rooms from "./Rooms";
import FavoriteLetter from "./FavoriteLetter";
import CurrentRoom from "./CurrentRoom";
import Game1 from "./Game1";
import Game2 from "./Game2";
import Wordtable from "./WordTable";

const InstructionMode = () => {
  const db = firebase.firestore();

  const [mode, setMode] = useState("");

  let content = null;
  if (mode === "Rooms") {
    content = <Rooms />;
  } else if (mode === "Game 1") {
    content = <Game1 />;
  } else if (mode === "Word Table") {
    content = <Wordtable />;
  } else if (mode === "Game 2") {
    content = <Game2 />;
  }

  useEffect(() => {
    setSoloRoom();
  }, []);

  const setSoloRoom = () => {
    let LSuserId = localStorage.getItem("user_id");
    localStorage.setItem("room_id", LSuserId);
    localStorage.setItem("solo", true);

    /*  randomWordsFromDB(); */
    db.collection("rooms")
      .doc(LSuserId)
      .set({
        favorite_letter: "k",
        uid: LSuserId,
        mock_messages: [],
        /* ADDING USER ID AS ROOM NAME */
        rooms_joined: LSuserId,
        list_one_input: [],
        list_two_input: [],
        list_three_input: [],
        t1: false,
        list_four_input: [],
        active_count: 1,
        total_count: 1,
        is_solo: true,
      })
      .then(() => {
        db.collection("users")
          .doc(LSuserId)
          .set({
            favorite_letter: "k",
            uid: LSuserId,
            flag: parseInt(0),
            /* ADDING USER ID AS ROOM NAME */
            rooms_joined: LSuserId,
            list_one_input: [],
            list_two_input: [],
            list_three_input: [],
            recipients: [],
            /*   poems: mock_msgs, */
            list_four_input: [],
            list_one_received: [],
            list_two_received: [],
            list_three_received: [],
            list_four_received: [],
          });
      });
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        position: "relative",
        marginBottom: "100px",
      }}
    >
      <ul>
        <li>
          <button>Mode Selection</button>
        </li>
        <li>
          <button onClick={() => setMode("Rooms")}>Rooms</button>
        </li>

        <li>
          <button>Favorite Letter</button>
        </li>

        <li>
          <button>Waiting Room</button>
        </li>

        <li>
          <button onClick={() => setMode("Game 1")}>Game 1</button>
        </li>

        <li>
          <button onClick={() => setMode("Game 2")}>Game 2</button>
        </li>

        <li>
          <button>Game 3</button>
        </li>

        <li>
          <button>Game 4</button>
        </li>

        <li>
          <button onClick={() => setMode("Word Table")}>Word Table</button>
        </li>

        <li>
          <button>Poem Posting</button>
        </li>
      </ul>
      <div>{content}</div>
    </div>
  );
};

export default InstructionMode;
