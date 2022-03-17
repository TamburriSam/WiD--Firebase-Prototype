import firebase from "firebase/app";
import { useEffect } from "react";
import CurrentRoom from "./CurrentRoom";
import { useState } from "react";
import FavoriteLetter from "./FavoriteLetter";
import "./styles/CSSRoomLI.css";

import Typing from "react-typing-animation";
import BarLoader from "react-spinners/ClipLoader";
import mainLogo from "./logos/whiteLogoStandalone.png";

const SoloMode = () => {
  const db = firebase.firestore();
  const [nodes, setNodes] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [favoriteLetter, setfavoriteLetter] = useState("");

  useEffect(() => {
    console.log("mounted");
    document.getElementById("main-logo-container").style.display = "none";

    let students = [];
    for (let i = 0; i < 10; i++) {
      students.push(`Live Student ${i}`);
    }
    console.log(students);

    document.getElementById("active-container").style.height = "100vh";
    if (localStorage.getItem("solo")) {
    }

    return () => {
      console.log("solo unmounted");
    };
  }, []);

  const setSoloRoom = () => {
    let LSuserId = localStorage.getItem("user_id");
    localStorage.setItem("room_id", LSuserId);
    localStorage.setItem("solo", true);

    randomWordsFromDB();
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
            poems: mock_msgs,
            list_four_input: [],
            list_one_received: [],
            list_two_received: [],
            list_three_received: [],
            list_four_received: [],
          });
      });
  };

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

  const randomWordsFromDB = () => {
    let ls = localStorage.getItem("room_id");
    let roomRef = db.collection("rooms").doc(ls);
    let wordsRef = db.collection("words").doc("words");
    let roomOneArray = [];
    let roomTwoArray = [];
    let roomThreeArray = [];
    let roomFourArray = [];
    let numbers = [];
    let wordsForRoom = [];
    let randomInt;

    for (let i = 0; i < 130; i++) {
      randomInt = Math.floor(Math.random() * 1089);

      if (!numbers.includes(randomInt)) {
        numbers.push(randomInt);
      }

      if (numbers.length >= 104) break;
    }

    wordsRef
      .get()
      .then((doc) => {
        let wordBank = doc.data().words;

        numbers.forEach((number, index) => {
          wordsForRoom.push(wordBank[number]);
        });

        roomOneArray = wordsForRoom.slice(0, 26);
        roomTwoArray = wordsForRoom.slice(26, 52);
        roomThreeArray = wordsForRoom.slice(52, 78);
        roomFourArray = wordsForRoom.slice(78, 104);
      })
      .then(() => {
        updateDefaultLists(
          roomRef,
          roomOneArray,
          roomTwoArray,
          roomThreeArray,
          roomFourArray
        );
      });
  };

  const updateDefaultLists = (roomRef, one, two, three, four) => {
    let list_one = {
      0: one,
    };

    let list_two = {
      0: two,
    };

    let list_three = {
      0: three,
    };

    let list_four = {
      0: four,
    };

    return roomRef
      .update({
        list_one,
        list_two,
        list_three,
        list_four,
      })
      .then(() => {
        /* startGame(); */
        /*  waitingRoomShift(); */
      });
  };

  const startCountdown = (seconds) => {
    let counter = seconds;

    const interval = setInterval(() => {
      counter--;

      document.querySelector(
        "#waiting1"
      ).innerHTML = `Game Starting in ${counter} seconds`;

      if (counter < 1) {
        clearInterval(interval);
        console.log("Ding!");
        setGameStart(true);
        localStorage.setItem("game_start", true);
      }
    }, 1000);
  };

  const waitingRoomShift = () => {
    document.getElementById("notification").innerHTML = "Your Favorite Letter";
    document.getElementById("letterSubmit").style.display = "none";
    document.getElementById("fast-facts").style.right = "164px";
    document.getElementById("fast-facts").style.top = "87px";
    document.getElementById("fast-facts").style.height = "70vh";
    document.getElementById("waiting1").style.display = "block";
  };

  const startGame = () => {
    setGameStart(true);
  };

  let content = null;

  const setFavLetterChange = (e) => {
    setfavoriteLetter(e.target.value);
  };
  const handleLetterChange = () => {
    if (favoriteLetter.length < 2 && typeof favoriteLetter == "string") {
      console.log(`fav letter`, favoriteLetter);
      localStorage.setItem("favorite_letter", favoriteLetter);
      setSoloRoom();
      setfavoriteLetter(favoriteLetter);
      setLoading(false);
      setGameStart(true);
    }
  };

  if (gameStart) {
    return <CurrentRoom />;
  }

  if (isLoading) {
    return <div className='App'>Loading...</div>;
  }

  return (
    <div id='fast-fact-container'>
      <div id='fast-facts'>
        <div id='notification'>
          What's your favorite letter of the alphabet? Type it in the box.
        </div>
        <div id='inputContainer'>
          <input
            onChange={setFavLetterChange}
            className='alphabetInput'
            type='text'
            placeholder='favorite letter'
          />
        </div>
        <button id='letterSubmit' onClick={handleLetterChange}>
          submit
        </button>

        {content}
        <div id='waiting1'>
          <p className='loading1'>Waiting for users to join</p>
        </div>
      </div>
    </div>
  );
};

export default SoloMode;
