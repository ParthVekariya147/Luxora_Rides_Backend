const express = require('express');
const router = express.Router();
const { addDriver, updateDriver, deleteDriver, getDriver, listDrivers, getDriverStats } = require('./driver.controller');
const { authMiddleware, adminMiddleware } = require('../../middlewares/auth.middleware');

router.use(authMiddleware, adminMiddleware);

router.post('/', addDriver);
router.get('/', listDrivers);
router.get('/stats', getDriverStats);
router.get('/:driverId', getDriver);
router.put('/:driverId', updateDriver);
router.delete('/:driverId', deleteDriver);

module.exports = router;


