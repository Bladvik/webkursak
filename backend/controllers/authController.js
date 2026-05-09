// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Заповніть усі поля' });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Цей Email вже зареєстровано' });
    }

    const nameExists = await User.findOne({ name });
    if (nameExists) {
      return res.status(400).json({ message: 'Цей нікнейм вже зайнятий іншим користувачем' });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

// @desc    Login user (Email or Nickname)
const login = async (req, res) => {
  try {
    const { email, password } = req.body; 

    // Шукаємо користувача АБО по email, АБО по name
    const user = await User.findOne({
      $or: [
        { email: email },
        { name: email }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: "Користувача не знайдено." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Невірний пароль." });
    }

    const token = generateToken(user._id);

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка сервера." });
  }
};

// @desc    Get user data
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера." });
  }
};

// Експортуємо всі функції правильним способом
module.exports = { register, login, getMe };