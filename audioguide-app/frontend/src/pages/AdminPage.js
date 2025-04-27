import { useEffect, useState } from 'react';

function AdminPage() {
  const [museums, setMuseums] = useState([]);
  const [newMuseumName, setNewMuseumName] = useState('');
  const [newMuseumLocation, setNewMuseumLocation] = useState('');
  const [newMuseumDescription, setNewMuseumDescription] = useState('');
  const [selectedMuseum, setSelectedMuseum] = useState(null);
  const [selectedMuseumName, setSelectedMuseumName] = useState('');
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newArtwork, setNewArtwork] = useState({
    title: '',
    artist: '',
    year: '',
    exhibition: '',
    text: '',
    audiofile: ''
  });
  const [bulkArtworksText, setBulkArtworksText] = useState('');

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

  const handleAddArtwork = () => {
    fetch(`http://192.168.178.61:5000/api/museums/${selectedMuseum}/artworks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newArtwork)
    })
      .then(() => {
        setNewArtwork({ title: '', artist: '', year: '', exhibition: '', text: '', audiofile: '' });
        handleSelectMuseum(selectedMuseum);
      })
      .catch(error => console.error('Error adding artwork:', error));
  };

  const handleBulkUpload = () => {
    try {
      const artworksList = JSON.parse(bulkArtworksText);
      fetch(`http://192.168.178.61:5000/api/museums/${selectedMuseum}/artworks/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(artworksList)
      })
        .then(() => {
          setBulkArtworksText('');
          handleSelectMuseum(selectedMuseum);
        })
        .catch(error => console.error('Error bulk uploading artworks:', error));
    } catch (err) {
      alert('Invalid JSON format. Please check your input.');
    }
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

          <h3>Add New Single Artwork</h3>
          <input type="text" placeholder="Title" value={newArtwork.title} onChange={e => setNewArtwork({ ...newArtwork, title: e.target.value })} style={{ marginRight: '10px' }} />
          <input type="text" placeholder="Artist" value={newArtwork.artist} onChange={e => setNewArtwork({ ...newArtwork, artist: e.target.value })} style={{ marginRight: '10px' }} />
          <input type="text" placeholder="Year" value={newArtwork.year} onChange={e => setNewArtwork({ ...newArtwork, year: e.target.value })} style={{ marginRight: '10px' }} />
          <input type="text" placeholder="Exhibition" value={newArtwork.exhibition} onChange={e => setNewArtwork({ ...newArtwork, exhibition: e.target.value })} style={{ marginRight: '10px' }} />
          <input type="text" placeholder="Text" value={newArtwork.text} onChange={e => setNewArtwork({ ...newArtwork, text: e.target.value })} style={{ marginRight: '10px' }} />
          <input type="text" placeholder="Audiofile URL" value={newArtwork.audiofile} onChange={e => setNewArtwork({ ...newArtwork, audiofile: e.target.value })} style={{ marginRight: '10px' }} />
          <button onClick={handleAddArtwork}>Add Artwork</button>

          <h3 style={{ marginTop: '30px' }}>Bulk Upload Artworks (Paste JSON)</h3>
          <textarea
            value={bulkArtworksText}
            onChange={e => setBulkArtworksText(e.target.value)}
            rows="10"
            cols="80"
            placeholder='Paste artworks JSON array here'
            style={{ marginTop: '10px' }}
          />
          <br />
          <button onClick={handleBulkUpload} style={{ marginTop: '10px', backgroundColor: 'green', color: 'white' }}>
            Bulk Upload Artworks
          </button>

          <h3 style={{ marginTop: '30px' }}>Existing Artworks</h3>
          <ul>
            {filteredArtworks.map((art) => (
              <li key={art.id} style={{ marginBottom: '10px' }}>
                {art.title} by {art.artist} ({art.year})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
