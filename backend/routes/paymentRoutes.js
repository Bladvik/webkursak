// backend/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// 1. Створення сторінки оплати
router.post('/create-checkout-session', protect, async (req, res) => {
  try {
    console.log("🛒 Початок створення платежу. План:", req.body.plan);

    // Перевірка наявності ключа Stripe
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Не знайдено STRIPE_SECRET_KEY у файлі .env!");
    }

    const { plan } = req.body; 
    let price = plan === 'pro' ? 300 : 500; 

    // Безпечне перетворення назви плану
    const planName = plan ? plan.toUpperCase() : 'PRO';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `PCWITHBLADVIK - ${planName} Plan` },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      // ФІКС: Stripe крашиться, якщо передати йому об'єкт MongoDB. 
      // Тому ми примусово перетворюємо ID у текст через String()
      metadata: { 
        userId: String(req.user._id), 
        plan: String(plan) 
      },
      
     success_url: `https://webkursak-b1l88ueda-bladvik-s-projects.vercel.app/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://webkursak-b1l88ueda-bladvik-s-projects.vercel.app/#pricing`,
    });

    console.log("✅ Платіжну сесію створено успішно!");
    res.json({ url: session.url });
  } catch (error) {
    // ТЕПЕР МИ БАЧИМО ТОЧНУ ПРИЧИНУ В ТЕРМІНАЛІ БЕКЕНДУ!
    console.error("🔴 ПОМИЛКА STRIPE:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 2. Підтвердження оплати та зміна ролі
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const userId = session.metadata.userId;
      const newPlan = session.metadata.plan;

      // Оновлюємо роль юзера
      const user = await User.findByIdAndUpdate(userId, { role: newPlan }, { new: true }).select('-password');
      
      res.json({ success: true, user });
    } else {
      res.status(400).json({ success: false, message: 'Оплата не пройшла' });
    }
  } catch (error) {
    console.error("🔴 ПОМИЛКА ПІДТВЕРДЖЕННЯ:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;