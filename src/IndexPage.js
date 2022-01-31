import firebase from "firebase/app";
import logoStandAlone from "./logos/logoStandalone.png";
import white_logo_dark_bg from "./logos/white_logo_dark_background.jpg";
import white_logo_only from "./logos/whiteTextLogoOnly.png";

import blurb from "./logos/blurb10.jpeg";
import mobileLogo from "./logos/whiteLogoStandalone.png";
import App from "./App.js";
import Rooms from "./Rooms";
import "./index.css";
import { useEffect, useState } from "react";
import uniqid from "uniqid";
import Button from "@mui/material/Button";
import ModeSelection from "./ModeSelection";
import "./index.css";

function IndexPage(props) {
  const [inputField, setinputField] = useState("Enter a Screen Name");
  const [nextPage, setnextPage] = useState(false);
  const [uniqueId, setuniqueId] = useState(uniqid());
  const [showOption, setShowOption] = useState(false);

  const handleChange = (e) => {
    setinputField(e.target.value);

    console.log(uniqueId);
  };

  const submitForm = (e) => {
    console.log("submitted");
    console.log(inputField);
    localStorage.setItem("username", inputField);
    localStorage.setItem("user_id", uniqueId);

    setShowOption(true);
    /* setnextPage(true); */
    e.preventDefault();
  };

  useEffect(() => {
    const LSitem = localStorage.getItem("username");

    if (LSitem) {
      setnextPage(true);
    }
  }, []);

  useEffect(() => {
    console.log(nextPage);
  }, [nextPage]);

  if (nextPage) {
    return <Rooms />;
  }

  if (showOption) {
    return <ModeSelection />;
  }

  return (
    <div id='indexBody'>
      <div id='overlay'></div>
      <div id='right-half'>
        <div id='sign-inContainer'>
          <form id='userName-box' onSubmit={submitForm}>
            <div id='logo-container-index'>
              <img id='logo-alone' src={logoStandAlone} alt='logo' />
            </div>

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
      </div>

      <div id='overlay-black'>
        <div id='blurbBox'>
          <div id='logoContainer'>
            <img className='logo' src={white_logo_dark_bg} alt='' />
          </div>
          <div id='blurbContainer'>
            <img className='blurb' src={blurb} alt='' />
          </div>
        </div>

        {/*  <img id='mobile-logo' src={mobileLogo} alt='' /> */}
      </div>
    </div>
  );
}

export default IndexPage;
