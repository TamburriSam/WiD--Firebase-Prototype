import React, { Component } from "react";
import video from "./logos/widVid.mp4";
import { useState } from "react";
import { Link } from "react-router-dom";

const Video = () => {
  const inner = {
    width: "50vw",
    height: "50vw",
    position: "relative",
  };

  const outer = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  const backBtn = {
    position: "absolute",
    left: "40px",
    top:"40px",
    width: "100px",
    fontSize: "16px",
    height: "40px",
    cursor: "pointer",
  };

  return (
    <div>
      <Link to='/'>
        <button style={backBtn}>Go Back</button>
      </Link>
      <div style={outer}>
        <div style={inner}>
          <video controls autostart autoPlay src={video} type='video/mp4' />
        </div>
      </div>
    </div>
  );
};

export default Video;
