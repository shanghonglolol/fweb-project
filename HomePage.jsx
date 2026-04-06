import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import temasekLogo from '../assets/temasek.png';
import reservationService from '../services/reservationService';
import Button from '../components/Button';
import './css/HomePage.css';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    //loads recent searches
    const searches = reservationService.getRecentSearches();
    setRecentSearches(searches);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault(); //prevents page from reloading
    setError('');

    //validation 
    if (!searchQuery.trim()) {
      setError('Please enter a search');
      return;
    }

    if (searchQuery.trim().length < 2) {
      setError('Search query must be at least 2 characters');
      return;
    }

    //saves to recent searches
    reservationService.addRecentSearch(searchQuery.trim());

    //navigates to search results
    navigate(`/search?query=${searchQuery.trim()}`);
  };

  const handleRecentSearchClick = (query) => {
    setSearchQuery(query);
    navigate(`/search?query=${query}`);
  };

  return (
    <div className="home-container">
      <img src={temasekLogo} alt="Temasek Polytechnic" className="home-logo" />

      <h1 className="home-title">Library Book Finder</h1>
      <p className="home-subtitle">Search for books in Temasek Polytechnic Library</p>

      <form onSubmit={handleSearch} className="search-form">
        <input type="text" placeholder="Search Books, Authors, etc." value={searchQuery} onChange={(e) => {
          setSearchQuery(e.target.value);
          setError('');
        }}
          className={`search-input ${error ? 'input-error' : ''}`}
        />
        {error && <p className="error-message">{error}</p>}
        <Button type="submit" variant="primary" fullWidth>
          Search
        </Button>
      </form>

      {recentSearches.length > 0 && (
        <div className="section">
          <h3 className="section-title">Recent searches</h3>
          {recentSearches.map((search, index) => (
            <p key={index} className="section-item clickable" onClick={() => handleRecentSearchClick(search)}>
              • {search}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;