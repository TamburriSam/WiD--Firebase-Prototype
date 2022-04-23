import firebase from "firebase/app";
import "firebase/firestore";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import React from "react";
import "./styles/CSSRoomLI.css";
import { Divider } from "@mui/material";

const WordsToUse = (wordsForComposition) => {
  const [nodes, setNodes] = useState({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    console.log("mounted");
  }, []);

  useEffect(() => {
    if (wordsForComposition.length !== 10) {
      getData();
    }
  }, [wordsForComposition]);

  const getData = () => {
    setNodes(wordsForComposition);
    setLoading(false);
  };

  if (isLoading) {
    return <div className='App'>Loading...</div>;
  }

  return (
    <div>
      {nodes.wordsForComposition.map((node, index) => {
        return <div key={index.toString()}>{node}</div>;
      })}
    </div>
  );
};

export default WordsToUse;
