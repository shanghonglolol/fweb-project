import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import bookService from '../services/bookService';
import Button from '../components/Button';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import './css/SearchResultsPage.css';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('query') || '';

  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await bookService.searchBooks(query, {
          availableOnly: showAvailableOnly
        });
        setFilteredBooks(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [query, showAvailableOnly]); //re fetches when query or filter changes

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return <LoadingSpinner message="Searching for books..." />;
  }

  if (error) {
    return (
      <div className="search-results-container">
        <EmptyState icon="❌" title="Error" message={error} buttonText="Go Back" onButtonClick={handleBack} />
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="search-header">
        <Button onClick={handleBack} variant="back">
          ← Back
        </Button>
        <h1 className="search-title">
          Search results for: <span className="search-query">"{query}"</span>
        </h1>
      </div>

      <div className="filter-section">
        <label className="filter-label">
          <input type="checkbox" checked={showAvailableOnly} onChange={(e) => setShowAvailableOnly(e.target.checked)} />
          Available now
        </label>
      </div>

      <p className="results-count">
        Showing {filteredBooks.length} result{filteredBooks.length !== 1 ? 's' : ''}
      </p>

      {filteredBooks.length > 0 ? (
        <div className="book-list">
          {filteredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onClick={handleBookClick}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🔍"
          title="No books found"
          message="Try searching with different words"
          buttonText="Go home"
          onButtonClick={handleBack}
        />
      )}
    </div>
  );
};

export default SearchResultsPage;