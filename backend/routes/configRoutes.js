// backend/routes/configRoutes.js
const express = require('express');
const router = express.Router();
const { saveConfig, getUserConfigs, deleteConfig,updateConfig } = require('../controllers/configController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, saveConfig)
  .get(protect, getUserConfigs);

router.route('/:id')
  .delete(protect, deleteConfig)
  .put(protect, updateConfig); 

module.exports = router;