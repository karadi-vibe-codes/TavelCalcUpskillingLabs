import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ItemsPage from './pages/ItemsPage.jsx';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>My App</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/items">Items</Link>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items" element={<ItemsPage />} />
        </Routes>
      </main>
    </div>
  );
}
