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
    <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ffa726', minHeight: '100vh' }}>
      <h1>Museum Audioguide</h1>
      <p>Choose your museum!</p>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px', 
        marginTop: '40px', 
        alignItems: 'center' 
      }}>
        {museums.map((museum) => (
          <Link 
            key={museum.id} 
            to={`/museum/${museum.id}`} 
            style={{ 
              backgroundColor: '#fb8c00', 
              color: 'white', 
              padding: '15px 30px', 
              borderRadius: '10px', 
              textDecoration: 'none', 
              fontSize: '20px',
              width: '250px',
              textAlign: 'center'
            }}
          >
            {museum.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
