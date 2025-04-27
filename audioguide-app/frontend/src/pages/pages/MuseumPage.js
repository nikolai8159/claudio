import { useParams } from 'react-router-dom';

function MuseumPage() {
  const { museumId } = useParams();

  return (
    <div>
      <h1>{museumId.toUpperCase()}</h1>
      <p>This is the museum page for {museumId}.</p>
    </div>
  );
}

export default MuseumPage;
