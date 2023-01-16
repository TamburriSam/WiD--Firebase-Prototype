import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import firebase from "firebase/app";
import "firebase/firestore";
import uniqid from "uniqid";
import { send } from "emailjs-com";

//////////// <STYLE />///////////////////////////////////

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const textStyle = {
  textAlign: "center",
  marginBottom: "20px",
  marginTop: "20px",
};

const textBoxStyle = {
  width: "100%",
};

const buttonStyle = {
  textAlign: "center",
  marginTop: "20px",
};

///////////////////////// </STYLE>////////////////////////////

export default function BasicModal() {
  const db = firebase.firestore();

  //Modal Content handling

  const [mainText, setMainText] = React.useState(
    "Your feedback is important to us!"
  );

  const [secondaryText, setSecondaryText] =
    React.useState(`This application is still in beta. Please share any tips below on
  how to improve this experience!`);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let feedback_id = uniqid();

    db.collection("feedback")
      .doc(feedback_id)
      .set({
        message: value,
      })
      .then(() => {
        sendMessage();
      })
      .then(() => {
        setMainText("Message Sent!");
        setSecondaryText("Thank You!");
        setSubmit("Sent!");
      })
      .then(() => {
        setTimeout(() => {
          setOpen(false);
        }, 4000);
      });
  };

  const sendMessage = () => {
    send(
      "service_nyq7etw",
      "template_fsprwkd",
      { message: value },
      "IcSOjPRZWiaI_bu9t"
    )
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
      })
      .catch((err) => {
        console.log("FAILED...", err);
      });
  };
  //service_nyq7etw
  //Modal Open
  const [value, setValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [submit, setSubmit] = React.useState("Submit");
  const handleOpen = () => {
    setSubmit("Submit")
    setMainText("Your feedback is important to us!");
    setSecondaryText(`Please share any tips below on
    how to improve this experience!`);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  ////////send message
  const [toSend, setToSend] = React.useState({
    message: "",
  });

  return (
    <div>
      <button id='feedback-button' onClick={handleOpen}>
        <p id='feedback-text'>Feedback?</p>
      </button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            {mainText}
          </Typography>
          <Typography sx={textStyle} id='modal-modal-description'>
            {secondaryText}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              sx={textBoxStyle}
              id='outlined-multiline-static'
              label='Enter Feedback'
              multiline
              rows={4}
              defaultValue=''
              onChange={handleChange}
            />
            <div style={buttonStyle}>
              <Button variant='outlined' type='submit'>
                {submit}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
