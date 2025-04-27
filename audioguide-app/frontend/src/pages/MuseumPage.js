import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function MuseumPage() {
  const { museumId } = useParams();
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    fetch(`http://192.168.178.61:5000/api/museum/${museumId}`)
      .then(response => response.json())
      .then(data => setArtworks(data))
      .catch(error => console.error('Error fetching artworks:', error));
  }, [museumId]);

  return (
    <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#fff3e0', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '20px' }}>{museumId.charAt(0).toUpperCase() + museumId.slice(1)}</h1>

      <Link to="/" style={{ 
          display: 'inline-block', 
          marginBottom: '30px', 
          textDecoration: 'none', 
          backgroundColor: '#fb8c00', 
          color: 'white', 
          padding: '10px 20px', 
          borderRadius: '8px' 
        }}>
        ← Back to Museums
      </Link>

      <div style={{ marginTop: '20px' }}>
        {artworks.length === 0 ? (
          <p>No artworks available.</p>
        ) : (
          artworks.map((artwork, index) => (
            <div key={index} style={{ 
                backgroundColor: '#ffffff', 
                margin: '10px auto', 
                padding: '20px', 
                borderRadius: '12px', 
                width: '90%', 
                maxWidth: '600px', 
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
              }}>
              <h2>{artwork.title}</h2>
              <p><strong>Artist:</strong> {artwork.artist}</p>
              <p><strong>Year:</strong> {artwork.year}</p>
              <p><strong>Description:</strong> {artwork.description}</p>
              {artwork.audio_url && artwork.audio_url !== 'none' && (
                <p>
                  <a href={artwork.audio_url} target="_blank" rel="noopener noreferrer" style={{ color: '#fb8c00' }}>
                    ▶️ Listen Audio
                  </a>
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MuseumPage;
