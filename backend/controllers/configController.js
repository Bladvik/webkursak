// backend/controllers/configController.js
const Configuration = require('../models/Configuration');

// @desc    Save a new 3D PC Configuration
// @route   POST /api/configs
// @access  Private
// Створення нової конфігурації
const saveConfig = async (req, res) => {
  try {
    // 1. ДІСТАЄМО ВСІ ПОЛЯ З ФРОНТЕНДУ, ВКЛЮЧАЮЧИ НОВІ КОЛЬОРИ
    const { 
      name, selectedParts, partColors, stats, thumbnailUrl,
      rgbEnabled, rgbSync, baseSync, globalRgbColor, globalBaseColor 
    } = req.body;

    // 2. ПЕРЕДАЄМО ЇХ У БАЗУ ДАНИХ
    const newConfig = await Configuration.create({
      user: req.user._id, // або req.user.id (залежить від твого мідлвару)
      name,
      selectedParts,
      partColors,
      stats,
      thumbnailUrl,
      rgbEnabled,
      rgbSync,
      baseSync,
      globalRgbColor,
      globalBaseColor
    });

    res.status(201).json(newConfig);
  } catch (error) {
    console.error("Error saving config:", error);
    res.status(500).json({ message: 'Server Error while saving configuration' });
  }
};

// @desc    Get all configurations for the logged-in user
// @route   GET /api/configs
// @access  Private
const getUserConfigs = async (req, res) => {
  try {
    const configs = await Configuration.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(configs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch configurations', error: error.message });
  }
};

// @desc    Delete a configuration
// @route   DELETE /api/configs/:id
// @access  Private
const deleteConfig = async (req, res) => {
  try {
    const config = await Configuration.findById(req.params.id);

    if (!config) {
      return res.status(404).json({ message: 'Configuration not found' });
    }

    // Ensure the logged-in user owns this configuration
    if (config.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this configuration' });
    }

    await config.deleteOne();
    res.status(200).json({ message: 'Configuration removed successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete configuration', error: error.message });
  }
};

// @desc    Update an existing configuration
// @route   PUT /api/configs/:id
// @access  Private
// Оновлення існуючої конфігурації
const updateConfig = async (req, res) => {
  try {
    // 1. ДІСТАЄМО ВСІ ПОЛЯ
    const { 
      name, selectedParts, partColors, stats, thumbnailUrl,
      rgbEnabled, rgbSync, baseSync, globalRgbColor, globalBaseColor 
    } = req.body;

    let config = await Configuration.findById(req.params.id);

    if (!config) {
      return res.status(404).json({ message: 'Configuration not found' });
    }

    // Перевірка чи належить збірка юзеру
    if (config.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this configuration' });
    }

    // 2. ОНОВЛЮЄМО ВСІ ПОЛЯ В БАЗІ
    config.name = name || config.name;
    config.selectedParts = selectedParts || config.selectedParts;
    config.partColors = partColors || config.partColors;
    config.stats = stats || config.stats;
    config.thumbnailUrl = thumbnailUrl || config.thumbnailUrl;
    
    // Оновлюємо нові поля для підсвітки (перевіряємо на undefined, бо false - це теж валідне значення)
    if (rgbEnabled !== undefined) config.rgbEnabled = rgbEnabled;
    if (rgbSync !== undefined) config.rgbSync = rgbSync;
    if (baseSync !== undefined) config.baseSync = baseSync;
    if (globalRgbColor) config.globalRgbColor = globalRgbColor;
    if (globalBaseColor) config.globalBaseColor = globalBaseColor;

    const updatedConfig = await config.save();
    res.status(200).json(updatedConfig);
  } catch (error) {
    console.error("Error updating config:", error);
    res.status(500).json({ message: 'Server Error while updating configuration' });
  }
};

module.exports = { saveConfig, getUserConfigs, deleteConfig, updateConfig };