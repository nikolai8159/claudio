// src/components/SuccessMessage.jsx
import React from 'react';

function SuccessMessage({ message }) {
  if (!message) return null;
  return <p style={{ color: 'lightgreen' }}>{message}</p>;
}

export default SuccessMessage;
