import firebase from "firebase/app";
import "firebase/firestore";
import Main from "./Main";
import { useEffect, useState } from "react";
import React from "react";
import "./styles/index.css";
import { jsPDF } from "jspdf";
import LiveRoom from "./LiveRoom";
import "./styles/Final.css";
import Button from "@mui/material/Button";

const Wordtable = ({ Wordtable_to_LiveRoom }) => {
  const db = firebase.firestore();

  const [nodes, setNodes] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [soloLive, setSoloLive] = useState(false);
  const [list, setList] = useState([]);

  let list1, list2, list3, list4;

  useEffect(() => {
    window.scrollTo(0, 0);

    /*  document.getElementById("active-container").style.height = "100vh"; */
    let LSPoem = localStorage.getItem("poem");

    if (LSPoem) {
      Wordtable_to_LiveRoom();
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
        if (item.className === "word-check" && item.checked) {
          listItems[index].classList.remove("listItems");

          listItems[index].classList.add("crossed-word");

          wordCounter();
        } else {
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

    if (essay.value.length < 10) {
      alert(`Please complete the exercise before continuing.`);
    } else {
      if (LSsolo) {
        Wordtable_to_LiveRoom();
      } else {
        Wordtable_to_LiveRoom();
      }
    }
  };

  if (isLoading) {
    return <div className='App'>Loading...</div>;
  }
  return (
    <div>
      <div className='word-table-container'>
        <div className='instructionAndEssayContainer'>
          <div className='instructionsTable'>
            <h2>Now for the creative part!</h2>
            <br></br>
            <p>
              Read each row of four words for any interesting<br></br>
              connections and associations. Pick four or five rows<br></br>
              that interest you and use those words to write a poem <br></br>
              in the blank window. Use as many other words as you <br></br>need
              to make connections between your words and <br></br>change their
              forms however you like; make nouns<br></br>plural, change tenses
              of verbs, etc.<br></br>Don't worry about making sense: make
              poetry!<br></br>
              When you're done, pick a word from your lists to be your title.
            </p>
          </div>
          <div className='essayTable'>
            <textarea placeholder='Start writing here...' id='essay' />
            <p style={{ color: "#e5e5e5", textAlign: "center" }}>
              Save your poem and lists to your device for a later exercise. Then
              click "Continue."
            </p>
            <div>
              <button onClick={printLists}>Print Lists to PDF</button>
              <button onClick={printEssay}>Print Poem to PDF</button>
            </div>
          </div>
        </div>
        <div className='word-table-game'>
          <table id='table2'>
            <thead id='thead-col'>
              <tr id='table-row-cols'>
                <th className='col-title'>
                  1st
                  <br />
                  List
                </th>
                <th className='col-title'>
                  2nd <br></br>List
                </th>
                <th className='col-title'>
                  3rd <br></br>List
                </th>
                <th className='col-title'>
                  4th<br></br>List
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
        </div>
        <button onClick={nextPage} className='word-table-continue'>
          <p>continue</p>
        </button>
      </div>
    </div>
  );
};

export default Wordtable;
