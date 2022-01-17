import firebase from "firebase/app";
import { useEffect } from "react";
import CurrentRoom from "./CurrentRoom";
import { useState } from "react";
import FavoriteLetter from "./FavoriteLetter";
import "./CSSRoomLI.css";
import Typing from "react-typing-animation";
import BarLoader from "react-spinners/ClipLoader";

const SoloMode = () => {
  const db = firebase.firestore();
  const [isLoading, setLoading] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [favoriteLetter, setfavoriteLetter] = useState("");

  useEffect(() => {
    if (localStorage.getItem("solo")) {
    }
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
            list_four_input: [],
            list_one_received: [],
            list_two_received: [],
            list_three_received: [],
            list_four_received: [],
          });
      });
  };

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
        waitingRoomShift();
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
        /*   window.location.reload(true); */
        localStorage.setItem("game_start", true);
      }
    }, 1000);
  };

  const waitingRoomShift = () => {
    document.getElementById("notification").innerHTML = "Your Favorite Letter";
    document.getElementById("letterSubmit").style.display = "none";
    /*    document.getElementById("fast-facts").style.right = "164px";
    document.getElementById("fast-facts").style.height = "71vh";
    document.getElementById("fast-facts").style.width = "63vw"; */
    document.getElementById("fast-facts").style.top = "87px";
    document.getElementById("waiting1").style.display = "block";
    /*     document.getElementById("current-room").style.display = "block";
    document.getElementById("current-room").style.bottom = "100px"; */
    /* mockUsers(); */
    startCountdown(9);
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
      content = <CurrentRoom />;
    }
  };

  /*  const mockUsers = () => {
    let inputList = document.querySelector("#user-list");

    let i = 1;

    setInterval(() => {
      if (i < 11) {
        let randomInt = Math.floor(Math.random() * 19) + 1;
        inputList.innerHTML += `<li class="profile-holder"> <img
        class="profilepic"
        src="logos/icons/${randomInt}.png"
        alt=""
      />Live Student ${i}</li>`;
        i++;
      } else {
        return false;
      }
    }, 1000);
  }; */

  if (gameStart) {
    return <CurrentRoom />;
  }

  if (isLoading) {
    return <div className='App'>Loading...</div>;
  }

  return (
    <div id='fast-facts'>
      <div id='blurb'></div>
      <div id='notification'>
        What's your favorite letter of the alphabet? Type it in the box.
        {/*    <Typing>
          <div>
            Here's a list of letters.<br></br>
            <Typing.Delay ms={1000} />
            Replace each letter with a word that you think you might like to
            write with.<br></br>
            <Typing.Delay ms={1000} />
            The word can begin with the letter or not.<br></br>
            <Typing.Delay ms={1000} />
            Let your mind run free!<br></br>
          </div>
        </Typing>
        <BarLoader color={"red"} size={150} /> */}
      </div>
      <div id='inputContainer'>
        <input
          onChange={setFavLetterChange}
          id='alphabetInput'
          type='text'
          placeholder='favorite letter'
        />
      </div>
      <button id='letterSubmit' onClick={handleLetterChange}>
        submit
      </button>
      {/* <CurrentRoom /> */}
      {content}
      <div id='waiting1'>
        <p class='loading1'>Waiting for users to join</p>
      </div>

      <div class='user-box'>
        {/*   <img class="redBtn" src="logos/red.png" alt="" />
          <img class="yellowBtn" src="logos/yellow.png" alt="" />

          <img class="greenBtn" src="logos/green.png" alt="" /> */}

        <div id='friend-title'>
          {/* <img class="friendlistlogo" src="logos/logoStandalone.png" alt="" /> */}

          <div id='friendsOnline'>
            <h5>Friends Online</h5>
          </div>
        </div>
        <div id='connectedMockPic'>
          {/* <img class="active-button" src="logos/GPCX4030.webp" alt="" /> */}
          <span class='connected'>connected</span>
        </div>
        <ul id='mock-list'></ul>
      </div>
    </div>
  );
};

export default SoloMode;
