import { getDateRangePickerDayUtilityClass } from "@mui/lab";
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import { useScrollTrigger } from "@mui/material";
import Button from "@mui/material/Button";

const LiveRoom = () => {
  const db = firebase.firestore();

  const [poem, setPoem] = useState([]);
  const [nodes, setNodes] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState(localStorage.getItem("username"));

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let roomID = localStorage.getItem("room_id");
    let isSolo = localStorage.getItem("solo");

    db.collection("rooms").onSnapshot((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.id === roomID) {
          setNodes(doc.data().poems);
          setLoading(false);
        }
      });
    });
  };

  const SubmitPoem = (e) => {
    e.preventDefault();
    let roomID = localStorage.getItem("room_id");
    let LSPoem = localStorage.getItem("poem");

    db.collection("rooms")
      .doc(roomID)
      .update({ poems: firebase.firestore.FieldValue.arrayUnion(LSPoem) });
  };

  /*   const SubmitMessage = (e) => {
    e.preventDefault();
    let roomID = localStorage.getItem("room_id");
    let LSusername = localStorage.getItem("username");

    console.log(message);
    console.log(roomID);

    db.collection("rooms")
      .doc(roomID)
      .update({
        poems: firebase.firestore.FieldValue.arrayUnion(
          `${LSusername}: ${message}`
        ),
      });
  }; */

  if (isLoading) {
    return <div className='App'>Loading...</div>;
  }

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          backgroundColor: "#e0ffe3",
          position: "relative",
          textAlign: "center",
          margin: "auto",
          border: "2px solid grey",
          width: "95vw",
          padding: "5px",
          borderRadius: "5px",
          marginBottom: "10px",
          height: "40px",
        }}
        id='instruction-game'
      >
        Post your poem below to share with your classmates in real-time! Your
        poems will be posted as anonymous.
      </div>
      {nodes.map((node, index) => {
        return (
          <li
            style={{
              backgroundColor: "white",
              textDecoration: "none",
              listStyleType: "none",
              width: "50vw",
              margin: "auto",
              padding: "5px",
              borderRadius: "3px",
            }}
            key={index.toString()}
          >
            {node}
          </li>
        );
      })}

      <form style={{ height: "80vh" }} onSubmit={(e) => SubmitPoem(e)}>
        <div style={{ width: "100vw", textAlign: "center" }}>
          <button style={{ margin: "auto" }}>Send Poem</button>
        </div>
      </form>
      <Button
        type='submit'
        variant='contained'
        color='success'
        onClick={SubmitPoem}
      >
        Send Poem
      </Button>
    </div>
  );
};

export default LiveRoom;
