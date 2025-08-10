const express = require('express');
const router = express.Router();
const { addVehicle, updateVehicle, deleteVehicle, getVehicle, listVehicles } = require('./vehicle.controller');
const { authMiddleware, adminMiddleware } = require('../../middlewares/auth.middleware');

router.use(authMiddleware, adminMiddleware);

router.post('/', addVehicle);
router.get('/', listVehicles);
router.get('/:vehicleId', getVehicle);
router.put('/:vehicleId', updateVehicle);
router.delete('/:vehicleId', deleteVehicle);

module.exports = router;


