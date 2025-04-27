import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
// import MuseumPage from './pages/MuseumPage';  // 🔥 This line must be commented out or deleted!

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/museum/:museumId" element={<MuseumPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
