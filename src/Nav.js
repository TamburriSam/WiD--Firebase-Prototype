import mainLogo from "./logos/whiteLogoStandalone.png";
import secondaryLogo from "./logos/whiteTextLogoOnly.png";
import "./Nav.css";

const Nav = () => {
  return (
    <div id='roomNav'>
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
