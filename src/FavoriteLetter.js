import { useEffect, useState } from "react";
import "./styles/CSSRoomLI.css";

const FavoriteLetter = ({
  handleLetterChange,
  setFavLetterChange,
  handleSoloLetterChange,
}) => {
  const [mounted, setmounted] = useState(false);

  useEffect(() => {
    console.log("HERE NOW");
    const LSsolo = localStorage.getItem("solo");
    const LSfavorite_letter = localStorage.getItem("favorite_letter");
    /*     document.getElementById("main-logo-container").style.display = "none";
     */

    if (LSsolo) {
      handleSoloLetterChange();

      if (LSfavorite_letter) {
        document.getElementById(
          "inputContainer"
        ).innerHTML = `<div className="alphabetInput">${LSfavorite_letter.toUpperCase()}</div>`;

        document.getElementById("inputContainer").style.fontSize = "38.5vw";
      }
    }

    /*     document.getElementById("main-logo-container").style.display = "none";
     */
    return () => {
      setmounted(true);

      console.log("unmounting fav letter");
    };
  }, []);

  return (
    <div id='fast-fact-container'>
      <div id='fast-facts' syle={{ backgroundColor: "red", display: "flex" }}>
        <div id='notification'>
          What's your favorite letter of the alphabet? Type it below.
        </div>
        <div id='inputContainer'>
          <input
            onChange={setFavLetterChange}
            className='alphabetInput'
            type='text'
            placeholder='favorite letter'
          />
        </div>
        <button id='letterSubmit' onClick={handleLetterChange}>
          submit
        </button>
      </div>
    </div>
  );
};

export default FavoriteLetter;
