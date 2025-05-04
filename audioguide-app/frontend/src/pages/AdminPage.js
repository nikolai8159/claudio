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
  const [darkMode, setDarkMode] = useState(true);

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
    let temp = [...artworks];
    Object.keys(filterFields).forEach(key => {
      if (filterFields[key]) {
        temp = temp.filter(art => art[key]?.toString().toLowerCase().includes(filterFields[key].toLowerCase()));
      }
    });
    temp.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredArtworks(temp);
  };

  const handleDownload = () => {
    const date = new Date().toISOString().split('T')[0];
    const filename = `${date}_artworks_${selectedMuseumName.toLowerCase().replace(/\s+/g, '-')}.json`;
    const blob = new Blob([JSON.stringify(filteredArtworks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const handleCheckboxChange = (id) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  const bulkDelete = () => {
    selectedRows.forEach(id => {
      fetch(`http://192.168.178.61:5000/api/artworks/${id}`, { method: 'DELETE' })
        .then(() => handleSelectMuseum(selectedMuseum))
        .catch(err => console.error('Delete error', err));
    });
    setSelectedRows([]);
  };

  const startEditing = (art) => {
    setEditingArtworkId(art.id);
    setEditedArtwork({ ...art });
  };

  const handleEditChange = (field, value) => {
    setEditedArtwork({ ...editedArtwork, [field]: value });
  };

  const saveEditedArtwork = () => {
    fetch(`http://192.168.178.61:5000/api/artworks/${editingArtworkId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedArtwork)
    }).then(() => {
      setEditingArtworkId(null);
      handleSelectMuseum(selectedMuseum);
    }).catch(err => console.error('Save error', err));
  };

  const handleAddArtwork = () => {
    fetch(`http://192.168.178.61:5000/api/museums/${selectedMuseum}/artworks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newArtwork)
    }).then(() => {
      setNewArtwork({ title: '', artist: '', year: '', exhibition: '', text: '', audiofile: '' });
      setSuccessMessage('Upload successful!');
      handleSelectMuseum(selectedMuseum);
      setTimeout(() => setSuccessMessage(''), 3000);
    }).catch(err => console.error('Add error', err));
  };

  const handleBulkUpload = () => {
    try {
      const artworksList = JSON.parse(bulkArtworksText);
      fetch(`http://192.168.178.61:5000/api/museums/${selectedMuseum}/artworks/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(artworksList)
      }).then(() => {
        setBulkArtworksText('');
        setSuccessMessage('Bulk upload successful!');
        handleSelectMuseum(selectedMuseum);
        setTimeout(() => setSuccessMessage(''), 3000);
      }).catch(err => console.error('Bulk upload error', err));
    } catch {
      alert('Invalid JSON.');
    }
  };

  useEffect(() => {
    fetchMuseums();
  }, []);

  useEffect(() => {
    handleSearchAndSort();
  }, [artworks, filterFields, sortField, sortDirection]);

  const theme = {
    background: darkMode ? '#001f3f' : '#f5f5f5',
    text: darkMode ? '#ffffff' : '#000000',
    inputBg: darkMode ? '#1c2c3c' : '#ffffff',
    inputText: darkMode ? '#ffffff' : '#000000',
    buttonBg: darkMode ? '#007acc' : '#004080',
    tableBg: darkMode ? '#1e3a5f' : '#e6f0ff',
    border: darkMode ? '#444' : '#ccc'
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    backgroundColor: theme.background,
    color: theme.text
  };

  const sidebarStyle = {
    minWidth: '200px',
    backgroundColor: theme.tableBg,
    padding: '20px',
    overflowY: 'auto'
  };

  const mainStyle = {
    flexGrow: 1,
    padding: '20px',
    overflowX: 'auto'
  };

  const inputStyle = {
    backgroundColor: theme.inputBg,
    color: theme.inputText,
    border: `1px solid ${theme.border}`,
    padding: '6px',
    margin: '4px',
    borderRadius: '4px',
    minWidth: '100px'
  };

  const buttonStyle = {
    backgroundColor: theme.buttonBg,
    color: '#fff',
    padding: '6px 12px',
    margin: '4px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  const tableStyle = {
    width: '100%',
    backgroundColor: theme.tableBg,
    borderCollapse: 'collapse'
  };

  const thStyle = {
    borderBottom: `1px solid ${theme.border}`,
    padding: '8px',
    textAlign: 'left'
  };

  const tdStyle = {
    padding: '8px',
    borderBottom: `1px solid ${theme.border}`
  };

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <h3>Museums</h3>
        <button onClick={() => setDarkMode(!darkMode)} style={buttonStyle}>
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </button>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {museums.map(m => (
            <li key={m.id}>
              <button onClick={() => handleSelectMuseum(m.id)} style={{ ...buttonStyle, width: '100%' }}>
                {m.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={mainStyle}>
        <h2>Admin Console</h2>
        {selectedMuseum && (
          <>
            <h3>{selectedMuseumName}</h3>
            {successMessage && <p style={{ color: 'lightgreen' }}>{successMessage}</p>}

            <div>
              <h4>Add Artwork</h4>
              {Object.keys(newArtwork).map(key => (
                <input
                  key={key}
                  placeholder={key}
                  value={newArtwork[key]}
                  onChange={e => setNewArtwork({ ...newArtwork, [key]: e.target.value })}
                  style={inputStyle}
                />
              ))}
              <button onClick={handleAddArtwork} style={buttonStyle}>Add</button>
            </div>

            <div>
              <h4>Bulk Upload</h4>
              <textarea
                rows="8"
                value={bulkArtworksText}
                onChange={e => setBulkArtworksText(e.target.value)}
                style={{ ...inputStyle, width: '100%' }}
              />
              <button onClick={handleBulkUpload} style={buttonStyle}>Upload JSON</button>
            </div>

            <div>
              <button onClick={handleDownload} style={buttonStyle}>Download JSON</button>
              {selectedRows.length > 0 && (
                <button onClick={bulkDelete} style={{ ...buttonStyle, backgroundColor: 'red' }}>
                  Delete Selected
                </button>
              )}
            </div>

            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}></th>
                  <th style={thStyle} onClick={() => setSortField('id')}>ID</th>
                  {['title', 'artist', 'year', 'exhibition'].map(key => (
                    <th key={key} style={thStyle} onClick={() => setSortField(key)}>{key}</th>
                  ))}
                  <th style={thStyle}>Actions</th>
                </tr>
                <tr>
                  <th></th>
                  <th></th>
                  {['title', 'artist', 'year', 'exhibition'].map(key => (
                    <th key={key}><input value={filterFields[key]} onChange={e => setFilterFields({ ...filterFields, [key]: e.target.value })} style={inputStyle} /></th>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredArtworks.map(art => (
                  <tr key={art.id}>
                    <td style={tdStyle}><input type="checkbox" checked={selectedRows.includes(art.id)} onChange={() => handleCheckboxChange(art.id)} /></td>
                    <td style={tdStyle}>{art.id}</td>
                    {editingArtworkId === art.id ? (
                      <>
                        {['title', 'artist', 'year', 'exhibition'].map(field => (
                          <td key={field} style={tdStyle}>
                            <input value={editedArtwork[field]} onChange={(e) => handleEditChange(field, e.target.value)} style={inputStyle} />
                          </td>
                        ))}
                        <td style={tdStyle}>
                          <button onClick={saveEditedArtwork} style={buttonStyle}>Save</button>
                          <button onClick={() => setEditingArtworkId(null)} style={buttonStyle}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={tdStyle}>{art.title}</td>
                        <td style={tdStyle}>{art.artist}</td>
                        <td style={tdStyle}>{art.year}</td>
                        <td style={tdStyle}>{art.exhibition}</td>
                        <td style={tdStyle}>
                          {selectedRows.includes(art.id) && (
                            <button onClick={() => startEditing(art)} style={buttonStyle}>Edit</button>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
