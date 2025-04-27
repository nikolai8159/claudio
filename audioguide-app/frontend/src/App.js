import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MuseumPage from './pages/MuseumPage';
import AdminPage from './pages/AdminPage'; // <-- IMPORTANT: Import AdminPage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/museum/:museumId" element={<MuseumPage />} />
        <Route path="/admin" element={<AdminPage />} /> {/* <-- IMPORTANT: Add Admin Route */}
      </Routes>
    </Router>
  );
}

export default App;
