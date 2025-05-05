// src/components/ToggleSidebarButton.jsx
import React from 'react';

function ToggleSidebarButton({ onClick, visible, theme }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        left: visible ? '220px' : '10px',
        top: '10px',
        zIndex: 2,
        backgroundColor: theme.buttonBg,
        color: '#fff',
        border: 'none',
        padding: '6px 10px',
        cursor: 'pointer',
        borderRadius: '4px'
      }}
    >
      {visible ? '←' : '☰'}
    </button>
  );
}

export default ToggleSidebarButton;
