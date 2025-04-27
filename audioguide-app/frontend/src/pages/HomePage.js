import { Link } from 'react-router-dom';

function HomePage() {
  const museums = [
    { id: 'louvre', name: 'Louvre' },
    { id: 'moma', name: 'MoMA' },
    { id: 'uffizi', name: 'Uffizi Gallery' }
  ];

  return (
    <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ffe0b2', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '20px' }}>Museum Audioguide</h1>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
        {museums.map((museum) => (
          <Link 
            key={museum.id} 
            to={`/museum/${museum.id}`}
            style={{
              display: 'inline-block',
              padding: '20px',
              backgroundColor: '#fb8c00',
              color: 'white',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '20px',
              width: '200px',
              textAlign: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}
          >
            {museum.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
