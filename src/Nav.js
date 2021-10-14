import "./Nav.css";

function Nav(props) {
  return (
    <nav id='roomNav'>
      <img id='mainLogo' src='logos/logo_transparent_background.png' alt='' />

      <ul id='nav-links'>
        <li className='nav-link about-link'>About</li>
        <li>| &nbsp;</li>
        <li className='nav-link rooms-link'>Rooms</li>
        <li>| &nbsp;</li>

        <li>
          <div className='switch'>
            <label>
              <span className='solo'>Solo Mode</span>
              <input id='check' type='checkbox' />
              <span className='lever'></span>
              <span className='collaborative'>Collaborative Mode</span>
            </label>
          </div>
        </li>
      </ul>

      <div id='user-info'>
        <div id='user'>{props.name}</div>
      </div>
    </nav>
  );
}

export default Nav;
