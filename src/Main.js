import IndexPage from "./IndexPage";
import ModeSelection from "./ModeSelection";
import Rooms from "./Rooms";
import SoloMode from "./SoloMode";
import CurrentRoom from "./CurrentRoom";
import Game1 from "./Game1";
import Game2 from "./Game2";
import Game3 from "./Game3";
import Game4 from "./Game4";
import FavoriteLetter from "./FavoriteLetter";
import Wordtable from "./WordTable";
import LiveRoom from "./LiveRoom";
import { useEffect, useState } from "react";

const Main = () => {
  const [currentPage, setCurrentPage] = useState("Index");
  let content = null;

  useEffect(() => {
    console.log(currentPage);

    let localStorageCurrentPage = localStorage.getItem("currentPage");

    switch (localStorageCurrentPage) {
      case "ModeSelection":
        setCurrentPage("ModeSelection");
        break;
      case "Solo":
        setCurrentPage("Solo");
        break;
      case "Group":
        setCurrentPage("Group");
        break;
      case "CurrentRoom":
        setCurrentPage("CurrentRoom");
        break;
      case "Game1":
        setCurrentPage("Game1");
        break;
      case "Game2":
        setCurrentPage("Game2");
        break;
      case "Game3":
        setCurrentPage("Game3");
        break;
      case "Game4":
        setCurrentPage("Game4");
        break;
      case "FavoriteLetter":
        setCurrentPage("FavoriteLetter");
        break;
      case "WordTable":
        setCurrentPage("WordTable");
        break;
      case "LiveRoom":
        setCurrentPage("LiveRoom");
        break;
      default:
        console.log(`switch works`);
    }
  }, []);

  /* Index Page */

  const IndexPage_to_mode_selection = () => {
    setCurrentPage("ModeSelection");
    localStorage.setItem("currentPage", "ModeSelection");
  };

  /* Mode Selection */

  const ModeSelection_to_Group = () => {
    setCurrentPage("Rooms");
    localStorage.setItem("currentPage", "Group");
  };

  const ModeSelection_to_Solo = () => {
    setCurrentPage("Solo");
    localStorage.setItem("currentPage", "Solo");
  };

  /* Rooms */
  const Room_to_Waiting_Room = () => {
    setCurrentPage("CurrentRoom");
  };

  const Room_to_Solo = () => {
    setCurrentPage("Solo");
  };

  /* Solo Mode */

  const SoloMode_to_current_room = () => {
    setCurrentPage("CurrentRoom");
    localStorage.setItem("currentPage", "CurrentRoom");
  };

  /* Group Mode */

  const GroupMode_to_Fav_letter = () => {
    setCurrentPage("CurrentRoom");
    localStorage.setItem("currentPage", "FavoriteLetter");
  };

  /* Game 1 */

  const CurrentRoom_to_Game1 = () => {
    setCurrentPage("Game1");
    localStorage.setItem("currentPage", "Game1");
  };

  const Game1_to_Game2 = () => {
    console.log(currentPage);
    setCurrentPage("Game2");
    localStorage.setItem("currentPage", "Game2");
  };

  const Game2_to_Game3 = () => {
    console.log("works");
    console.log(currentPage);
    setCurrentPage("Game3");
    localStorage.setItem("currentPage", "Game3");
  };

  const Game3_to_Game4 = () => {
    console.log("works");
    console.log(currentPage);
    setCurrentPage("Game4");
    localStorage.setItem("currentPage", "Game4");
  };

  const Game4_to_WordTable = () => {
    console.log("works");
    console.log(currentPage);
    setCurrentPage("WordTable");
    localStorage.setItem("currentPage", "WordTable");
  };

  const Wordtable_to_LiveRoom = () => {
    console.log("works");
    console.log(currentPage);
    setCurrentPage("LiveRoom");
    localStorage.setItem("currentPage", "LiveRoom");
  };

  /* Switch */
  if (currentPage === "Index") {
    content = (
      <IndexPage IndexPage_to_mode_selection={IndexPage_to_mode_selection} />
    );
  } else if (currentPage === "ModeSelection") {
    content = (
      <ModeSelection
        ModeSelection_to_Group={ModeSelection_to_Group}
        ModeSelection_to_Solo={ModeSelection_to_Solo}
      />
    );
  } else if (currentPage === "Rooms") {
    content = <Rooms />;
  } else if (currentPage === "Solo") {
    content = <SoloMode SoloMode_to_current_room={SoloMode_to_current_room} />;
  } else if (currentPage === "Group") {
    content = <Rooms />;
  } else if (currentPage === "CurrentRoom") {
    content = <CurrentRoom />;
  } else if (currentPage === "Game1") {
    content = <Game1 Game1_to_Game2={Game1_to_Game2} />;
  } else if (currentPage === "FavoriteLetter") {
    content = <FavoriteLetter />;
  } else if (currentPage === "Game2") {
    content = <Game2 Game2_to_Game3={Game2_to_Game3} />;
  } else if (currentPage === "Game3") {
    content = <Game3 Game3_to_Game4={Game3_to_Game4} />;
  } else if (currentPage === "Game4") {
    content = <Game4 Game4_to_WordTable={Game4_to_WordTable} />;
  } else if (currentPage === "WordTable") {
    content = <Wordtable Wordtable_to_LiveRoom={Wordtable_to_LiveRoom} />;
  } else if (currentPage === "LiveRoom") {
    content = <LiveRoom />;
  }
  return <div style={{ backgroundColor: "#141414" }}>{content}</div>;
};

export default Main;
