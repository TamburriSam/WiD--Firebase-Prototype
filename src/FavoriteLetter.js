import { useEffect } from "react";
import "./styles/CSSRoomLI.css";

const FavoriteLetter = ({
  handleLetterChange,
  setFavLetterChange,
  handleSoloLetterChange,
}) => {
  useEffect(() => {
    const LSsolo = localStorage.getItem("solo");
    const LSfavorite_letter = localStorage.getItem("favorite_letter");

    if (LSsolo) {
      handleSoloLetterChange();

      if (LSfavorite_letter) {
        document.getElementById(
          "inputContainer"
        ).innerHTML = `<div>${LSfavorite_letter.toUpperCase()}</div>`;
      }

      document.getElementById("active-container").style.height = "100vh";
    }
  }, []);

  return (
    <div id='fast-facts'>
      <div id='blurb'></div>
      <div id='notification'>
        What's your favorite letter of the alphabet? Type it below.
      </div>
      <div id='inputContainer'>
        <input
          onChange={setFavLetterChange}
          id='alphabetInput'
          type='text'
          placeholder='favorite letter'
        />
      </div>
      <button id='letterSubmit' onClick={handleLetterChange}>
        submit
      </button>
    </div>
  );
};

export default FavoriteLetter;
