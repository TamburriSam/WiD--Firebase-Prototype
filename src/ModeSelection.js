import { useEffect, useState } from "react";
/* import "./index.css"; */
import logo from "./logos/whiteLogoStandalone.png";
import Rooms from "./Rooms";
import SoloMode from "./SoloMode";
import RoomLI from "./RoomLI";
const ModeSelection = ({ soloFunc }) => {
  const [option, setOption] = useState("");

  useEffect(() => {
    let LSoption = localStorage.getItem("option-solo");

    if (LSoption) {
      return <Rooms />;
    }
  }, []);

  if (option === "group") {
    localStorage.setItem("option", true);
    return <Rooms />;
  } else if (option === "solo") {
    localStorage.setItem("option", true);

    localStorage.setItem("option-solo", true);

    return <Rooms />;
  }

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
            <button onClick={() => setOption("solo")} id='mode-solo-btn'>
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

          <button onClick={() => setOption("group")} id='mode-group-btn'>
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
