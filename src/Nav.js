import mainLogo from "./logos/whiteLogoStandalone.png";
import secondaryLogo from "./logos/whiteTextLogoOnly.png";
import "./styles/Nav.css";

const Nav = () => {
  return (
    <div id='roomNav'>
      <div id='overlay'></div>
      <div id='main-logo-container'>
        <a href='rooms.html'>
          {<img id='mainLogo' src={mainLogo} alt='' />}
          <img id='secondaryLogo' src={secondaryLogo} alt='' />
        </a>
      </div>
    </div>
  );
};

export default Nav;
