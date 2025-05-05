// src/components/ArtworkForm.jsx
import React from 'react';

function ArtworkForm({ newArtwork, onChange, onAdd, bulkArtworksText, setBulkArtworksText, onBulkUpload, inputStyle, buttonStyle }) {
  return (
    <div>
      <h4>Add Artwork</h4>
      {Object.keys(newArtwork).map(key => (
        <input
          key={key}
          placeholder={key}
          value={newArtwork[key]}
          onChange={e => onChange(key, e.target.value)}
          style={inputStyle}
        />
      ))}
      <button onClick={onAdd} style={buttonStyle}>Add</button>

      <h4>Bulk Upload</h4>
      <textarea
        rows="6"
        value={bulkArtworksText}
        onChange={e => setBulkArtworksText(e.target.value)}
        style={{ ...inputStyle, width: '100%' }}
      />
      <button onClick={onBulkUpload} style={buttonStyle}>Upload JSON</button>
    </div>
  );
}

export default ArtworkForm;
