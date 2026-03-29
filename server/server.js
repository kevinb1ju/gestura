const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Pre-flight OPTIONS fix
app.options('*', cors());

app.use(express.json());

const allowedOrigins = [
  'http://localhost:3000',
  'https://gestura-indol.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/institutions', require('./routes/institutionRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Gestura API is running',
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🎮 Gestura API',
    version: '1.0.0',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}\n`);
});
