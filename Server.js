import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import reservationRoutes from './routes/reservation-routes.js';
import bookRoutes from './routes/book-routes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library Finder API',
      version: '1.0.0',
      description: 'API documentation for Library Book Finder & Reservation System',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to route files
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API routes
app.use('/reservations', reservationRoutes);
app.use('/books', bookRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Library Finder API is running!' });
});

// 404catch all route
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not defined');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });