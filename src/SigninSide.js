import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IndexPage from "./IndexPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import white_logo_dark_bg from "./logos/white_logo_transparent_background.png";
import papers from "./logos/image.jpg";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "./styles/index.css";

function Copyright(props) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      align='center'
      {...props}
    >
      <p class='license'>
        {"Copyright © "}
        <Link color='inherit'>Word Into Idea</Link> {new Date().getFullYear()}
        {<br></br>}
        {<br></br>}
        <a
          rel='license'
          href='http://creativecommons.org/licenses/by-nc-nd/4.0/'
        >
          <img
            alt='Creative Commons License'
            style={{ borderWidth: "0" }}
            src='https://i.creativecommons.org/l/by-nc-nd/4.0/80x15.png'
          />
        </a>
        <br />
        <span>This work is licensed under a </span> <br></br>{" "}
        <a
          style={{ fontSize: "12px" }}
          rel='license'
          href='http://creativecommons.org/licenses/by-nc-nd/4.0/'
        >
          Creative Commons Attribution-NonCommercial-NoDerivatives 4.0
          International License
        </a>
      </p>
    </Typography>
  );
}

const theme = createTheme();

export default function SignInSide({ submitForm, handleChange }) {
  return (
    <ThemeProvider theme={theme}>
      <Grid container component='main' sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          itemFS
          xs={false}
          sm={8}
          md={7}
          sx={{
            backgroundImage: `url(${papers})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div id='main1'>
            <img src={white_logo_dark_bg}></img>

            <div id='title-ul'>
              <h1>What is this?</h1>
              <ul>
                <li>
                  <span style={{ marginRight: "10px" }}>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </span>
                  Word into Idea is a creative writing exercise.
                </li>
                <br></br>
                <li>
                  <span style={{ marginRight: "10px" }}>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </span>
                  Usually writing assignments ask you to put your ideas into
                  words.
                </li>
                <br></br>
                <li>
                  <span style={{ marginRight: "10px" }}>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </span>
                  Today, we're going to reverse that and see how words can lead
                  to ideas.
                </li>
              </ul>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={4} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
            <Typography component='h1' variant='h5'>
              <span id='enter_screen_name'>
                Enter a screen name of your choice to start!
              </span>
            </Typography>
            <Box
              component='form'
              noValidate
              autoComplete='off'
              onSubmit={submitForm}
              sx={{ mt: 1 }}
            >
              <TextField
                margin='normal'
                required
                fullWidth
                id='username'
                label='Username'
                name='username'
                autoComplete='off'
                onChange={handleChange}
                autoFocus
              />

              <span className='greyed_out'>
                <br />
                There's no need to use any existing logins.
                <br />
                This site does not collect, save or share data.
              </span>

              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>

              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
