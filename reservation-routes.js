import express from 'express';
import Reservation from '../models/reservation-models.js';

const router = express.Router();

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a new reservation
 *     description: Add a new book reservation to the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - title
 *               - author
 *             properties:
 *               bookId:
 *                 type: number
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               status:
 *                 type: string
 *               statusText:
 *                 type: string
 *               reservedDate:
 *                 type: string
 *               queuePosition:
 *                 type: number
 *               estimatedAvailability:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *       400:
 *         description: Invalid request data
 */
router.post('/', async (req, res) => {
  try {
    const { bookId, title, author, status } = req.body;
    // Validate required fields
    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' });
    }
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    if (!author) {
      return res.status(400).json({ message: 'Author is required' });
    }
    
    // Validate status enum
    const validStatuses = ['waiting', 'ready', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    //then create new reservation  
    const newReservation = new Reservation(req.body);
    const saved = await newReservation.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Retrieve all reservations
 *     description: Get all reservations split into active and history
 *     responses:
 *       200:
 *         description: A list of active and historical reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 active:
 *                   type: array
 *                   items:
 *                     type: object
 *                 history:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    const active = reservations.filter(r => r.status === 'ready' || r.status === 'waiting');
    const history = reservations.filter(r => r.status === 'completed' || r.status === 'cancelled');
    res.json({ active, history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Retrieve a reservation by ID
 *     description: Get details of a specific reservation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The reservation ID
 *     responses:
 *       200:
 *         description: Reservation details
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Update a reservation
 *     description: Update reservation details (e.g., status, dates)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               statusText:
 *                 type: string
 *               cancelledDate:
 *                 type: string
 *               pickedUpDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *       404:
 *         description: Reservation not found
 *       400:
 *         description: Invalid request data
 */
router.put('/:id', async (req, res) => {
  try {
    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Delete a reservation
 *     description: Remove a reservation from the system
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The reservation ID
 *     responses:
 *       200:
 *         description: Reservation deleted successfully
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json({ message: 'Reservation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;