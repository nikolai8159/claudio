// src/components/Sidebar.jsx
import React from 'react';

function Sidebar({
  museums,
  onSelectMuseum,
  selectedMuseumName,
  darkMode,
  toggleDarkMode,
  sidebarVisible,
  theme,
  buttonStyle
}) {
  const sidebarStyle = {
    width: sidebarVisible ? '220px' : '0px',
    overflowX: 'hidden',
    backgroundColor: theme.tableBg, // ✅ apply green theme background
    padding: sidebarVisible ? '20px' : '0px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'width 0.3s'
  };

  return (
    <div style={sidebarStyle}>
      <div>
        <h3>Museums</h3>
        {museums.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelectMuseum(m)}
            style={{ ...buttonStyle, width: '100%' }}
          >
            {m.name}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 'auto' }}>
        <button onClick={toggleDarkMode} style={buttonStyle}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
