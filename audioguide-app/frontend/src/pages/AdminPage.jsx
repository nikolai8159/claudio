// pages/AdminPage.jsx
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ArtworkForm from '../components/ArtworkForm';
import ArtworkTable from '../components/ArtworkTable';
import ToggleSidebarButton from '../components/ToggleSidebarButton';
import SuccessMessage from '../components/SuccessMessage';
import {
  getMuseums,
  getArtworks,
  addArtwork,
  addBulkArtworks,
  updateArtwork,
  deleteArtwork
} from '../services/api';

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
  const [newArtwork, setNewArtwork] = useState({ title: '', artist: '', year: '', exhibition: '', text: '', audiofile: '' });
  const [bulkArtworksText, setBulkArtworksText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [showAddTools, setShowAddTools] = useState(false);

  const theme = {
    background: darkMode ? '#013220' : '#f0f0f0',
    text: darkMode ? '#ffffff' : '#000000',
    inputBg: darkMode ? '#1e402f' : '#ffffff',
    inputText: darkMode ? '#ffffff' : '#000000',
    border: darkMode ? '#446655' : '#ccc',
    buttonBg: darkMode ? '#2e8b57' : '#004080',
    tableBg: darkMode ? '#14532d' : '#e6f0ff'
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
    overflowX: 'auto',
    backgroundColor: theme.background,
    color: theme.text
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
      <h1>🎨 Admin Console</h1>
    </div>
  );
}

export default AdminPage;
