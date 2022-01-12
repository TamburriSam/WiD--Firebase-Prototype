import firebase from "firebase/app";
import "firebase/firestore";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import React from "react";
import "./CSSRoomLI.css";
import Button from "@mui/material/Button";
function RoomLI({
  soloFunc,
  displayCreateBtns,
  createNewProfile,
  data,
  props,
  roomFullDisableBtn,
}) {
  const db = firebase.firestore();

  const [nodes, setNodes] = useState({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getData();

    return () => {
      setLoading(true);
      console.log("unmounting component");
    };
  }, []);

  const getData = () => {
    db.collection("rooms").onSnapshot((snapshot) => {
      /* roomFullDisableBtn(); */
      setNodes(snapshot.docs);
      setLoading(false);
    });
  };

  if (isLoading) {
    return <div className='App'>Loading...</div>;
  }

  return (
    <div id='liveRoom'>
      <h1>Active Rooms</h1>
      <Button variant='outlined' onClick={soloFunc}>
        Solo Mode
      </Button>
      <table id='table1'>
        <thead>
          <tr id='table-heading'>
            <th className='group-title'>Group Name</th>
            <th className='members-active'>Members Active</th>
          </tr>
        </thead>

        {nodes.map((node, index) => {
          return (
            <thead key={index.toString()}>
              <tr>
                <td className='group-name'>{node.data().name}</td>
                <td className='group-count'>
                  {node.data().active_count} / {node.data().total_count} Active
                </td>
                <td className='join-btn'>
                  <Button
                    variant='outlined'
                    size='small'
                    data-id='btn'
                    id={node.id}
                    onClick={(e) => createNewProfile(e)}
                    className='btn room-select'
                  >
                    Join
                  </Button>
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
