import IndexPage from "./IndexPage";
import ModeSelection from "./ModeSelection";
import Rooms from "./Rooms";
import SoloMode from "./SoloMode";
import { useEffect, useState } from "react";

const Main = () => {
  const [currentPage, setCurrentPage] = useState("Index");
  let content = null;

  /* Index Page */

  const IndexPage_to_mode_selection = () => {
    setCurrentPage("ModeSelection");
  };

  /* Mode Selection */

  const ModeSelection_to_Group = () => {
    setCurrentPage("Rooms");
  };

  const ModeSelection_to_Solo = () => {
    setCurrentPage("Solo");
  };

  /* Rooms */
  const Room_to_Waiting_Room = () => {
    setCurrentPage("CurrentRoom");
  };

  const Room_to_Solo = () => {
    setCurrentPage("Solo");
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
    content = <SoloMode />;
  }

  return <div>{content}</div>;
};

export default Main;
