#  PCWITHBLADVIK - 3D PC Builder & Hardware Configurator

![Project Status](https://img.shields.io/badge/Status-Beta_V1.0-blue.svg)
![React](https://img.shields.io/badge/Frontend-React_18-61DAFB.svg)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933.svg)
![Three.js](https://img.shields.io/badge/3D-Three.js-black.svg)
![Stripe](https://img.shields.io/badge/Payments-Stripe-6772E5.svg)

**PCWITHBLADVIK** is an advanced, interactive web application that allows users to build, customize, and analyze custom PCs in real-time 3D. It acts as an intelligent hardware assistant, preventing bottleneck issues and ensuring component compatibility.

##  Key Features

- ** Real-Time 3D Visualization:** Assemble your PC visually. Components snap into place inside a fully rendered 3D chassis using React Three Fiber.
- ** Smart Compatibility Engine:** Automatically checks for Socket mismatches, RAM types, PSU wattage limits, and physical GPU clearance.
- ** Telemetry & Benchmarks:** Calculates estimated total wattage, thermal output, and simulates 1440p gaming FPS (CS2, Cyberpunk 2077, Warzone) based on CPU+GPU combos.
- ** Aura Studio (RGB Control):** Deep customization of components. Change base colors and sync RGB lighting globally or individually per component.
- ** SaaS Subscription Model:** Integrated **Stripe** payments with automated role updating (`user`, `pro`, `elite`) to unlock premium features like unlimited saves and Aura Studio.
- ** Multi-language Support:** Fully translated into 7 languages (EN, UK, IT, PL, ES, FR, DE).
- ** Secure Authentication:** JWT-based user authentication and encrypted passwords.

##  Tech Stack

**Frontend:**
- React (Vite)
- Zustand (Global State Management)
- Tailwind CSS (Styling)
- Framer Motion (Animations)
- Three.js & @react-three/fiber / @react-three/drei (3D Rendering)
- Lucide React (Icons)

**Backend:**
- Node.js & Express
- MongoDB & Mongoose (Database)
- JSON Web Tokens (JWT) & bcryptjs (Auth)
- Stripe API (Payment Processing)

##  Getting Started

Follow these instructions to run the project locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URL)
- [Stripe Account](https://stripe.com/) (For test API keys)

### Installation

**1. Clone the repository:**
```bash
git clone [https://github.com/yourusername/pcwithbladvik.git](https://github.com/yourusername/pcwithbladvik.git)
cd pcwithbladvik
2. Setup the Backend:

cd backend
npm install
Create a .env file in the backend directory and add the following variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
STRIPE_SECRET_KEY=sk_test_your_stripe_key
Start the backend server:

npm run dev
3. Setup the Frontend:
Open a new terminal window/tab:

cd frontend
npm install
Start the frontend development server:

npm run dev
4. Access the Application:
Open your browser and navigate to http://localhost:5173.

🧑‍💻 Author
Developed by Maksym Pasternak.