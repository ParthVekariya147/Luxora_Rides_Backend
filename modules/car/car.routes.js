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
router.get('/', listCars); // List all cars (public access)
router.get('/available', getAvailableCars);
router.get('/featured', getFeaturedCars);
router.get('/brand/:brand', getCarsByBrand);
router.get('/seating/:capacity', getCarsBySeatingCapacity);
router.get('/search', searchCars);
router.get('/price-range', getCarsByPriceRange);
router.get('/:carId', getCarById);
router.get('/:carId/recommendations', getCarRecommendations);

// Protected routes (authentication required)
router.use(authMiddleware);

// User routes (authenticated users)
router.get('/stats/statistics', getCarStatistics);

// Admin routes (admin authentication required)
router.use(adminMiddleware);

router.post('/', createCar);
router.put('/:carId', updateCar);
router.delete('/:carId', deleteCar);
router.put('/:carId/status', updateCarStatus);
router.post('/bulk-update', bulkUpdateCars);
router.post('/:carId/upload-images', uploadCarImages);

module.exports = router;