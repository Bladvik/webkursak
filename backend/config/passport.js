// backend/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

// Тимчасово вимикаємо Facebook та Steam, поки немає ключів
// const FacebookStrategy = require('passport-facebook').Strategy;
// const SteamStrategy = require('passport-steam').Strategy;

const User = require('../models/User');

// --- ДОПОМІЖНА ФУНКЦІЯ ДЛЯ ГЕНЕРАЦІЇ НІКНЕЙМУ ---
const generateUniqueName = async (baseName) => {
  let uniqueName = baseName.replace(/\s+/g, '').toLowerCase();
  let userExists = await User.findOne({ name: uniqueName });
  let counter = 1;
  while (userExists) {
    uniqueName = `${baseName.replace(/\s+/g, '').toLowerCase()}${counter}`;
    userExists = await User.findOne({ name: uniqueName });
    counter++;
  }
  return uniqueName;
};

// --- GOOGLE СТРАТЕГІЯ ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
        return done(null, user);
      }

      const uniqueName = await generateUniqueName(profile.displayName || 'GoogleUser');
      user = await User.create({
        name: uniqueName,
        email: profile.emails[0].value,
        googleId: profile.id,
      });
      done(null, user);
    } catch (err) {
      console.error("Помилка Google:", err);
      done(err, null);
    }
  }
));

// --- GITHUB СТРАТЕГІЯ ---
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/github/callback",
    scope: ['user:email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      if (!email) {
        return done(new Error("GitHub не надав публічний email"), null);
      }

      let user = await User.findOne({ email: email });
      if (user) {
        if (!user.githubId) {
          user.githubId = profile.id;
          await user.save();
        }
        return done(null, user);
      }

      const uniqueName = await generateUniqueName(profile.displayName || profile.username || 'GitUser');
      user = await User.create({
        name: uniqueName,
        email: email,
        githubId: profile.id,
      });
      done(null, user);
    } catch (err) {
      console.error("Помилка GitHub:", err);
      done(err, null);
    }
  }
));

/* ТИМЧАСОВО ЗАКОМЕНТОВАНО
passport.use(new FacebookStrategy({ ... }));
passport.use(new SteamStrategy({ ... }));
*/

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});