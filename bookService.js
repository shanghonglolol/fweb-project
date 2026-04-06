//bookService.js handles all book-related operations with mock data, its also easy to switch to real API later
//bookService.js also calls backend API
const API_URL = 'http://localhost:5001/books';

const bookService = {
  getAllBooks: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch books');
      return await response.json();
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  },
  
  searchBooks: async (query, filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (query) params.append('search', query);
      if (filters.availableOnly) params.append('availableOnly', 'true');
      
      const response = await fetch(`${API_URL}?${params}`);
      if (!response.ok) throw new Error('Failed to search books');
      return await response.json();
    } catch (error) {
      console.error('Error searching books:', error);
      return [];
    }
  },

  getBookById: async (bookId) => {
    try {
      const response = await fetch(`${API_URL}/${bookId}`);
      if (!response.ok) throw new Error('Book not found');
      return await response.json();
    } catch (error) {
      console.error('Error fetching book:', error);
      throw error;
    }
  },

  getBooksByIds: async (bookIds) => {
    try {
      const books = await bookService.getAllBooks();
      return books.filter(book => bookIds.includes(book.id));
    } catch (error) {
      console.error('Error fetching books by IDs:', error);
      return [];
    }
  }
};

export default bookService;