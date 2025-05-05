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
    background: darkMode ? '#013220' : '#f0f0f0',           // dark green background
    text: darkMode ? '#ffffff' : '#000000',
    inputBg: darkMode ? '#1e402f' : '#ffffff',              // darker green for inputs
    inputText: darkMode ? '#ffffff' : '#000000',
    border: darkMode ? '#446655' : '#ccc',                 // greenish border
    buttonBg: darkMode ? '#2e8b57' : '#004080',            // sea green buttons
    tableBg: darkMode ? '#14532d' : '#e6f0ff'              // dark green table bg
  };
