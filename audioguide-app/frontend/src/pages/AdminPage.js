import { useEffect, useState } from 'react';

function AdminPage() {
  const [museums, setMuseums] = useState([]);
  const [newMuseumName, setNewMuseumName] = useState('');
  const [newMuseumId, setNewMuseumId] = useState('');
  const [selectedMuseum, setSelectedMuseum] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [newArtwork, setNewArtwork] = useState({
    id: '',
    title: '',
    artist: '',
    description: '',
    audio_url: ''
  });

  useEffect(() => {
    fetchMuseums();
  }, []);

  const fetchMuseums = () => {
    fetch('http://192.168.178.61:5000/api/museums')
      .then(response => response.json())
      .then(data => setMuseums(data))
      .catch(error => console.error('Error fetching museums:', error));
  };

  const handleDeleteMuseum = (id) => {
    fetch(`http://192.168.178.61:5000/api/museums/${id}`, {
      method: 'DELETE'
    })
    .then(() => {
      setSelectedMuseum(null);
      fetchMuseums();
    })
    .catch(error => console.error('Error deleting museum:', error));
  };

  const handleAddMuseum = () => {
    const newMuseum = {
      id: newMuseumId,
      name: newMuseumName
    };
    fetch('http://192.168.178.61:5000/api/museums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMuseum)
    })
    .then(() => {
      setNewMuseumName('');
      setNewMuseumId('');
      fetchMuseums();
    })
    .catch(error => console.error('Error adding museum:', error));
  };

  const handleSelectMuseum = (museumId) => {
    setSelectedMuseum(museumId);
    fetch(`http://192.168.178.61:5000/api/museums/${museumId}/artworks`)
      .then(response => response.json())
      .then(data => setArtworks(data))
      .catch(error => console.error('Error fetching artworks:', error));
  };

  const handleAddArtwork = () => {
    fetch(`http://192.168.178.61:5000/api/museums/${selectedMuseum}/artworks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newArtwork)
    })
    .then(() => {
      setNewArtwork({ id: '', title: '', artist: '', description: '', audio_url: '' });
      handleSelectMuseum(selectedMuseum);
    })
    .catch(error => console.error('Error adding artwork:', error));
  };

  const handleDeleteArtwork = (artworkId) => {
    fetch(`http://192.168.178.61:5000/api/museums/${selectedMuseum}/artworks/${artworkId}`, {
      method: 'DELETE'
    })
    .then(() => handleSelectMuseum(selectedMuseum))
    .catch(error => console.error('Error deleting artwork:', error));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Console</h1>

      <h2>Add New Museum</h2>
      <input 
        type="text" 
        placeholder="Museum ID (e.g. louvre)" 
        value={newMuseumId}
        onChange={e => setNewMuseumId(e.target.value)}
        style={{ marginRight: '10px' }}
      />
      <input 
        type="text" 
        placeholder="Museum Name" 
        value={newMuseumName}
        onChange={e => setNewMuseumName(e.target.value)}
        style={{ marginRight: '10px' }}
      />
      <button onClick={handleAddMuseum}>Add Museum</button>

      <h2>Existing Museums</h2>
      <ul>
        {museums.map(museum => (
          <li key={museum.id} style={{ marginBottom: '10px' }}>
            {museum.name} ({museum.id})
            <button 
              onClick={() => handleDeleteMuseum(museum.id)} 
              style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
            >
              Delete
            </button>
            <button 
              onClick={() => handleSelectMuseum(museum.id)} 
              style={{ marginLeft: '10px', backgroundColor: 'blue', color: 'white' }}
            >
              Manage Artworks
            </button>
          </li>
        ))}
      </ul>

      {selectedMuseum && (
        <div style={{ marginTop: '30px' }}>
          <h2>Manage Artworks for: {selectedMuseum}</h2>

          <h3>Add New Artwork</h3>
          <input 
            type="text" 
            placeholder="Artwork ID" 
            value={newArtwork.id}
            onChange={e => setNewArtwork({ ...newArtwork, id: e.target.value })}
            style={{ marginRight: '10px' }}
          />
          <input 
            type="text" 
            placeholder="Title" 
            value={newArtwork.title}
            onChange={e => setNewArtwork({ ...newArtwork, title: e.target.value })}
            style={{ marginRight: '10px' }}
          />
          <input 
            type="text" 
            placeholder="Artist" 
            value={newArtwork.artist}
            onChange={e => setNewArtwork({ ...newArtwork, artist: e.target.value })}
            style={{ marginRight: '10px' }}
          />
          <input 
            type="text" 
            placeholder="Description" 
            value={newArtwork.description}
            onChange={e => setNewArtwork({ ...newArtwork, description: e.target.value })}
            style={{ marginRight: '10px' }}
          />
          <input 
            type="text" 
            placeholder="Audio URL" 
            value={newArtwork.audio_url}
            onChange={e => setNewArtwork({ ...newArtwork, audio_url: e.target.value })}
            style={{ marginRight: '10px' }}
          />
          <button onClick={handleAddArtwork}>Add Artwork</button>

          <h3>Existing Artworks</h3>
          <ul>
            {artworks.map(art => (
              <li key={art.id} style={{ marginBottom: '10px' }}>
                {art.title} by {art.artist}
                <button 
                  onClick={() => handleDeleteArtwork(art.id)} 
                  style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
