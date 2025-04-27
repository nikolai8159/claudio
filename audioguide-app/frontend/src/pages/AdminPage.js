import { useEffect, useState } from 'react';

function AdminPage() {
  const [museums, setMuseums] = useState([]);
  const [selectedMuseum, setSelectedMuseum] = useState(null);
  const [selectedMuseumName, setSelectedMuseumName] = useState('');
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingArtworkId, setEditingArtworkId] = useState(null);
  const [editedArtwork, setEditedArtwork] = useState({});

  useEffect(() => {
    fetchMuseums();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, artworks]);

  const fetchMuseums = () => {
    fetch('http://192.168.178.61:5000/api/museums')
      .then(response => response.json())
      .then(data => setMuseums(data))
      .catch(error => console.error('Error fetching museums:', error));
  };

  const handleSelectMuseum = (museumId) => {
    setSelectedMuseum(museumId);
    const museum = museums.find(m => m.id === museumId);
    setSelectedMuseumName(museum ? museum.name : '');
    fetch(`http://192.168.178.61:5000/api/museums/${museumId}/artworks`)
      .then(response => response.json())
      .then(data => setArtworks(data))
      .catch(error => console.error('Error fetching artworks:', error));
  };

  const handleSearch = () => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = artworks.filter(art =>
      art.title.toLowerCase().includes(lowerSearch) ||
      art.artist.toLowerCase().includes(lowerSearch)
    );
    setFilteredArtworks(filtered);
  };

  const handleDownload = () => {
    const date = new Date().toISOString().split('T')[0];
    const filename = `${date}_artworks_${selectedMuseumName.toLowerCase().replace(/\s+/g, '-')}.json`;
    const fileData = JSON.stringify(artworks, null, 2);
    const blob = new Blob([fileData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startEditing = (artwork) => {
    setEditingArtworkId(artwork.id);
    setEditedArtwork({ ...artwork });
  };

  const handleEditChange = (field, value) => {
    setEditedArtwork({ ...editedArtwork, [field]: value });
  };

  const saveEditedArtwork = () => {
    fetch(`http://192.168.178.61:5000/api/artworks/${editingArtworkId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedArtwork)
    })
      .then(() => {
        setEditingArtworkId(null);
        handleSelectMuseum(selectedMuseum);
      })
      .catch(error => console.error('Error saving artwork:', error));
  };

  const deleteArtwork = (id) => {
    fetch(`http://192.168.178.61:5000/api/artworks/${id}`, {
      method: 'DELETE'
    })
      .then(() => handleSelectMuseum(selectedMuseum))
      .catch(error => console.error('Error deleting artwork:', error));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Console</h1>

      <h2>Museums</h2>
      <ul>
        {museums.map(museum => (
          <li key={museum.id} style={{ marginBottom: '10px' }}>
            {museum.name}
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
          <h2>Manage Artworks for: {selectedMuseumName}</h2>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search by Title or Artist"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '5px', width: '300px', marginRight: '10px' }}
            />
            <button onClick={handleDownload} style={{ backgroundColor: 'green', color: 'white' }}>Download Artworks JSON</button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
              <tr>
                <th>Title</th>
                <th>Artist</th>
                <th>Year</th>
                <th>Exhibition</th>
                <th>Text</th>
                <th>Audiofile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArtworks.map((art) => (
                <tr key={art.id}>
                  {editingArtworkId === art.id ? (
                    <>
                      <td><input value={editedArtwork.title} onChange={(e) => handleEditChange('title', e.target.value)} /></td>
                      <td><input value={editedArtwork.artist} onChange={(e) => handleEditChange('artist', e.target.value)} /></td>
                      <td><input value={editedArtwork.year} onChange={(e) => handleEditChange('year', e.target.value)} /></td>
                      <td><input value={editedArtwork.exhibition} onChange={(e) => handleEditChange('exhibition', e.target.value)} /></td>
                      <td><input value={editedArtwork.text} onChange={(e) => handleEditChange('text', e.target.value)} /></td>
                      <td><input value={editedArtwork.audiofile} onChange={(e) => handleEditChange('audiofile', e.target.value)} /></td>
                      <td>
                        <button onClick={saveEditedArtwork}>Save</button>
                        <button onClick={() => setEditingArtworkId(null)}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{art.title}</td>
                      <td>{art.artist}</td>
                      <td>{art.year}</td>
                      <td>{art.exhibition}</td>
                      <td>{art.text}</td>
                      <td>{art.audiofile}</td>
                      <td>
                        <button onClick={() => startEditing(art)}>Edit</button>
                        <button onClick={() => deleteArtwork(art.id)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
