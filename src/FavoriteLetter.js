import "./CSSRoomLI.css";

const FavoriteLetter = ({ handleLetterChange, setFavLetterChange }) => {
  return (
    <div id='fast-facts'>
      <div id='blurb'></div>
      <div id='notification'>
        What's your favorite letter of the alphabet? Type it in the box.
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
