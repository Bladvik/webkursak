// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const { login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const OTP = require('../models/OTP');
const User = require('../models/User');

// Налаштовуємо поштаря
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ... твої імпорти (nodemailer, OTP, User, тощо) залишаються зверху

// 1. ВІДПРАВКА КОДУ НА ПОШТУ
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Введіть email." });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Цей email вже зареєстровано." });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.findOneAndDelete({ email });
    await OTP.create({ email, code });

    await transporter.sendMail({
      from: `"PCWITHBLADVIK" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Код підтвердження реєстрації",
      html: `<div style="font-family: Arial; text-align: center; padding: 20px;">
               <h2>Вітаємо в PCWITHBLADVIK!</h2>
               <p>Ваш код для реєстрації:</p>
               <h1 style="color: #2563eb; letter-spacing: 5px;">${code}</h1>
             </div>`
    });

    res.json({ message: "Код відправлено!" });
  } catch (error) {
    res.status(500).json({ message: "Помилка при відправці листа." });
  }
});

// 2. ПРОМІЖНА ПЕРЕВІРКА КОДУ (Перед вводом пароля)
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, code } = req.body;
    const otpRecord = await OTP.findOne({ email });
    
    if (!otpRecord || otpRecord.code !== code) {
      return res.status(400).json({ message: "Невірний або прострочений код." });
    }
    res.json({ message: "Код підтверджено!" });
  } catch (error) {
    res.status(500).json({ message: "Помилка перевірки коду." });
  }
});

// 3. ФІНАЛЬНА РЕЄСТРАЦІЯ
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, code } = req.body;

    // Перевірка на зайнятий нікнейм
    const existingName = await User.findOne({ name });
    if (existingName) return res.status(400).json({ message: "Цей нікнейм вже зайнятий." });

    // Фінальна перевірка коду
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord || otpRecord.code !== code) {
      return res.status(400).json({ message: "Невірний або прострочений код." });
    }

    const user = await User.create({ name, email, password });
    await OTP.findOneAndDelete({ email });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ _id: user.id, name: user.name, email: user.email, role: user.role, token });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера." });
  }
});

// ... решта роутів (login, me, oauth)
// 3. ІНШІ СТАНДАРТНІ РОУТИ
router.post('/login', login);
router.get('/me', protect, getMe);

// 4. OAUTH РОУТИ
const handleOAuthRedirect = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  // ЗАМІНИ ТУТ (на свій Vercel):
  res.redirect(`https://webkursak-b1l88ueda-bladvik-s-projects.vercel.app/?token=${token}`);
};

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/', session: false }), handleOAuthRedirect);

router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/', session: false }), handleOAuthRedirect);

// router.get('/facebook', passport.authenticate('facebook', { scope: ['email'], session: false }));
// router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/', session: false }), handleOAuthRedirect);

// // Steam
// router.get('/steam', passport.authenticate('steam', { session: false }));
// router.get('/steam/callback', passport.authenticate('steam', { failureRedirect: '/', session: false }), handleOAuthRedirect);
module.exports = router;