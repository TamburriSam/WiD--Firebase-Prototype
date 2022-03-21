import { getDateRangePickerDayUtilityClass } from "@mui/lab";
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import { useScrollTrigger } from "@mui/material";
import Button from "@mui/material/Button";
import { jsPDF } from "jspdf";
import "./styles/Wordtable.css";

import secondaryLogo from "./logos/whiteTextLogoOnly.png";
import ghIcon from "./logos/ghicon.png";
const LiveRoom = () => {
  const db = firebase.firestore();

  const [poem, setPoem] = useState([]);
  const [nodes, setNodes] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(true);
  const [goBack, setgoBack] = useState(false);
  const [admin, setAdmin] = useState(false);

  const [buttonHTML, setButtonHTML] = useState("Post Poem");

  localStorage.getItem("username");

  useEffect(() => {
    let LSsolo = localStorage.getItem("solo");
    let LSadmin = localStorage.getItem("isAdmin");

    if (LSadmin) {
      setAdmin(LSadmin);
    }

    if (!LSsolo) {
      getData();
    } else {
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
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim `,
      `Mock Message 3`,
    ];

    setNodes(mock_msgs);
    setLoading(false);
  };

  const SubmitPoem = (e) => {
    e.preventDefault();
    let LSsolo = localStorage.getItem("solo");
    setButtonHTML("Poem Posted!");

    if (!LSsolo) {
      let roomID = localStorage.getItem("room_id");
      let LSPoem = localStorage.getItem("poem");

      setButtonHTML("Poem Sent!");

      db.collection("rooms")
        .doc(roomID)
        .update({ poems: firebase.firestore.FieldValue.arrayUnion(LSPoem) });
    } else if (count) {
      setCount(false);
      let LSPoem = localStorage.getItem("poem");
      setNodes((nodes) => [...nodes, LSPoem]);
    }
  };

  const getClassInfo = () => {
    db.collection("rooms")
      .doc(localStorage.getItem("room_id"))
      .get()
      .then((doc) => {
        let poems = doc.data().poems;
        const pdf = new jsPDF();

        let essay = document.getElementById("essay");

        pdf.text(poems, 10, 10);
        pdf.save("Class Poems.pdf");
      });
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
          backgroundColor: "#141414",
          color: "#e5e5e5",
          position: "relative",
          textAlign: "center",
          margin: "auto",
          border: "2px solid grey",
          width: "60vw",
          padding: "10px",
          borderRadius: "5px",
          top: "15px",
          marginBottom: "10px",
          height: "fit-content",
        }}
        id='instruction-game'
      >
        Post your poem below if you choose to share it. <br></br>
        Unless you sign it, your post will be anonymous. <br></br>
        Once you've posted, or decided not to, select "Exit."
      </div>

      {nodes.map((node, index) => {
        return (
          <li className='listItemLiveRoom' key={index.toString()}>
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

            {admin ? (
              <Button
                onClick={getClassInfo}
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
                Get poems
              </Button>
            ) : null}

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
                Exit
              </button>
            </div>
          </div>
        </div>
      </form>
      {/* <div id='logoBox'>
        <img id='secondaryLogo2' src={secondaryLogo} alt='' />
      </div> */}
      <footer>
        <a target='_blank' href='https://github.com/TamburriSam'>
          <img className='gitHub' src={ghIcon} alt='' />
        </a>

        <span className='footer-text'>Created by Sam Tamburri </span>
      </footer>
    </div>
  );
};

export default LiveRoom;
