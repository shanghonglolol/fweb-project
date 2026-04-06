import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  publisher: { type: String, required: true },
  year: { type: Number, required: true },
  format: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['available', 'borrowed'], required: true },
  location: {
    level: { type: Number },
    section: { type: String },
    shelf: { type: String }
  },
  walkTime: { type: Number },
  dueDate: { type: String },
  returnDays: { type: Number },
  waitingList: { type: Number },
  estimatedAvailability: { type: String }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
export default Book;