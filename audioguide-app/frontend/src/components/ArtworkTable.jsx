// src/components/ArtworkTable.jsx
import React from 'react';

function ArtworkTable({
  filteredArtworks,
  filterFields,
  setFilterFields,
  selectedRows,
  onCheckboxChange,
  onEditClick,
  editingArtworkId,
  editedArtwork,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onSort,
  sortField,
  inputStyle,
  buttonStyle,
  tableStyle,
  thStyle,
  tdStyle
}) {
  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}></th>
          <th style={thStyle} onClick={() => onSort('id')}>ID</th>
          {['title', 'artist', 'year', 'exhibition'].map(field => (
            <th key={field} style={thStyle} onClick={() => onSort(field)}>{field}</th>
          ))}
          <th style={thStyle}>Actions</th>
        </tr>
        <tr>
          <th></th>
          <th></th>
          {['title', 'artist', 'year', 'exhibition'].map(field => (
            <th key={field}>
              <input
                value={filterFields[field]}
                onChange={(e) => setFilterFields({ ...filterFields, [field]: e.target.value })}
                style={inputStyle}
              />
            </th>
          ))}
          <th></th>
        </tr>
      </thead>
      <tbody>
        {filteredArtworks.map(art => (
          <tr key={art.id}>
            <td style={tdStyle}>
              <input
                type="checkbox"
                checked={selectedRows.includes(art.id)}
                onChange={() => onCheckboxChange(art.id)}
              />
            </td>
            <td style={tdStyle}>{art.id}</td>
            {editingArtworkId === art.id ? (
              <>
                {['title', 'artist', 'year', 'exhibition'].map(field => (
                  <td key={field} style={tdStyle}>
                    <input
                      value={editedArtwork[field]}
                      onChange={(e) => onEditChange(field, e.target.value)}
                      style={inputStyle}
                    />
                  </td>
                ))}
                <td style={tdStyle}>
                  <button onClick={onSaveEdit} style={buttonStyle}>Save</button>
                  <button onClick={onCancelEdit} style={buttonStyle}>Cancel</button>
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
                    <button onClick={() => onEditClick(art)} style={buttonStyle}>Edit</button>
                  )}
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ArtworkTable;
