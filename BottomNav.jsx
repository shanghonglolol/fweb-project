import { useNavigate, useLocation } from 'react-router';
import './css/BottomNav.css';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bottom-nav">
      <button className={`nav-item ${isActive('/') ? 'active' : ''}`} onClick={() => navigate('/')}>
        <span className="nav-icon">🏠</span>
        <span className="nav-label">Home</span>
      </button>

      <button className={`nav-item ${isActive('/search') ? 'active' : ''}`} onClick={() => navigate('/search?query=')}>
        <span className="nav-icon">🔍</span>
        <span className="nav-label">Search</span>
      </button>

      <button className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => navigate('/dashboard')}>
        <span className="nav-icon">📊</span>
        <span className="nav-label">Dashboard</span>
      </button>

      <button className={`nav-item ${isActive('/reservations') ? 'active' : ''}`} onClick={() => navigate('/reservations')}>
        <span className="nav-icon">📚</span>
        <span className="nav-label">Reservations</span>
      </button>
    </nav>
  );
};

export default BottomNav;