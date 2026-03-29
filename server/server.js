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
  origin: ["https://gestura-indol.vercel.app", "http://localhost:3000"],
  credentials: true,
}));

// Manual pre-flight handler (Redundant but safe)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

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
    message: '🎮 Gestura API (LIVE SYNC V5)',
    version: '1.0.5',
    timestamp: new Date().toISOString(),
    allowed_origin_test: "https://gestura-indol.vercel.app"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}\n`);
});
