import { useEffect, useState } from 'react';

function AdminPage() {
  const [museums, setMuseums] = useState([]);
  const [selectedMuseum, setSelectedMuseum] = useState(null);
  const [selectedMuseumName, setSelectedMuseumName] = useState('');
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [filterFields, setFilterFields] = useState({ title: '', artist: '', year: '', exhibition: '' });
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingArtworkId, setEditingArtworkId] = useState(null);
  const [editedArtwork, setEditedArtwork] = useState({});
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [newArtwork, setNewArtwork] = useState({ title: '', artist: '', year: '', exhibition: '', text: '', audiofile: '' });
  const [bulkArtworksText, setBulkArtworksText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchMuseums();
  }, []);

  useEffect(() => {
    handleSearchAndSort();
  }, [filterFields, artworks, sortField, sortDirection]);

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

  const handleSearchAndSort = () => {
    let tempArtworks = [...artworks];
    Object.keys(filterFields).forEach(key => {
      if (filterFields[key]) {
        tempArtworks = tempArtworks.filter(art => art[key]?.toString().toLowerCase().includes(filterFields[key].toLowerCase()));
      }
    });
    tempArtworks.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredArtworks(tempArtworks);
  };

  const handleDownload = () => {
    const date = new Date().toISOString().split('T')[0];
    const filename = `${date}_artworks_${selectedMuseumName.toLowerCase().replace(/\s+/g, '-')}.json`;
    const fileData = JSON.stringify(filteredArtworks, null, 2);
    const blob = new Blob([fileData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const bulkDelete = () => {
    selectedRows.forEach(id => {
      fetch(`http://192.168.178.61:5000/api/artworks/${id}`, { method: 'DELETE' })
        .then(() => handleSelectMuseum(selectedMuseum))
        .catch(error => console.error('Error deleting artwork:', error));
    });
    setSelectedRows([]);
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

  const handleAddArtwork = () => {
    fetch(`http://192.168.178.61:5000/api/museums/${selectedMuseum}/artworks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newArtwork)
    })
      .then(() => {
        setNewArtwork({ title: '', artist: '', year: '', exhibition: '', text: '', audiofile: '' });
        setSuccessMessage('Upload successful!');
        handleSelectMuseum(selectedMuseum);
        setTimeout(() => setSuccessMessage(''), 3000);
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
          setSuccessMessage('Bulk upload successful!');
          handleSelectMuseum(selectedMuseum);
          setTimeout(() => setSuccessMessage(''), 3000);
        })
        .catch(error => console.error('Error bulk uploading artworks:', error));
    } catch (err) {
      alert('Invalid JSON format. Please check your input.');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#003366', minHeight: '100vh', color: 'white' }}>
      <h1>Admin Console</h1>
      <h2>Museums</h2>
      <ul>
        {museums.map(museum => (
          <li key={museum.id}>
            {museum.name}
            <button onClick={() => handleSelectMuseum(museum.id)} style={{ marginLeft: '10px' }}>Manage Artworks</button>
          </li>
        ))}
      </ul>

      {selectedMuseum && (
        <div style={{ marginTop: '30px' }}>
          <h2>Manage Artworks for: {selectedMuseumName}</h2>

          {successMessage && <p style={{ color: 'lightgreen' }}>{successMessage}</p>}

          <div style={{ marginBottom: '20px' }}>
            <h3>Add Single Artwork</h3>
            <input type="text" placeholder="Title" value={newArtwork.title} onChange={e => setNewArtwork({ ...newArtwork, title: e.target.value })} />
            <input type="text" placeholder="Artist" value={newArtwork.artist} onChange={e => setNewArtwork({ ...newArtwork, artist: e.target.value })} />
            <input type="text" placeholder="Year" value={newArtwork.year} onChange={e => setNewArtwork({ ...newArtwork, year: e.target.value })} />
            <input type="text" placeholder="Exhibition" value={newArtwork.exhibition} onChange={e => setNewArtwork({ ...newArtwork, exhibition: e.target.value })} />
            <input type="text" placeholder="Text" value={newArtwork.text} onChange={e => setNewArtwork({ ...newArtwork, text: e.target.value })} />
            <input type="text" placeholder="Audiofile URL" value={newArtwork.audiofile} onChange={e => setNewArtwork({ ...newArtwork, audiofile: e.target.value })} />
            <button onClick={handleAddArtwork}>Add Artwork</button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3>Bulk Upload Artworks (Paste JSON)</h3>
            <textarea
              value={bulkArtworksText}
              onChange={e => setBulkArtworksText(e.target.value)}
              rows="10"
              cols="80"
              placeholder='Paste artworks JSON array here'
            />
            <br />
            <button onClick={handleBulkUpload} style={{ marginTop: '10px' }}>Bulk Upload Artworks</button>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <button onClick={handleDownload} style={{ marginRight: '10px' }}>Download JSON</button>
            {selectedRows.length > 0 && (
              <button onClick={bulkDelete} style={{ backgroundColor: 'red', color: 'white' }}>Delete</button>
            )}
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th></th>
                <th onClick={() => handleSort('id')}>ID</th>
                <th onClick={() => handleSort('title')}>Title</th>
                <th onClick={() => handleSort('artist')}>Artist</th>
                <th onClick={() => handleSort('year')}>Year</th>
                <th onClick={() => handleSort('exhibition')}>Exhibition</th>
                <th>Actions</th>
              </tr>
              <tr>
                <th></th>
                <th></th>
                <th><input value={filterFields.title} onChange={(e) => setFilterFields({ ...filterFields, title: e.target.value })} /></th>
                <th><input value={filterFields.artist} onChange={(e) => setFilterFields({ ...filterFields, artist: e.target.value })} /></th>
                <th><input value={filterFields.year} onChange={(e) => setFilterFields({ ...filterFields, year: e.target.value })} /></th>
                <th><input value={filterFields.exhibition} onChange={(e) => setFilterFields({ ...filterFields, exhibition: e.target.value })} /></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredArtworks.map(art => (
                <tr key={art.id}>
                  <td><input type="checkbox" checked={selectedRows.includes(art.id)} onChange={() => handleCheckboxChange(art.id)} /></td>
                  <td>{art.id}</td>
                  {editingArtworkId === art.id ? (
                    <>
                      <td><input value={editedArtwork.title} onChange={(e) => handleEditChange('title', e.target.value)} /></td>
                      <td><input value={editedArtwork.artist} onChange={(e) => handleEditChange('artist', e.target.value)} /></td>
                      <td><input value={editedArtwork.year} onChange={(e) => handleEditChange('year', e.target.value)} /></td>
                      <td><input value={editedArtwork.exhibition} onChange={(e) => handleEditChange('exhibition', e.target.value)} /></td>
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
                      <td>
                        {selectedRows.includes(art.id) && (
                          <button onClick={() => startEditing(art)}>Edit</button>
                        )}
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
