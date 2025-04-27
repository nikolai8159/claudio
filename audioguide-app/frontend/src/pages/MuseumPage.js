import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function MuseumPage() {
  const { museumId } = useParams();
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    fetch(`http://192.168.178.61:5000/api/museums/${museumId}/artworks`)
      .then(response => response.json())
      .then(data => setArtworks(data))
      .catch(error => console.error('Error fetching artworks:', error));
  }, [museumId]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>{museumId.toUpperCase()} Gallery</h1>

      {artworks.length === 0 ? (
        <p>No artworks available yet.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {artworks.map((art) => (
            <li key={art.id} style={{
              background: '#f5f5f5',
              padding: '20px',
              marginBottom: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h2>{art.title}</h2>
              <h4>By {art.artist}</h4>
              <p>{art.description}</p>
              {art.audio_url && (
                <audio controls style={{ marginTop: '10px' }}>
                  <source src={art.audio_url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MuseumPage;
