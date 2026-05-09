// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // ВАЖЛИВО: використовуємо bcryptjs (без фігурних дужок)

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true, // Гарантія унікальності нікнейму
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      required: function () {
        // Пароль обов'язковий тільки якщо це звичайна реєстрація (не через Google/GitHub)
        return !this.googleId && !this.githubId;
      },
    },
    googleId: {
      type: String,
      default: null,
    },
    githubId: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'pro', 'elite', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true, // Автоматично додає createdAt та updatedAt
  }
);

// Хук, який спрацьовує ПЕРЕД збереженням користувача в базу (для хешування пароля)
// Хук, який спрацьовує ПЕРЕД збереженням користувача в базу
userSchema.pre('save', async function () {
  // Якщо пароль не змінювався або його взагалі немає (вхід через OAuth) — просто виходимо
  if (!this.isModified('password') || !this.password) {
    return; 
  }

  // Створюємо "сіль" і хешуємо пароль
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Метод для порівняння паролів (використовується при логіні)
userSchema.methods.comparePassword = async function (enteredPassword) {
  // Якщо юзер зареєструвався через Google/GitHub, у нього немає пароля в базі
  if (!this.password) {
    return false;
  }
  // Порівнюємо введений пароль із захешованим у базі
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);