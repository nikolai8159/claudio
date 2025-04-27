import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>Museum Audioguide</h1>
      <p>Choose your museum!</p>
      <ul style={{ fontSize: '24px', marginTop: '20px' }}>
        <li><Link to="/museum/louvre" style={{ color: 'blue' }}>Louvre</Link></li>
        <li><Link to="/museum/moma" style={{ color: 'blue' }}>MoMA</Link></li>
        <li><Link to="/museum/uffizi" style={{ color: 'blue' }}>Uffizi Gallery</Link></li>
      </ul>
    </div>
  );
}

export default HomePage;
