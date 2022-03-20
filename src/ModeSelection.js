import { useEffect, useState } from "react";
/* import "./index.css"; */
import logo from "./logos/whiteLogoStandalone.png";
import Rooms from "./Rooms";
import SoloMode from "./SoloMode";
import RoomLI from "./RoomLI";
const ModeSelection = ({ ModeSelection_to_Group, ModeSelection_to_Solo }) => {
  const [option, setOption] = useState("");

  useEffect(() => {
    console.log("Mode Selection mounted");

    return () => {
      console.log("Mode Selection unmounted");
    };
  }, []);

  /* if (option === "group") {
    localStorage.setItem("option", true);
    ModeSelection_to_Group();
  } else if (option === "solo") {
    localStorage.setItem("option", true);

    localStorage.setItem("option-solo", true);

    ModeSelection_to_Solo();
  } */

  return (
    <div id='mode-container'>
      <h2 id='mode-title'>There are two ways to play this game</h2>

      <div id='options-container'>
        <div className='option' id='solo'>
          <div>
            <h1 className='mode-heading solo-mode'>Solo</h1>

            <p>
              To play by yourself, <br />
              at your own pace, <br />
              select this button:
              <br />
              <br></br>
            </p>
            <button onClick={ModeSelection_to_Solo} id='mode-solo-btn'>
              Solo
            </button>
            <p>
              <br />
              The game will set up as <br />
              if there are others <br />
              playing, but it's just you <br />
              and the AI.
            </p>
          </div>
        </div>
        <div className='option' id='group'>
          <h1 className='mode-heading'>Group</h1>

          <p>
            To play in a group, <br />
            in real time, <br />
            select this button:
            <br />
            <br></br>
          </p>

          <button onClick={ModeSelection_to_Group} id='mode-group-btn'>
            Group
          </button>
          <p>
            <br />
            Select or create a room <br />
            and wait while the other <br />
            members join and you'll <br />
            be shown a starting screen.
          </p>
        </div>
      </div>
      <div id='mode-logo-container'>
        <img id='mode-logo' src={logo} alt='' />
      </div>
    </div>
  );
};

export default ModeSelection;
