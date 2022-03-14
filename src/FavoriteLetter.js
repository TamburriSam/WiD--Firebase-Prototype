import { useEffect, useState } from "react";
import "./styles/CSSRoomLI.css";

const FavoriteLetter = ({
  handleLetterChange,
  setFavLetterChange,
  handleSoloLetterChange,
}) => {
  const [mounted, setmounted] = useState(false);

  useEffect(() => {
    const LSsolo = localStorage.getItem("solo");
    const LSfavorite_letter = localStorage.getItem("favorite_letter");

    if (!mounted) {
      console.log("ok");
    }

    if (LSsolo) {
      handleSoloLetterChange();

      if (LSfavorite_letter) {
        document.getElementById(
          "inputContainer"
        ).innerHTML = `<div className="alphabetInput">${LSfavorite_letter.toUpperCase()}</div>`;

        document.getElementById("inputContainer").style.height = "62vh";
        document.getElementById("inputContainer").style.fontSize = "54.5vw";
      }

      document.getElementById("active-container").style.height = "100vh";
    }

    return () => {
      setmounted(true);

      console.log("unmounting fav letter");
    };
  }, []);

  return (
    <div id='fast-facts'>
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
  );
};

export default FavoriteLetter;
