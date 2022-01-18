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
  const [count, setCount] = useState(true);
  const [goBack, setgoBack] = useState(false);

  const [buttonHTML, setButtonHTML] = useState("Send Poem");

  localStorage.getItem("username");

  useEffect(() => {
    let LSsolo = localStorage.getItem("solo");

    if (!LSsolo) {
      getData();
    } else {
      console.log("ok");
      soloData();
    }
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

  const soloData = () => {
    let mock_msgs = [
      `I spot the hills
    with yellow balls in autumn. 
    I light the prairie cornfields, 
    Orange and tawny gold clusters, 
    And I am called pumpkins. 
    On the last of October,  
    When dusk is fallen,  
    Children join hands,  
    And circle round me, 
    Singing ghost songs, 
    And love to the harvest moon;
    I am a jack-o'-lantern, 
    With terrible teeth, 
    And the children know, 
    I am fooling.`,
      `White sheep, white sheep,
    On a blue hill,
    When the wind stops,
    You all stand still.
    When the wind blows,
    You walk away slow.
    White sheep, white sheep,
    Where do you go?`,
      `In winter I get up at night  
    And dress by yellow candle-light.  
    In summer, quite the other way,  
    I have to go to bed by day.`,
    ];

    setNodes(mock_msgs);
    setLoading(false);
  };

  const SubmitPoem = (e) => {
    e.preventDefault();
    let LSsolo = localStorage.getItem("solo");
    setButtonHTML("Poem Sent!");

    if (!LSsolo) {
      let roomID = localStorage.getItem("room_id");
      let LSPoem = localStorage.getItem("poem");

      setButtonHTML("Poem Sent!");

      console.log(nodes);

      db.collection("rooms")
        .doc(roomID)
        .update({ poems: firebase.firestore.FieldValue.arrayUnion(LSPoem) });
    } else if (count) {
      setCount(false);
      let LSPoem = localStorage.getItem("poem");
      setNodes((nodes) => [...nodes, LSPoem]);
    }
  };

  const endGame = () => {
    let answer = prompt(
      `All of your information will be deleted. If done- enter 'Y', if not- enter 'N'. `
    );

    if (answer === "y") {
      localStorage.clear();
      window.location.reload(true);
    } else if (answer === "n") {
      return false;
    }
  };

  if (isLoading) {
    return <div className='App'>Loading...</div>;
  }

  return (
    <div
      style={{
        backgroundColor: "transparent",
        position: "relative",
        overflowY: "scroll",
        height: "100vh",
      }}
    >
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
          top: "15px",
          marginBottom: "10px",
          height: "fit-content",
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
              position: "relative",
              top: "40px",
              marginTop: "30px",
              padding: "10px",
              borderRadius: "3px",
              border: "3px solid grey",
            }}
            key={index.toString()}
          >
            <span
              style={{
                border: "1px solid black",
                padding: "4px",
                borderRadius: "5px",
                lineHeight: 2,
                backgroundColor: "#e0ffe3",
              }}
            >
              Anonymous Live User {index}:
            </span>{" "}
            {node}
          </li>
        );
      })}

      <form onSubmit={(e) => SubmitPoem(e)}>
        <div style={{ width: "100vw", textAlign: "center" }}>
          <div
            style={{
              width: "100vw",

              height: "80px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <Button
              onClick={SubmitPoem}
              variant='outlined'
              color='success'
              style={{
                margin: "auto",
                border: "2px solid white",
                position: "relative",
                top: "80px",
                color: "white",
              }}
            >
              {buttonHTML}
            </Button>
            <div
              style={{
                position: "relative",
                width: "100vw",
              }}
            >
              <button
                onClick={endGame}
                style={{
                  position: "relative",
                  top: "150px",
                  color: "red",
                  backgroundColor: "transparent",
                  height: "40px",
                  border: "1px solid red",
                  padding: "10px",
                  borderRadius: "1px",
                  cursor: "pointer",
                }}
              >
                Finish Game
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LiveRoom;
