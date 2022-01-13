import mainLogo from "./logos/whiteLogoStandalone.png";
import secondaryLogo from "./logos/whiteTextLogoOnly.png";
import "./Nav.css";
import background from "./logos/green3.jpg";

const Nav = () => {
  return (
    <div style={{ backgroundImage: `url(${background})` }} id='roomNav'>
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
