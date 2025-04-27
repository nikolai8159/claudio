import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>Museum Audioguide</h1>
      <p>Choose your museum!</p>
      <ul>
        <li><Link to="/museum/louvre">Louvre</Link></li>
        <li><Link to="/museum/moma">MoMA</Link></li>
        <li><Link to="/museum/uffizi">Uffizi Gallery</Link></li>
      </ul>
    </div>
  );
}

export default HomePage;
