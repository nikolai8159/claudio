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
    <div style={{ padding: '20px' }}>
      {/* UI code continues here... */}
    </div>
  );
}

export default AdminPage;
