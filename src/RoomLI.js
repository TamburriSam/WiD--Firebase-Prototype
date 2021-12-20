import firebase from "firebase/app";
import "./Nav.css";
import "firebase/firestore";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import React from "react";

function RoomLI({ createNewProfile, data, props }) {
  const db = firebase.firestore();

  const [nodes, setNodes] = useState({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    db.collection("rooms").onSnapshot((snapshot) => {
      setNodes(snapshot.docs);
      setLoading(false);
    });
  };

  if (isLoading) {
    return <div className='App'>Loading...</div>;
  }

  return (
    <div>
      <table>
        {nodes.map((node, index) => {
          return (
            <thead key={index.toString()}>
              <tr>
                <td>{node.data().name}</td>
                <td>
                  {node.data().active_count} / {node.data().total_count} Active
                </td>
                <td>
                  <button
                    data-id='btn'
                    id={node.id}
                    onClick={(e) => createNewProfile(e)}
                    className='btn room-select'
                  >
                    Join
                  </button>
                </td>
              </tr>
            </thead>
          );
        })}
      </table>
    </div>
  );
}

export default RoomLI;
