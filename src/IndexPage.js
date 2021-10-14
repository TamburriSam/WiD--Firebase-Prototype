import firebase from "firebase/app";
import logoStandAlone from "./logos/logoStandalone.png";
import white_logo_dark_bg from "./logos/white_logo_dark_background.jpg";
import blurb from "./logos/blurb10.jpeg";
import mobileLogo from "./logos/whiteLogoStandalone.png";
import App from "./App.js";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import "./index.css";

function IndexPage(props) {
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: "/main",
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
  };

  const styled = (
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
  );
  return (
    <div id='indexBody'>
      <div id='overlay'></div>
      <div id='right-half'>
        <div id='sign-inContainer'>
          <div id='sign-inForm'>
            <h2 id='title'>
              <img id='logo-alone' src={logoStandAlone} alt='logo' />
            </h2>

            {styled}
            <br />
          </div>
        </div>{" "}
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
