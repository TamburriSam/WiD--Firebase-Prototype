import firebase from "firebase/app";
import logoStandAlone from "./logos/logoStandalone.png";
import white_logo_dark_bg from "./logos/white_logo_transparent_background.png";
import white_logo_only from "./logos/whiteTextLogoOnly.png";
import InstructionMode from "./InstructionMode";
import mobileLogo from "./logos/whiteLogoStandalone.png";
import App from "./App.js";
import Rooms from "./Rooms";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import SignInSide from "./SigninSide";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import uniqid from "uniqid";
import Button from "@mui/material/Button";
import ModeSelection from "./ModeSelection";
import Video from "./Video";
import "./styles/index.css";
import { useNavigate } from "react-router-dom";

function IndexPage({ IndexPage_to_mode_selection }) {


  const [inputField, setinputField] = useState("Enter a Screen Name");
  const [nextPage, setnextPage] = useState(false);
  const [uniqueId, setuniqueId] = useState(uniqid());
  const [showOption, setShowOption] = useState(false);
  const [instructionMode, setInstructionMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Index Mounted");

    return () => {
      console.log("Index unmoudnted");
    };
  }, []);

  const handleChange = (e) => {
    console.log(inputField);
    setinputField(e.target.value);
  };

  const video = () => {
  
      navigate("/userGuide");
    
  }

  const submitForm = (e) => {
    localStorage.setItem("username", inputField);
    localStorage.setItem("user_id", uniqueId);

    console.log(inputField);

    if (inputField.length < 2) {
      alert("Please enter a full screen name");
    } else {
      IndexPage_to_mode_selection();
    }

    if (inputField === "instruction_username") {
      /*  localStorage.setItem("instruction_mode", true); */
      setInstructionMode(true);
      alert("working");
    }

    e.preventDefault();
  };

  return (
    <div id='indexBody'>
      <div id='main-container'>
        <SignInSide video={video} submitForm={submitForm} handleChange={handleChange} />
      </div>
    </div>
  );
}

export default IndexPage;
