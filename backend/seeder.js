// backend/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Part = require('./models/Part');

// Явно вказуємо, де шукати змінні середовища
dotenv.config({ path: __dirname + '/.env' });

const partsData = [
  {
    "id": "cpu-1", "name": "AMD Ryzen 5 7600", "brand": "AMD", "type": "CPU", "price": 229,
    "performanceScore": 65, "powerDraw": 65,
    "compatibility": { "socket": "AM5", "ramType": "DDR5" },
    "transform": { "position": [0.05, 2.25, -0.7], "rotation": [1.57, -1.55, 0], "scale": [0.015, 0.015, 0.015] }
  },
  {
    "id": "cpu-2", "name": "Intel Core i9-14900K", "brand": "Intel", "type": "CPU", "price": 589,
    "performanceScore": 98, "powerDraw": 253,
    "compatibility": { "socket": "LGA1700", "ramType": "DDR5" },
    "transform": { "position": [0.05, 2.25, -0.7], "rotation": [1.57, -1.55, 0], "scale": [0.015, 0.015, 0.015] }
  },
  {
    "id": "mb-1", "name": "ASUS ROG Strix B650-A", "brand": "ASUS", "type": "Motherboard", "price": 219,
    "performanceScore": 75, "powerDraw": 30,
    "compatibility": { "socket": "AM5", "formFactor": "ATX", "ramType": "DDR5" },
    "transform": { "position": [-0.2, 1.6, 2.0], "rotation": [0, 0, 0], "scale": [0.35, 0.35, 0.35] }
  },
  {
    "id": "mb-2", "name": "MSI PRO B760M-P", "brand": "MSI", "type": "Motherboard", "price": 119,
    "performanceScore": 55, "powerDraw": 25,
    "compatibility": { "socket": "LGA1700", "formFactor": "mATX", "ramType": "DDR5" },
    "transform": { "position": [-0.2, 1.6, 2.0], "rotation": [0, 0, 0], "scale": [0.35, 0.35, 0.35] }
  },
  {
    "id": "gpu-1", "name": "NVIDIA RTX 4090 FE", "brand": "NVIDIA", "type": "GPU", "price": 1599,
    "performanceScore": 100, "powerDraw": 450,
    "compatibility": { "lengthMm": 304 },
    "transform": { "position": [0.2, 1.3, -1.6], "rotation": [-1.57, 3.14, 0], "scale": [0.6, 0.6, 0.6] }
  },
  {
    "id": "gpu-2", "name": "AMD Radeon RX 7600", "brand": "AMD", "type": "GPU", "price": 269,
    "performanceScore": 50, "powerDraw": 165,
    "compatibility": { "lengthMm": 240 },
    "transform": { "position": [0.2, 1.3, -1.6], "rotation": [-1.57, 3.14, 0], "scale": [0.45, 0.45, 0.45] }
  },
  {
    "id": "case-1", "name": "NZXT H9 Flow", "brand": "NZXT", "type": "Case", "price": 159,
    "performanceScore": 90, "powerDraw": 0,
    "compatibility": { "formFactor": "ATX", "maxGpuLengthMm": 435 },
    "transform": { "position": [0, 0, 0], "rotation": [0, 0, 0], "scale": [1, 1, 1] }
  },
  {
    "id": "case-2", "name": "Cooler Master MasterBox Q300L", "brand": "CoolerMaster", "type": "Case", "price": 45,
    "performanceScore": 40, "powerDraw": 0,
    "compatibility": { "formFactor": "mATX", "maxGpuLengthMm": 360 },
    "transform": { "position": [0, 0, 0], "rotation": [0, 0, 0], "scale": [0.8, 0.8, 0.8] }
  },
  {
    "id": "psu-1", "name": "Corsair RM1000x", "brand": "Corsair", "type": "PSU", "price": 189,
    "performanceScore": 95, "powerDraw": 0,
    "compatibility": { "wattage": 1000 },
    "transform": { "position": [-0.5, -0.8, -0.1], "rotation": [0, 26.7, 0], "scale": [0.1, 0.1, 0.1] }
  },
  {
    "id": "psu-2", "name": "Thermaltake Smart 500W", "brand": "Thermaltake", "type": "PSU", "price": 39,
    "performanceScore": 40, "powerDraw": 0,
    "compatibility": { "wattage": 500 },
    "transform": { "position": [-0.5, -0.8, -0.1], "rotation": [0, 26.7, 0], "scale": [0.1, 0.1, 0.1] }
  }
];

const importData = async () => {
  try {
    console.log('⏳ Connecting to Database...');
    // Чекаємо на підключення ПЕРЕД тим, як іти далі
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected!');

    await Part.deleteMany();
    console.log('🗑️ Old parts deleted.');

    await Part.insertMany(partsData);
    console.log('🚀 New parts successfully seeded!');
    
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

importData();