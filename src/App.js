import firebase from "firebase/app";
import "firebase/auth";
import IndexPage from "./IndexPage";
import "firebase/auth";
import "firebase/firestore";
import React from "react";
import Rooms from "./Rooms";
import "firebaseui/dist/firebaseui.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Main from "./Main";

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

  return (
    <div /* style={{ backgroundImage: `url(${background1})` }} */>
      <BrowserRouter>
        <div>
          <Switch>
            <Route path='/' component={Main} exact />
            <Route path='/main' component={Rooms} />
            <Route component={Error} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
