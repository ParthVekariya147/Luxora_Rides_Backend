    const express = require('express');
const router = express.Router();
const carController = require('./car.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');

// Public routes (no authentication required)
router.get('/cars', carController.listCars);
router.get('/cars/available', carController.getAvailableCars);
router.get('/cars/featured', carController.getFeaturedCars);
router.get('/cars/search', carController.searchCars);
router.get('/cars/price-range', carController.getCarsByPriceRange);
router.get('/cars/brand/:brand', carController.getCarsByBrand);
router.get('/cars/seating/:capacity', carController.getCarsBySeatingCapacity);
router.get('/cars/:carId', carController.getCarById);
router.get('/cars/:carId/recommendations', carController.getCarRecommendations);

// Protected routes (authentication required)
router.use(authMiddleware);

// Admin/Manager routes
router.post('/cars', carController.createCar);
router.put('/cars/:carId', carController.updateCar);
router.delete('/cars/:carId', carController.deleteCar);
router.patch('/cars/:carId/status', carController.updateCarStatus);
router.post('/cars/bulk-update', carController.bulkUpdateCars);
router.post('/cars/:carId/images', carController.uploadCarImages);
router.get('/cars/stats/statistics', carController.getCarStatistics);

module.exports = router;
