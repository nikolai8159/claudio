import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MuseumPage from './pages/MuseumPage'; // we will create this one next!

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
