import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Reservation from './models/reservation-models.js';

dotenv.config();

const reservations = [
  // Rready for pickup (2 reservations)
  {
    bookId: 6,
    title: "Design Patterns",
    author: "Erich Gamma",
    status: "ready",
    statusText: "READY FOR PICKUP",
    reservedDate: "Jan 10, 2026",
    expiresDate: "Jan 20, 2026",
    location: "Level 2, Section B, Shelf 10",
    queuePosition: null,
    estimatedAvailability: null
  },
  {
    bookId: 7,
    title: "Computer Networks",
    author: "Andrew S. Tanenbaum",
    status: "ready",
    statusText: "READY FOR PICKUP",
    reservedDate: "Jan 12, 2026",
    expiresDate: "Jan 22, 2026",
    location: "Level 3, Section C, Shelf 8",
    queuePosition: null,
    estimatedAvailability: null
  },

  // In queue (3 reservations)
  {
    bookId: 2,
    title: "Database Systems",
    author: "Ramez Elmasri",
    status: "waiting",
    statusText: "IN QUEUE",
    reservedDate: "Jan 14, 2026",
    queuePosition: 3,
    estimatedAvailability: "Jan 26-28, 2026"
  },
  {
    bookId: 4,
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell",
    status: "waiting",
    statusText: "IN QUEUE",
    reservedDate: "Jan 13, 2026",
    queuePosition: 6,
    estimatedAvailability: "Feb 1-3, 2026"
  },
  {
    bookId: 8,
    title: "Operating System Concepts",
    author: "Abraham Silberschatz",
    status: "waiting",
    statusText: "IN QUEUE",
    reservedDate: "Jan 15, 2026",
    queuePosition: 5,
    estimatedAvailability: "Feb 6-8, 2026"
  },

  // Completed (1 reservation)
  {
    bookId: 1,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    status: "completed",
    statusText: "COMPLETED",
    reservedDate: "Jan 5, 2026",
    pickedUpDate: "Jan 8, 2026"
  },

  // Cancelled (1 reservation)
  {
    bookId: 3,
    title: "Clean Code",
    author: "Robert C. Martin",
    status: "cancelled",
    statusText: "CANCELLED",
    reservedDate: "Jan 7, 2026",
    cancelledDate: "Jan 9, 2026"
  }
];

async function seedReservations() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing reservations
    await Reservation.deleteMany({});
    console.log('Cleared existing reservations');

    // Insert new reservations
    await Reservation.insertMany(reservations);
    console.log('Successfully seeded reservations!');
    console.log('- 2 ready for pickup');
    console.log('- 3 in queue');
    console.log('- 1 completed');
    console.log('- 1 cancelled');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding reservations:', error);
    process.exit(1);
  }
}

seedReservations();