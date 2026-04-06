import express from 'express';
import Book from '../models/book-models.js';

const router = express.Router();

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Retrieve all books
 *     description: Get all books in the library system
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query for title or author
 *       - in: query
 *         name: availableOnly
 *         schema:
 *           type: boolean
 *         description: Filter to show only available books
 *     responses:
 *       200:
 *         description: A list of books
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const { search, availableOnly } = req.query;
    
    let query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Available only filter
    if (availableOnly === 'true') {
      query.status = 'available';
    }
    
    const books = await Book.find(query);
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error while fetching books' });
  }
});

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Retrieve a book by ID
 *     description: Get details of a specific book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: The book ID
 *     responses:
 *       200:
 *         description: Book details
 *       404:
 *         description: Book not found
 *       400:
 *         description: Invalid book ID format
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
  try {
    // Validates id format before database query
    const bookId = parseInt(req.params.id);
    
    if (isNaN(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID format. ID must be a number.' });
    }
    
    // Validates positive number
    if (bookId < 1) {
      return res.status(400).json({ message: 'Invalid book ID. ID must be a positive number.' });
    }
    
    const book = await Book.findOne({ id: bookId });
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    
    //Handles specific mongoose errors
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }
    
    res.status(500).json({ message: 'Server error while fetching book' });
  }
});

export default router;