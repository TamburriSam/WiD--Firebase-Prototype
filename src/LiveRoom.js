import { getDateRangePickerDayUtilityClass } from "@mui/lab";
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import { useScrollTrigger } from "@mui/material";

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

  const SubmitPoem = () => {
    let roomID = localStorage.getItem("room_id");
    let LSPoem = localStorage.getItem("poem");

    db.collection("rooms")
      .doc(roomID)
      .update({ poems: firebase.firestore.FieldValue.arrayUnion(LSPoem) });
  };

  const SubmitMessage = (e) => {
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
  };

  if (isLoading) {
    return <div className='App'>Loading...</div>;
  }

  return (
    <div>
      {nodes.map((node, index) => {
        return <li key={index.toString()}>{node}</li>;
      })}

      <form onSubmit={(e) => SubmitMessage(e)}>
        <input onChange={(e) => setMessage(e.target.value)} type='text' />
        <button>Send Message</button>
      </form>
      <button onClick={SubmitPoem}>Send Poem</button>
    </div>
  );
};

export default LiveRoom;
