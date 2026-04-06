//calls backend API
const API_URL = 'http://localhost:5001/reservations';

const reservationService = {
  // READ - get all reservations
  getAllReservations: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch reservations');
      return await response.json();
    } catch (error) {
      console.error('Error fetching reservations:', error);
      return { active: [], history: [] };
    }
  },

  // CREATE - add reservation
  addReservation: async (book) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: book.id,
          title: book.title,
          author: book.author,
          status: 'waiting',
          statusText: 'IN QUEUE',
          reservedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          queuePosition: (book.waitingList || 0) + 1,
          estimatedAvailability: book.estimatedAvailability || 'TBD'
        })
      });
      if (!response.ok) throw new Error('Failed to add reservation');
      return await response.json();
    } catch (error) {
      console.error('Error adding reservation:', error);
      throw error;
    }
  },

  // UPDATE - cancel reservation
  cancelReservation: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'cancelled',
          statusText: 'CANCELLED',
          cancelledDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        })
      });
      return response.ok;
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      return false;
    }
  },

  // UPDATE - confirm pickup
  confirmPickup: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'completed',
          statusText: 'COMPLETED',
          pickedUpDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        })
      });
      if (response.ok) alert('Pickup confirmed!');
      return response.ok;
    } catch (error) {
      console.error('Error confirming pickup:', error);
      return false;
    }
  },

  // HELPER - get recent searches from localStorage
  getRecentSearches: () => {
    try {
      const searches = localStorage.getItem('recentSearches');
      return searches ? JSON.parse(searches) : [];
    } catch (error) {
      console.error('Error getting recent searches:', error);
      return [];
    }
  },

  // HELPER - add recent search to localStorage
  addRecentSearch: (query) => {
    try {
      let searches = reservationService.getRecentSearches();
      // Remove if already exists
      searches = searches.filter(s => s !== query);
      // Add to beginning
      searches.unshift(query);
      // Keep only last 5
      searches = searches.slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(searches));
    } catch (error) {
      console.error('Error adding recent search:', error);
    }
  }
};

export default reservationService;