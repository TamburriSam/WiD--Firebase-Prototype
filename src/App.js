import 'dotenv/config'; // This loads environment variables from .env fil
import firebase from "firebase/app";
import "firebase/auth";
import IndexPage from "./IndexPage";
import "firebase/auth";
import "firebase/firestore";
import React from "react";
import Rooms from "./Rooms";
import "firebaseui/dist/firebaseui.css";
import { Routes ,Route } from 'react-router-dom';

import { BrowserRouter } from "react-router-dom";
import Main from "./Main";
import Video from "./Video";

console.log('Environment Variables:', {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
});

function App() {
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
  };

  // Initialize Firebase

  if (!firebase.apps.length) {
    console.log('no')
    firebase.initializeApp(firebaseConfig);
  }else{
    console.log('Firebase Intialized')
  }

  return (
    <div style={{ backgroundColor: "#141414" }}>
      <BrowserRouter>
        <div style={{ backgroundColor: "#141414" }}>
          <Routes>
            <Route path='/' element={<Main/>} exact />
            <Route path='/main' element={<Rooms/>} />
            <Route path='/userGuide' element={<Video/>} exact />
            <Route element={Error} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
