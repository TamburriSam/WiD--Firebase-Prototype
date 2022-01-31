import firebase from "firebase/app";
import "firebase/firestore";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import React from "react";
import "./index.css";
import { jsPDF } from "jspdf";
import { CopyToClipboard } from "react-copy-to-clipboard";
import LiveRoom from "./LiveRoom";
import "./Wordtable.css";
import Button from "@mui/material/Button";

const Wordtable = () => {
  const db = firebase.firestore();

  const [nodes, setNodes] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [liveRoom, setLiveRoom] = useState(false);
  const [soloLive, setSoloLive] = useState(false);
  const [list, setList] = useState([]);

  let list1, list2, list3, list4;

  useEffect(() => {
    document.getElementById("active-container").style.height = "100vh";
    let LSPoem = localStorage.getItem("poem");

    if (LSPoem) {
      setLiveRoom(true);
    } else {
      getData();
    }
  }, []);

  useEffect(() => {
    const onKeyUp = (e) => {
      if (e.keyCode === 13) {
        console.log("wahoo");
      }
    };
    window.addEventListener("keyup", onKeyUp);
    return () => window.removeEventListener("keyup", onKeyUp);
  }, []);

  const getData = () => {
    let user_id = localStorage.getItem("user_id");
    let allInputs = [];
    setLoading(false);
    db.collection("users")
      .doc(user_id)
      .get()
      .then((doc) => {
        let firstCol = document.getElementById("tbody1");

        list1 = doc.data().list_one_input;
        list2 = doc.data().list_two_input;
        list3 = doc.data().list_three_input;
        list4 = doc.data().list_four_input;

        allInputs = [list1, list2, list3, list4];

        setList(allInputs);

        let testList = [];

        for (let i = 0; i < 26; i++) {
          allInputs.forEach((input) => {
            testList.push(input[i]);
          });
        }

        const result = [];

        for (let i = 0; i < testList.length; i += 4) {
          const chunk = testList.slice(i, i + 4);
          result.push(chunk);
        }

        console.log(result);

        let test = [];
        let html = "";
        result.map((item) => {
          for (let i = 0; i < item.length; i++) {
            test.push(`<div class="item${i}">${item[i]}</div>`);
          }
        });

        const result2 = [];

        for (let i = 0; i < test.length; i += 4) {
          const chunk = test.slice(i, i + 4);
          result2.push(chunk);
        }

        result2.map((item) => {
          html += `<tr><td class="listItems"><input class="word-check" type="checkbox">${item.join(
            " "
          )}</td></tr>`;
        });

        firstCol.innerHTML = html;

        crossedOffWord();
      });
  };

  const crossedOffWord = () => {
    let listItems = document.querySelectorAll(".listItems");
    let crossed = document.querySelectorAll(".crossed-word");
    let checkboxes = document.querySelectorAll(".word-check");
    let counter = 0;

    checkboxes.forEach((item, index) => {
      item.addEventListener("change", () => {
        console.log(listItems.length);
        console.log(crossed.length);
        console.log(counter++);
        if (item.className === "word-check" && item.checked) {
          console.log(item.className);
          listItems[index].classList.remove("listItems");

          listItems[index].classList.add("crossed-word");

          console.log(listItems[index].childNodes[1]);

          /*   listItems[
            index
          ].childNodes[1].innerHTML += `<input type="checkbox" />`; */

          wordCounter();
        } else {
          console.log(item.className);

          listItems[index].classList.remove("crossed-word");
          listItems[index].classList.add("listItems");
          wordCounter();
        }
      });
    });
  };

  const wordCounter = () => {
    let strikethroughs = document.querySelectorAll(".crossed-word");

    let crossedWords = strikethroughs.length;

    return (document.querySelector(
      "#word-count-box"
    ).innerHTML = `${crossedWords} / 26 rows used`);
  };

  const printEssay = () => {
    const doc = new jsPDF();
    let essay = document.getElementById("essay");

    doc.text(essay.value, 10, 10);
    doc.save("Your Poem.pdf");
  };

  const printLists = () => {
    const doc = new jsPDF();

    doc.text("Word Into Idea - Your Words", 70, 20);
    doc.text(list[0], 30, 50);
    doc.text(list[1], 80, 50);
    doc.text(list[2], 130, 50);
    doc.text(list[3], 180, 50);

    doc.save("Your List.pdf");
  };

  const nextPage = () => {
    const LSsolo = localStorage.getItem("solo");
    let essay = document.getElementById("essay");
    localStorage.setItem("poem", essay.value);

    if (LSsolo) {
      setSoloLive(true);
    } else {
      setLiveRoom(true);
    }
  };

  if (liveRoom) {
    return <LiveRoom />;
  }

  if (soloLive) {
    return <LiveRoom />;
  }

  if (isLoading) {
    return <div className='App'>Loading...</div>;
  }
  return (
    <div>
      <div
        style={{
          backgroundColor: "#e0ffe3",
          position: "relative",
          textAlign: "center",
          margin: "auto",
          border: "2px solid grey",
          width: "95vw",
          marginBottom: "50px",
          padding: "5px",
          borderRadius: "5px",

          height: "fit-content",
          top: "10px",
        }}
        id='instruction-game'
      >
        Now for the creative part! Here are all your words, lined up in columns.
        Read each row of four words across. Do you see any striking connections
        and associations? Pick four or five rows that seem especially
        interesting to you.<br></br>
        Now write a poem using those words.<br></br>
        Pick another word from your lists to be the title. Then use the rest of
        the words to write your poem.<br></br>
        You can use as many other words as you like to make connections between
        the ones you chose.<br></br> You can change the forms of any of your
        words, make nouns plural, change the tense of the verbs.<br></br>The
        main thing is, don't worry about making sense: make poetry instead!
        <br></br>
      </div>

      <div id='MainDiv'>
        <table id='table2'>
          <thead id='thead-col'>
            <tr id='table-row-cols'>
              <th className='col-title'>
                1st
                <br /> Column
              </th>
              <th className='col-title'>
                2nd <br></br> Column{" "}
              </th>
              <th className='col-title'>
                3rd <br></br> Column{" "}
              </th>
              <th className='col-title'>
                4th<br></br> Column{" "}
              </th>
            </tr>
          </thead>
          <hr></hr>
          <br></br>
          <div id='word-count-box'>Rows Used:</div>
          <div id='table-container'>
            <tbody id='tbody1'></tbody>
          </div>
        </table>

        <div id='input_and_button_container'>
          <textarea placeholder='Start writing here...' id='essay' />

          <div id='buttons'>
            <Button
              class='word-table-btns'
              variant='outlined'
              onClick={printEssay}
            >
              Print Poem to PDF
            </Button>
            <Button
              class='word-table-btns'
              variant='outlined'
              onClick={printLists}
            >
              Print Lists to PDF
            </Button>
            <Button
              class='word-table-btns'
              variant='outlined'
              color='success'
              onClick={nextPage}
            >
              Finish (Continue)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wordtable;
