import Typing from "react-typing-animation";

const Instruction = () => {
  return (
    <div>
      <Typing>
        Here's a list of letters<br></br>
        <Typing.Delay ms={1000} />
        Replace each letter with a word that you think you might like to write
        with.<br></br>
        <Typing.Delay ms={1000} />
        The word can begin with the letter or not.<br></br>
        <Typing.Delay ms={1000} />
        Let your mind run free!<br></br>
      </Typing>
    </div>
  );
};

export default Instruction;
