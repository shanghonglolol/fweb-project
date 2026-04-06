import mongoose from 'mongoose';

// define schema
const reservationSchema = new mongoose.Schema({
  bookId: { type: Number, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  status: { type: String, enum: ['waiting', 'ready', 'completed', 'cancelled'], default: 'waiting' },
  statusText: { type: String, default: 'IN QUEUE' },
  reservedDate: { type: String, required: true },
  expiresDate: { type: String },
  location: { type: String },
  queuePosition: { type: Number },
  estimatedAvailability: { type: String },
  pickedUpDate: { type: String },
  cancelledDate: { type: String }
});

// create and export model
const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;