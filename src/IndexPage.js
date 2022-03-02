import firebase from "firebase/app";
import logoStandAlone from "./logos/logoStandalone.png";
import white_logo_dark_bg from "./logos/white_logo_transparent_background.png";
import white_logo_only from "./logos/whiteTextLogoOnly.png";
import InstructionMode from "./InstructionMode";
import blurb from "./logos/blurb10.jpeg";
import mobileLogo from "./logos/whiteLogoStandalone.png";
import App from "./App.js";
import Rooms from "./Rooms";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import uniqid from "uniqid";
import Button from "@mui/material/Button";
import ModeSelection from "./ModeSelection";
import "./styles/index.css";

function IndexPage(props) {
  const [inputField, setinputField] = useState("Enter a Screen Name");
  const [nextPage, setnextPage] = useState(false);
  const [uniqueId, setuniqueId] = useState(uniqid());
  const [showOption, setShowOption] = useState(false);
  const [instructionMode, setInstructionMode] = useState(false);

  const handleChange = (e) => {
    console.log(inputField);
    setinputField(e.target.value);
  };

  const submitForm = (e) => {
    localStorage.setItem("username", inputField);
    localStorage.setItem("user_id", uniqueId);

    console.log(inputField);

    if (inputField.length < 2) {
      alert("Please enter a full screen name");
    } else {
      setShowOption(true);
    }

    if (inputField === "instruction_username") {
      /*  localStorage.setItem("instruction_mode", true); */
      setInstructionMode(true);
      alert("working");
    }

    /* setnextPage(true); */
    e.preventDefault();
  };

  useEffect(() => {
    const LSitem = localStorage.getItem("username");

    if (LSitem) {
      setnextPage(true);
    }

    return () => {
      console.log("unmounted");
    };
  }, []);

  if (instructionMode) {
    return <InstructionMode />;
  }

  if (nextPage) {
    return <Rooms />;
  }

  if (showOption) {
    return <ModeSelection />;
  }

  return (
    <div id='indexBody'>
      <div id='main-container'>
        <div className='title'>What is this?</div>

        <ul id='main-option-container'>
          <li className='main-option'>
            <FontAwesomeIcon icon={faChevronRight} className='fontAwesome' />
            Word into Idea is a creative writing exercise.
          </li>

          <li className='main-option'>
            <FontAwesomeIcon icon={faChevronRight} className='fontAwesome' />
            Usually writing assignments ask you to put your ideas into words.
          </li>

          <li className='main-option'>
            <FontAwesomeIcon icon={faChevronRight} className='fontAwesome' />
            Today, we're going to reverse that and see how words can lead to
            ideas.
          </li>
        </ul>

        <form id='username-container' onSubmit={(e) => submitForm(e)}>
          <div className='main-option username-option'>
            Create a username to start!
          </div>
          <input onChange={handleChange} placeholder='Enter Username'></input>
          <button id='index-submit' type='submit'>
            Start
          </button>
        </form>

        <div id='nav'>
          <p>Concept: Steve Fried</p>
          <p>Realization: Sam Tamburri</p>
        </div>
      </div>
      <div id='logo2'>
        <img className='logo' src={white_logo_dark_bg} alt='' />
      </div>

      {/*  <div id='right-half'>
        <div id='sign-inContainer'>
          <form id='userName-box' onSubmit={submitForm}>
           

            <label>Enter Username</label>
            <input
              type='text'
              placeholder={inputField}
              onChange={handleChange}
              required
            />
            <button
              variant='contained'
              size='medium'
              type='submit'
              id='startBtn'
              className='startBtn'
            >
              Start
            </button>
          </form>
        </div>
      </div> */}

      {/*  <div id='overlay-black'>
        <div id='blurbBox'>
          <div id='logoContainer'>
            <img className='logo' src={white_logo_dark_bg} alt='' />
          </div>
          <div id='blurbContainer'>
            <img className='blurb' src={blurb} alt='' />
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default IndexPage;
