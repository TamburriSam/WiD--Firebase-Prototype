import firebase from "firebase/app";
import logoStandAlone from "../logos/logoStandalone.png";
import white_logo_dark_bg from "../logos/white_logo_dark_background.jpg";
import blurb from "../logos/blurb10.jpeg";

import Rooms from "./Rooms";
import "../index.css";
import { useEffect, useState } from "react";
import uniqid from "uniqid";

function IndexPage(props) {
  const [inputField, setinputField] = useState("Enter a Screen Name");
  const [nextPage, setnextPage] = useState(false);
  const [uniqueId, setuniqueId] = useState(uniqid());

  const handleChange = (e) => {
    setinputField(e.target.value);

    console.log(uniqueId);
  };

  const submitForm = (e) => {
    console.log("submitted");
    console.log(inputField);
    localStorage.setItem("username", inputField);
    localStorage.setItem("user_id", uniqueId);
    setnextPage(true);
    e.preventDefault();
  };

  useEffect(() => {
    const LSitem = localStorage.getItem("username");

    if (LSitem) {
      setnextPage(true);
    }

    return () => {
      console.log("component unmounted");
    };
  }, []);

  useEffect(() => {
    console.log(nextPage);
  }, [nextPage]);

  if (nextPage) {
    return <Rooms />;
  }

  /*  const styled = (
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
  ); */
  return (
    <div id='indexBody'>
      <div id='overlay'></div>
      <div id='right-half'>
        <div id='sign-inContainer'>
          <div id='sign-inForm'>
            <h2 id='title'>
              <img id='logo-alone' src={logoStandAlone} alt='logo' />
            </h2>
            <form onSubmit={submitForm}>
              <label>
                Enter Username
                <input
                  type='text'
                  placeholder={inputField}
                  onChange={handleChange}
                />
              </label>
              <input type='submit' value='Submit' />
            </form>

            <br />
          </div>
        </div>
      </div>

      <div id='overlay-black'>
        <div id='blurbBox'>
          <div id='logoContainer'>
            <img className='logo' src={white_logo_dark_bg} alt='' />
          </div>
          <div id='#blurbContainer'>
            <img className='blurb' src={blurb} alt='' />
          </div>
        </div>

        {/*  <img id='mobile-logo' src={mobileLogo} alt='' /> */}
      </div>
    </div>
  );
}

export default IndexPage;
