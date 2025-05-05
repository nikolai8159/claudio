// pages/AdminPage.jsx
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ArtworkForm from '../components/ArtworkForm';
import ArtworkTable from '../components/ArtworkTable';
import ToggleSidebarButton from '../components/ToggleSidebarButton';
import SuccessMessage from '../components/SuccessMessage';

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
      fetchArtworks(selectedMuseum);
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

  const fetchArtworks = (museumId) => {
    fetch(`http://192.168.178.61:5000/api/museums/${museumId}/artworks`)
      .then(res => res.json())
      .then(data => setArtworks(data));
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
      <ToggleSidebarButton onClick={() => setSidebarVisible(!sidebarVisible)} visible={sidebarVisible} theme={theme} />

      <Sidebar
        museums={museums}
        onSelectMuseum={(m) => {
          setSelectedMuseum(m.id);
          setSelectedMuseumName(m.name);
        }}
        selectedMuseumName={selectedMuseumName}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        sidebarVisible={sidebarVisible}
        theme={theme}
        buttonStyle={buttonStyle}
      />

      <div style={mainStyle}>
        <h2>Admin Console</h2>
        {selectedMuseum && (
          <>
            <h3>{selectedMuseumName}</h3>
            <SuccessMessage message={successMessage} />

            <ArtworkForm
              newArtwork={newArtwork}
              onChange={(key, value) => setNewArtwork({ ...newArtwork, [key]: value })}
              onAdd={handleAddArtwork}
              bulkArtworksText={bulkArtworksText}
              setBulkArtworksText={setBulkArtworksText}
              onBulkUpload={handleBulkUpload}
              inputStyle={inputStyle}
              buttonStyle={buttonStyle}
            />

            <div>
              <button onClick={handleDownload} style={buttonStyle}>Download JSON</button>
              {selectedRows.length > 0 && (
                <button onClick={bulkDelete} style={{ ...buttonStyle, backgroundColor: 'red' }}>Delete Selected</button>
              )}
            </div>

            <ArtworkTable
              filteredArtworks={filteredArtworks}
              filterFields={filterFields}
              setFilterFields={setFilterFields}
              selectedRows={selectedRows}
              onCheckboxChange={handleCheckboxChange}
              onEditClick={startEditing}
              editingArtworkId={editingArtworkId}
              editedArtwork={editedArtwork}
              onEditChange={handleEditChange}
              onSaveEdit={saveEditedArtwork}
              onCancelEdit={() => setEditingArtworkId(null)}
              onSort={(field) => setSortField(field)}
              sortField={sortField}
              inputStyle={inputStyle}
              buttonStyle={buttonStyle}
              tableStyle={tableStyle}
              thStyle={thStyle}
              tdStyle={tdStyle}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
