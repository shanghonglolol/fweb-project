import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import bookService from '../services/bookService';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import './css/NavigationPage.css';

const NavigationPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await bookService.getBookById(bookId);
        
        //checks if the book is available
        if (data.status !== 'available') {
          setError('Navigation is only available for books that are currently available');
        } else {
          setBook(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const handleBack = () => {
    navigate(`/book/${bookId}`);
  };

  const handleDone = () => {
    navigate('/');
  };

  if (loading) {
    return <LoadingSpinner message="Loading directions..." />;
  }

  if (error || !book) {
    return (
      <div className="navigation-container">
        <EmptyState
          icon="❌"
          title="Navigation not available"
          message={error || 'Unable to load navigation'}
          buttonText="Go Back"
          onButtonClick={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="navigation-container">
      <div className="navigation-header">
        <h1>Navigation</h1>
      </div>

      <div className="navigation-content">
        {/* Visual Route */}
        <div className="route-visual">
          <div className="route-start">
            <span className="route-icon">🚪</span>
            <span className="route-label">Entrance</span>
          </div>
          <div className="route-line"></div>
          <div className="route-end">
            <span className="route-icon">📚</span>
            <span className="route-label">Book location</span>
          </div>
        </div>

        {/* Walk Time */}
        <div className="walk-time-section">
          <span className="walk-time-icon">⏱</span>
          <span className="walk-time-text">{book.walkTime} minutes walk</span>
        </div>

        {/* Directions */}
        <div className="directions-section">
          <h2 className="directions-title">Directions</h2>
          <div className="direction-step">
            <span className="step-number">1</span>
            <span className="step-text">Enter the main library entrance</span>
          </div>
          <div className="direction-step">
            <span className="step-number">2</span>
            <span className="step-text">Take the stairs or lift to level {book.location.level}</span>
          </div>
          <div className="direction-step">
            <span className="step-number">3</span>
            <span className="step-text">Walk to section {book.location.section}</span>
          </div>
          <div className="direction-step">
            <span className="step-number">4</span>
            <span className="step-text">Find shelf {book.location.shelf}</span>
          </div>
          <div className="direction-step">
            <span className="step-number">5</span>
            <span className="step-text">Look for "{book.title}"</span>
          </div>
        </div>

        {/* Location Details */}
        <div className="location-details-section">
          <h3 className="location-title">Location details</h3>
          <div className="location-info">
            <p><strong>Level:</strong> {book.location.level}</p>
            <p><strong>Section:</strong> {book.location.section}</p>
            <p><strong>Shelf:</strong> {book.location.shelf}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="navigation-buttons">
          <Button onClick={handleBack} variant="outline" fullWidth>
            ← Back to book details
          </Button>
          <Button onClick={handleDone} variant="primary" fullWidth>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NavigationPage;