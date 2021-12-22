import firebase from "firebase/app";
import "firebase/auth";
import IndexPage from "./IndexPage";
import "firebase/auth";
import "firebase/firestore";
import React from "react";
import Rooms from "./Rooms";
import "firebaseui/dist/firebaseui.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";

function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyC5rVbCI0um_Lr9mOYfLzWEsMgawMuJkTc",
    authDomain: "lucky6-f3de1.firebaseapp.com",
    projectId: "lucky6-f3de1",
    storageBucket: "lucky6-f3de1.appspot.com",
    messagingSenderId: "641900819185",
    appId: "1:641900819185:web:15e437bbc5f16017c6ef50",
  };

  // Initialize Firebase

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  // Configure FirebaseUI.
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: "/main",
    // We will display Google and Facebook as auth providers.
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  };

  const userLocal = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <BrowserRouter>
        <div>
          <Switch>
            <Route path='/' component={IndexPage} exact />
            <Route path='/main' component={Rooms} />
            <Route component={Error} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
