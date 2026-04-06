import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/book-models.js';

dotenv.config();

const books = [
  {
    id: 1,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    publisher: "MIT Press",
    year: 2009,
    format: "Hardcover",
    description: "A comprehensive textbook covering a broad range of algorithms in depth, yet making their design and analysis accessible to all levels of readers.",
    status: "available",
    location: { level: 3, section: "A", shelf: "12" },
    walkTime: 5
  },
  {
    id: 2,
    title: "Database Systems",
    author: "Ramez Elmasri",
    publisher: "Pearson",
    year: 2015,
    format: "Paperback",
    description: "An introduction to database systems with an emphasis on database design, database languages, and database-system implementation.",
    status: "borrowed",
    dueDate: "Jan 25, 2026",
    returnDays: 10,
    waitingList: 2,
    estimatedAvailability: "Jan 26-28, 2026"
  },
  {
    id: 3,
    title: "Clean Code",
    author: "Robert C. Martin",
    publisher: "Prentice Hall",
    year: 2008,
    format: "Paperback",
    description: "A handbook of agile software craftsmanship with practical advice on writing clean, maintainable code.",
    status: "available",
    location: { level: 2, section: "B", shelf: "8" },
    walkTime: 3
  },
  {
    id: 4,
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell",
    publisher: "Pearson",
    year: 2020,
    format: "Hardcover",
    description: "The leading textbook in Artificial Intelligence, used in over 1400 universities in over 120 countries.",
    status: "borrowed",
    dueDate: "Jan 30, 2026",
    returnDays: 15,
    waitingList: 5,
    estimatedAvailability: "Feb 1-3, 2026"
  },
  {
    id: 5,
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    publisher: "O'Reilly Media",
    year: 2008,
    format: "Paperback",
    description: "A deep dive into the most essential and elegant parts of JavaScript, helping you write better code.",
    status: "available",
    location: { level: 1, section: "C", shelf: "15" },
    walkTime: 2
  },
  {
    id: 6,
    title: "Design Patterns",
    author: "Erich Gamma",
    publisher: "Addison-Wesley",
    year: 1994,
    format: "Hardcover",
    description: "Elements of Reusable Object-Oriented Software. Essential reading for software engineers and architects.",
    status: "borrowed",
    dueDate: "Jan 20, 2026",
    returnDays: 5,
    waitingList: 3,
    estimatedAvailability: "Jan 21-23, 2026"
  },
  {
    id: 7,
    title: "Computer Networks",
    author: "Andrew S. Tanenbaum",
    publisher: "Pearson",
    year: 2010,
    format: "Hardcover",
    description: "A comprehensive guide to computer networks covering protocols, architecture, and security.",
    status: "borrowed",
    dueDate: "Jan 22, 2026",
    returnDays: 7,
    waitingList: 1,
    estimatedAvailability: "Jan 23-25, 2026"
  },
  {
    id: 8,
    title: "Operating System Concepts",
    author: "Abraham Silberschatz",
    publisher: "Wiley",
    year: 2018,
    format: "Hardcover",
    description: "Comprehensive coverage of operating system principles including process management, memory management, and file systems.",
    status: "borrowed",
    dueDate: "Feb 5, 2026",
    returnDays: 21,
    waitingList: 4,
    estimatedAvailability: "Feb 6-8, 2026"
  },
  {
    id: 9,
    title: "Python Crash Course",
    author: "Eric Matthes",
    publisher: "No Starch Press",
    year: 2019,
    format: "Paperback",
    description: "A hands-on, project-based introduction to programming in Python for beginners.",
    status: "available",
    location: { level: 2, section: "D", shelf: "5" },
    walkTime: 4
  },
  {
    id: 10,
    title: "Web Development with Node and Express",
    author: "Ethan Brown",
    publisher: "O'Reilly Media",
    year: 2019,
    format: "Paperback",
    description: "Learn how to build dynamic web applications with Express and Node.js.",
    status: "available",
    location: { level: 1, section: "E", shelf: "20" },
    walkTime: 3
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing books
    await Book.deleteMany({});
    console.log('Cleared existing books');

    //insert new books 
    await Book.insertMany(books);
    console.log('Successfully seeded books!');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();