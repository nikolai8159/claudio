import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [museums, setMuseums] = useState([]);

  useEffect(() => {
    fetch('http://192.168.178.61:5000/api/museums')
      .then(response => response.json())
      .then(data => setMuseums(data))
      .catch(error => console.error('Error fetching museums:', error));
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(to right, #ffecd2, #fcb69f)',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '2.5rem' }}>Museum Audioguide</h1>
      <p style={{ fontSize: '1.5rem' }}>Choose your museum!</p>
      <ul style={{ fontSize: '1.5rem', marginTop: '20px', listStyleType: 'none', padding: 0 }}>
        {museums.map(museum => (
          <li key={museum.id} style={{ marginBottom: '15px' }}>
            <Link to={`/museum/${museum.id}`} style={{
              color: '#003366',
              textDecoration: 'none',
              background: '#ffffff',
              padding: '10px 20px',
              borderRadius: '8px',
              display: 'inline-block',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              {museum.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
