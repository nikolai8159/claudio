import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>Museum Audioguide</h1>
      <p>Choose your museum here:</p>
      <Link to="/museum/louvre">Louvre</Link><br />
      <Link to="/museum/moma">MoMA</Link><br />
      <Link to="/museum/uffizi">Uffizi Gallery</Link>
    </div>
  );
}

export default HomePage;
