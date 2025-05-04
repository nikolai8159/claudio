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
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const theme = {
    background: darkMode ? '#001f3f' : '#f0f0f0',
    text: darkMode ? '#ffffff' : '#000000',
    inputBg: darkMode ? '#1c2c3c' : '#ffffff',
    inputText: darkMode ? '#ffffff' : '#000000',
    border: darkMode ? '#444' : '#ccc',
    buttonBg: darkMode ? '#007acc' : '#004080',
    tableBg: darkMode ? '#1e3a5f' : '#e6f0ff'
  };

  const containerStyle = {
    display: 'flex',
    height: '100vh',
    backgroundColor: theme.background,
    color: theme.text,
    fontFamily: 'sans-serif'
  };

  const sidebarStyle = {
    width: sidebarVisible ? '220px' : '0px',
    overflowX: 'hidden',
    backgroundColor: theme.tableBg,
    padding: sidebarVisible ? '20px' : '0px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'width 0.3s'
  };

  const toggleButtonStyle = {
    position: 'absolute',
    left: sidebarVisible ? '220px' : '10px',
    top: '10px',
    zIndex: 2,
    backgroundColor: theme.buttonBg,
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    cursor: 'pointer',
    borderRadius: '4px'
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


  useEffect(() => {
    fetchMuseums();
  }, []);

  useEffect(() => {
    if (selectedMuseum) {
      fetch(`http://192.168.178.61:5000/api/museums/${selectedMuseum}/artworks`)
        .then(res => res.json())
        .then(data => setArtworks(data));
    }
  }, [selectedMuseum]);

  useEffect(() => {
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
  }, [artworks, filterFields, sortField, sortDirection]);

  const fetchMuseums = () => {
    fetch('http://192.168.178.61:5000/api/museums')
      .then(response => response.json())
      .then(data => setMuseums(data));
  };

  const handleAddArtwork = () => {
    fetch(`http://192.168.178.61:5000/api/museums/${selectedMuseum}/artworks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newArtwork)
    }).then(() => {
      setNewArtwork({ title: '', artist: '', year: '', exhibition: '', text: '', audiofile: '' });
      setSuccessMessage('Artwork added!');
      fetchArtworks(selectedMuseum);
      setTimeout(() => setSuccessMessage(''), 3000);
    });
  };

  const fetchArtworks = (museumId) => {
    fetch(`http://192.168.178.61:5000/api/museums/${museumId}/artworks`)
      .then(res => res.json())
      .then(data => setArtworks(data));
  };

  const handleBulkUpload = () => {
    try {
      const data = JSON.parse(bulkArtworksText);
      fetch(`http://192.168.178.61:5000/api/museums/${selectedMuseum}/artworks/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(() => {
        setBulkArtworksText('');
        setSuccessMessage('Bulk upload successful!');
        fetchArtworks(selectedMuseum);
        setTimeout(() => setSuccessMessage(''), 3000);
      });
    } catch {
      alert('Invalid JSON');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(filteredArtworks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'artworks.json';
    a.click();
  };

  const handleCheckboxChange = (id) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const bulkDelete = () => {
    selectedRows.forEach(id => {
      fetch(`http://192.168.178.61:5000/api/artworks/${id}`, { method: 'DELETE' })
        .then(() => fetchArtworks(selectedMuseum));
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
      fetchArtworks(selectedMuseum);
    });
  };

  return (
    <div style={containerStyle}>
      <button onClick={() => setSidebarVisible(!sidebarVisible)} style={toggleButtonStyle}>
        {sidebarVisible ? '←' : '☰'}
      </button>
      <div style={sidebarStyle}>
        <div>
          <h3>Museums</h3>
          {museums.map(m => (
            <button key={m.id} onClick={() => {
              setSelectedMuseum(m.id);
              setSelectedMuseumName(m.name);
            }} style={{ ...buttonStyle, width: '100%' }}>
              {m.name}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 'auto' }}>
          <button onClick={() => setDarkMode(!darkMode)} style={buttonStyle}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
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
                rows="6"
                value={bulkArtworksText}
                onChange={e => setBulkArtworksText(e.target.value)}
                style={{ ...inputStyle, width: '100%' }}
              />
              <button onClick={handleBulkUpload} style={buttonStyle}>Upload JSON</button>
            </div>

            <div>
              <button onClick={handleDownload} style={buttonStyle}>Download JSON</button>
              {selectedRows.length > 0 && (
                <button onClick={bulkDelete} style={{ ...buttonStyle, backgroundColor: 'red' }}>Delete Selected</button>
              )}
            </div>

            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}></th>
                  <th style={thStyle} onClick={() => setSortField('id')}>ID</th>
                  {['title', 'artist', 'year', 'exhibition'].map(field => (
                    <th key={field} style={thStyle} onClick={() => setSortField(field)}>{field}</th>
                  ))}
                  <th style={thStyle}>Actions</th>
                </tr>
                <tr>
                  <th></th>
                  <th></th>
                  {['title', 'artist', 'year', 'exhibition'].map(field => (
                    <th key={field}>
                      <input value={filterFields[field]} onChange={(e) => setFilterFields({ ...filterFields, [field]: e.target.value })} style={inputStyle} />
                    </th>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredArtworks.map(art => (
                  <tr key={art.id}>
                    <td style={tdStyle}>
                      <input type="checkbox" checked={selectedRows.includes(art.id)} onChange={() => handleCheckboxChange(art.id)} />
                    </td>
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
