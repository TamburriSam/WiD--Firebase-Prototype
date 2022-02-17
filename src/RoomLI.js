import firebase from "firebase/app";
import "firebase/firestore";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import React from "react";
import "./styles/CSSRoomLI.css";

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
    let game_start_token = localStorage.getItem("waiting");

    if (!game_start_token) {
      getData();
    }

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
      <button id='solobtn' onClick={soloFunc}>
        Solo Mode
      </button>
      <br></br>
      <button className='btn' id='createNewRoom' onClick={displayCreateBtns}>
        Create New Room
      </button>
      <h1 id='active-heading'>Active Rooms</h1>
      <br></br>

      <table id='table1'>
        <thead>
          <tr id='table-heading'>
            <th className='group-heading'>Group Name</th>
            <th className='members-heading'>Members Active</th>
          </tr>
        </thead>

        {nodes.map((node, index) => {
          return (
            <thead key={index.toString()}>
              <tr id='table-row'>
                <td className='group-name'>
                  {node.data().name ? node.data().name : "Solo Room"}
                </td>

                <td className='group-count'>
                  {node.data().active_count} Active
                </td>

                <td className='join-btn'>
                  <Button
                    variant='outlined'
                    size='small'
                    color='success'
                    data-id='btn'
                    id={node.id}
                    onClick={(e) => createNewProfile(e)}
                    className=' room-select'
                    disabled={node.data().is_solo ? true : false}
                  >
                    {"Join"}
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
