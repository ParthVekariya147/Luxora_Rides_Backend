const carService = require('./car.service');
const { createCarValidation, updateCarValidation } = require('./car.validation');

// Create a new car
const createCar = async (req, res) => {
  try {
    const { error } = createCarValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        message: error.details[0].message 
      });
    }
    
    const car = await carService.createCar(req.body);
    return res.status(201).json({ 
      success: true, 
      message: 'Car created successfully',
      data: car 
    });
  } catch (err) {
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Get car by ID
const getCarById = async (req, res) => {
  try {
    const car = await carService.getCarById(req.params.carId);
    return res.status(200).json({ 
      success: true, 
      data: car 
    });
  } catch (err) {
    return res.status(404).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Update car by ID
const updateCar = async (req, res) => {
  try {
    const { error } = updateCarValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        message: error.details[0].message 
      });
    }
    
    const car = await carService.updateCar(req.params.carId, req.body);
    return res.status(200).json({ 
      success: true, 
      message: 'Car updated successfully',
      data: car 
    });
  } catch (err) {
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Delete car by ID
const deleteCar = async (req, res) => {
  try {
    const result = await carService.deleteCar(req.params.carId);
    return res.status(200).json({ 
      success: true, 
      message: result.message 
    });
  } catch (err) {
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// List all cars with filtering and pagination
const listCars = async (req, res) => {
  try {
    const data = await carService.listCars(req.query);
    return res.status(200).json({ 
      success: true, 
      data 
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Get cars by brand
const getCarsByBrand = async (req, res) => {
  try {
    const cars = await carService.getCarsByBrand(req.params.brand);
    return res.status(200).json({ 
      success: true, 
      data: cars 
    });
  } catch (err) {
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Get available cars
const getAvailableCars = async (req, res) => {
  try {
    const cars = await carService.getAvailableCars();
    return res.status(200).json({ 
      success: true, 
      data: cars 
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Get cars by price range
const getCarsByPriceRange = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;
    if (!minPrice || !maxPrice) {
      return res.status(400).json({ 
        success: false, 
        message: 'Both minPrice and maxPrice are required' 
      });
    }
    
    const cars = await carService.getCarsByPriceRange(
      parseFloat(minPrice), 
      parseFloat(maxPrice)
    );
    return res.status(200).json({ 
      success: true, 
      data: cars 
    });
  } catch (err) {
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Get cars by seating capacity
const getCarsBySeatingCapacity = async (req, res) => {
  try {
    const cars = await carService.getCarsBySeatingCapacity(
      parseInt(req.params.capacity)
    );
    return res.status(200).json({ 
      success: true, 
      data: cars 
    });
  } catch (err) {
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Update car status
const updateCarStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status is required' 
      });
    }
    
    const car = await carService.updateCarStatus(req.params.carId, status);
    return res.status(200).json({ 
      success: true, 
      message: 'Car status updated successfully',
      data: car 
    });
  } catch (err) {
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Get car statistics
const getCarStatistics = async (req, res) => {
  try {
    const stats = await carService.getCarStatistics();
    return res.status(200).json({ 
      success: true, 
      data: stats 
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Search cars with advanced filters
const searchCars = async (req, res) => {
  try {
    const cars = await carService.searchCars(req.query);
    return res.status(200).json({ 
      success: true, 
      data: cars 
    });
  } catch (err) {
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Bulk update cars
const bulkUpdateCars = async (req, res) => {
  try {
    const { carIds, updateData } = req.body;
    if (!carIds || !Array.isArray(carIds) || carIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'carIds array is required' 
      });
    }
    
    const result = await carService.bulkUpdateCars(carIds, updateData);
    return res.status(200).json({ 
      success: true, 
      message: 'Cars updated successfully',
      data: result 
    });
  } catch (err) {
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Get featured cars
const getFeaturedCars = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const cars = await carService.getFeaturedCars(limit);
    return res.status(200).json({ 
      success: true, 
      data: cars 
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Upload car images
const uploadCarImages = async (req, res) => {
  try {
    // This would typically handle file uploads
    // For now, we'll just return a success message
    return res.status(200).json({ 
      success: true, 
      message: 'Images uploaded successfully',
      data: {
        imageUrls: req.files ? req.files.map(file => file.path) : []
      }
    });
  } catch (err) {
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Get car recommendations
const getCarRecommendations = async (req, res) => {
  try {
    const { carId } = req.params;
    const car = await carService.getCarById(carId);
    
    // Get similar cars based on brand, price range, and features
    const recommendations = await carService.searchCars({
      brand: car.brand,
      min_price: car.price_per_day * 0.7,
      max_price: car.price_per_day * 1.3,
      seating_capacity: car.dimensions.seating_capacity
    });
    
    // Filter out the current car and limit results
    const filteredRecommendations = recommendations
      .filter(rec => rec._id.toString() !== carId)
      .slice(0, 5);
    
    return res.status(200).json({ 
      success: true, 
      data: filteredRecommendations 
    });
  } catch (err) {
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

module.exports = {
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
};
