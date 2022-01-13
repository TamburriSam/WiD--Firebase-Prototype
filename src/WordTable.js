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

const Wordtable = () => {
  const db = firebase.firestore();

  const [nodes, setNodes] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [liveRoom, setLiveRoom] = useState(false);
  const [soloLive, setSoloLive] = useState(false);
  const [list, setList] = useState([]);

  let list1, list2, list3, list4;

  useEffect(() => {
    let LSPoem = localStorage.getItem("poem");

    if (LSPoem) {
      setLiveRoom(true);
    } else {
      getData();
    }
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

          /*  html += `<tr><td class="listItems"><input class="word-check" type="checkbox"><div class="dynamic-items">${item.join(
            " "
          )}</div></td></tr>`; */
        });

        const result2 = [];

        for (let i = 0; i < test.length; i += 4) {
          const chunk = test.slice(i, i + 4);
          result2.push(chunk);
        }

        console.log(result2);

        result2.map((item) => {
          html += `<tr><td class="listItems"><input class="word-check" type="checkbox"><div class="dynamic-items">${item.join(
            " "
          )}</div></td></tr>`;
        });

        firstCol.innerHTML = html;
        console.log(test);
        crossedOffWord();
      });
  };

  const crossedOffWord = () => {
    let counter = 0;
    let listItems = document.querySelectorAll(".listItems");

    let checkboxes = document.querySelectorAll(".word-check");

    checkboxes.forEach((item, index) => {
      item.addEventListener("change", () => {
        console.log(counter++);
        wordCounter();
        if (item.className == "word-check" && item.checked) {
          listItems[index].classList.remove("listItems");

          listItems[index].classList.add("crossed-word");
        } else {
          listItems[index].classList.remove("crossed-word");
          listItems[index].classList.add("listItems");
        }
      });
    });
  };

  const wordCounter = () => {
    let strikethroughs = document.querySelectorAll(".crossed-word");

    let crossedWords = strikethroughs.length;

    return (document.querySelector("#word-count-box").innerHTML = `${
      crossedWords + 1
    } /26 rows used`);
  };

  const printEssay = () => {
    const doc = new jsPDF();
    let essay = document.getElementById("essay");

    doc.text(essay.value, 10, 10);
    doc.save("a4.pdf");
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

    if (LSsolo) {
      setSoloLive(true);
    } else {
      let essay = document.getElementById("essay");

      localStorage.setItem("poem", essay.value);
      setLiveRoom(true);
    }
  };

  if (liveRoom) {
    return <LiveRoom />;
  }

  if (soloLive) {
    return <h1>Solo Works</h1>;
  }

  if (isLoading) {
    return <div className='App'>Loading...</div>;
  }
  return (
    <div id='MainDiv'>
      <table id='table2'>
        <thead>
          <tr id='table-row-cols'>
            <th className='col-title'>1st Column </th>
            <th className='col-title'>2nd Column </th>
            <th className='col-title'>3rd Column </th>
            <th className='col-title'>4th Column </th>
          </tr>
        </thead>

        <tbody id='tbody1'></tbody>
      </table>

      <div id='input_and_button_container'>
        <input id='essay' />

        <div id='buttons'>
          <button class='btn' onClick={printEssay}>
            Print Essay
          </button>
          <button class='btn' onClick={printLists}>
            Print Lists
          </button>
          <button class='btn' onClick={nextPage}>
            Next
          </button>
        </div>
      </div>
      <div id='word-count-box'>Count: </div>
    </div>
  );
};

export default Wordtable;
