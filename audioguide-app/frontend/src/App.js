import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MuseumPage from './pages/MuseumPage'; // <-- This is very important!

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/museum/:museumId" element={<MuseumPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
