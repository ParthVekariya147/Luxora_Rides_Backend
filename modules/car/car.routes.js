const express = require('express');
const router = express.Router();
const {
  createCar,
  getCarById,
  updateCar,
  deleteCar,
  listCars,
  getCarsByBrand,
  getAvailableCars,
  getCarsByPriceRange,
  getCarsBySeatingCapacity,
  updateCarStatus,
  getCarStatistics,
  searchCars,
  bulkUpdateCars,
  getFeaturedCars,
  uploadCarImages,
  getCarRecommendations
} = require('./car.controller');
const { authMiddleware, adminMiddleware } = require('../../middlewares/auth.middleware');

// Public routes (no authentication required)
router.get('/cars/available', getAvailableCars);
router.get('/cars/featured', getFeaturedCars);
router.get('/cars/brand/:brand', getCarsByBrand);
router.get('/cars/seating/:capacity', getCarsBySeatingCapacity);
router.get('/cars/search', searchCars);
router.get('/cars/price-range', getCarsByPriceRange);
router.get('/cars/:carId', getCarById);
router.get('/cars/:carId/recommendations', getCarRecommendations);

// Protected routes (authentication required)
router.use(authMiddleware);

// User routes (authenticated users)
router.get('/cars', listCars);
router.get('/cars/stats/statistics', getCarStatistics);

// Admin routes (admin authentication required)
router.use(adminMiddleware);

router.post('/cars', createCar);
router.put('/cars/:carId', updateCar);
router.delete('/cars/:carId', deleteCar);
router.put('/cars/:carId/status', updateCarStatus);
router.post('/cars/bulk-update', bulkUpdateCars);
router.post('/cars/:carId/upload-images', uploadCarImages);

module.exports = router;