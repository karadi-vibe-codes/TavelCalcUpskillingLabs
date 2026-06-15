import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page">
      <h2>Welcome</h2>
      <p>This is a React + Express + MongoDB starter.</p>
      <Link to="/items" className="btn">View Items →</Link>
    </div>
  );
}
