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
