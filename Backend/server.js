require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Routes
const authRoutes     = require('./routes/authRoutes');
const taskRoutes     = require('./routes/taskRoutes');
const eventRoutes    = require('./routes/eventRoutes');
const goalRoutes     = require('./routes/goalRoutes');
const noteRoutes     = require('./routes/noteRoutes');
const activityRoutes = require('./routes/activityRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// ── Middleware ──
app.use(cors({
  origin: 'http://localhost:5173',  // Vite dev server default
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Route Mounting ──
app.use('/api/auth',       authRoutes);
app.use('/api/tasks',      taskRoutes);
app.use('/api/events',     eventRoutes);
app.use('/api/goals',      goalRoutes);
app.use('/api/notes',      noteRoutes);
app.use('/api/activities', activityRoutes);

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

// ── Global Error Handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// ── Start Server ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Smart Study Planner Backend running on http://localhost:${PORT}`);
  console.log(`📦 Database: ${process.env.MONGO_URI || 'mongodb://localhost:27017/smartstudy'}`);
  console.log(`🌍 CORS Origin: http://localhost:5173\n`);
});
