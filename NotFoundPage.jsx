import { useNavigate } from 'react-router';
import Button from '../components/Button';
import './css/NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-icon">🔍</div>
        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-subtitle">Page Not Found</h2>
        <p className="notfound-message">
          Sorry, the page you are looking for does not exist. 
        </p>
        <div className="notfound-buttons">
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
          <Button onClick={() => navigate('/')} variant="primary">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;