// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. CORS МАЄ БУТИ НАЙПЕРШИМ МІДЛВАРОМ!
app.use(cors({
  origin: [
    'https://webkursak.vercel.app', // Твій основний домен Vercel
    'https://webkursak-pxzbqupnn-bladvik-s-projects.vercel.app' // Домен з твого останнього скріншоту
  ],
  credentials: true, // Дозволяє передавати токени та куки
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// 2. Тепер парсери (збільшили ліміт для великих збірок)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// backend/server.js
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payment', paymentRoutes);
// 3. Підключення Passport.js
const passport = require('passport');
require('./config/passport'); // Запускаємо конфігурацію
app.use(passport.initialize());

// 4. Підключення до бази даних MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// 5. Підключення роутів
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/configs', require('./routes/configRoutes'));

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Nexus Systems API is running' });
});

// Port Binding
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});