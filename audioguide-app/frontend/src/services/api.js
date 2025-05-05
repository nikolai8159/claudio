// src/services/api.js

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export async function getMuseums() {
  const res = await fetch(`${BASE_URL}/api/museums`);
  if (!res.ok) throw new Error('Failed to fetch museums');
  return res.json();
}

export async function getArtworks(museumId) {
  const res = await fetch(`${BASE_URL}/api/museums/${museumId}/artworks`);
  if (!res.ok) throw new Error('Failed to fetch artworks');
  return res.json();
}

export async function addArtwork(museumId, data) {
  const res = await fetch(`${BASE_URL}/api/museums/${museumId}/artworks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add artwork');
}

export async function addBulkArtworks(museumId, data) {
  const res = await fetch(`${BASE_URL}/api/museums/${museumId}/artworks/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to bulk upload');
}

export async function updateArtwork(artworkId, data) {
  const res = await fetch(`${BASE_URL}/api/artworks/${artworkId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update artwork');
}

export async function deleteArtwork(artworkId) {
  const res = await fetch(`${BASE_URL}/api/artworks/${artworkId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to delete artwork ${artworkId}`);
}
