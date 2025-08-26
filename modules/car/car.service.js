const Car = require("./car.model");

// Create a new car
const createCar = async (carData) => {
  try {
    const car = new Car(carData);
    const savedCar = await car.save();
    return savedCar;
  } catch (error) {
    throw new Error(`Failed to create car: ${error.message}`);
  }
};

// Get car by ID
const getCarById = async (carId) => {
  try {
    const car = await Car.findById(carId);
    if (!car) {
      throw new Error("Car not found");
    }
    return car;
  } catch (error) {
    throw new Error(`Failed to get car: ${error.message}`);
  }
};

// Update car by ID
const updateCar = async (carId, updateData) => {
  try {
    const car = await Car.findByIdAndUpdate(carId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!car) {
      throw new Error("Car not found");
    }
    return car;
  } catch (error) {
    throw new Error(`Failed to update car: ${error.message}`);
  }
};

// Delete car by ID
const deleteCar = async (carId) => {
  try {
    const car = await Car.findByIdAndDelete(carId);
    if (!car) {
      throw new Error("Car not found");
    }
    return { message: "Car deleted successfully" };
  } catch (error) {
    throw new Error(`Failed to delete car: ${error.message}`);
  }
};

// List all cars with filtering and pagination
const listCars = async (query = {}) => {
  try {
    const {
      page = 1,
      limit = 50,
      brand,
      year_model,
      min_price,
      max_price,
      fuel_type,
      seating_capacity,
      status,
      sort_by = "createdAt",
      sort_order = "desc",
      search,
    } = query;
    const filter = {};
    if (brand) filter.brand = { $regex: brand, $options: "i" };
    if (year_model) filter.year_model = year_model;
    if (min_price || max_price) {
      filter.price_per_day = {};
      if (min_price) filter.price_per_day.$gte = parseFloat(min_price);
      if (max_price) filter.price_per_day.$lte = parseFloat(max_price);
    }
    if (fuel_type) filter.fuel_type = fuel_type; // <-- અહીં ફેરફાર કર્યો છે
    if (seating_capacity) filter.seating_capacity = parseInt(seating_capacity); // <-- અહીં ફેરફાર કર્યો છે
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { car_name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const sort = { [sort_by]: sort_order === "desc" ? -1 : 1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const cars = await Car.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    const total = await Car.countDocuments(filter);
    return {
      cars,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / parseInt(limit)),
        total_items: total,
        items_per_page: parseInt(limit),
      },
    };
  } catch (error) {
    throw new Error(`Failed to list cars: ${error.message}`);
  }
};

// Get cars by brand
const getCarsByBrand = async (brand) => {
  try {
    return await Car.find({
      brand: { $regex: brand, $options: "i" },
      status: "available",
    }).sort({ price_per_day: 1 });
  } catch (error) {
    throw new Error(`Failed to get cars by brand: ${error.message}`);
  }
};

// Get available cars
const getAvailableCars = async () => {
  try {
    return await Car.find({ status: "available" }).sort({ price_per_day: 1 });
  } catch (error) {
    throw new Error(`Failed to get available cars: ${error.message}`);
  }
};

// Get cars by price range
const getCarsByPriceRange = async (minPrice, maxPrice) => {
  try {
    return await Car.find({
      price_per_day: { $gte: minPrice, $lte: maxPrice },
      status: "available",
    }).sort({ price_per_day: 1 });
  } catch (error) {
    throw new Error(`Failed to get cars by price range: ${error.message}`);
  }
};

// Get cars by seating capacity
const getCarsBySeatingCapacity = async (capacity) => {
  try {
    return await Car.find({
      seating_capacity: capacity,
      status: "available",
    }).sort({ price_per_day: 1 }); // <-- અહીં ફેરફાર કર્યો છે
  } catch (error) {
    throw new Error(`Failed to get cars by seating capacity: ${error.message}`);
  }
};

// Update car status
const updateCarStatus = async (carId, status) => {
  try {
    const car = await Car.findByIdAndUpdate(
      carId,
      { status },
      { new: true, runValidators: true }
    );
    if (!car) {
      throw new Error("Car not found");
    }
    return car;
  } catch (error) {
    throw new Error(`Failed to update car status: ${error.message}`);
  }
};

// Get car statistics
const getCarStatistics = async () => {
  try {
    const stats = await Car.aggregate([
      {
        $group: {
          _id: null,
          total_cars: { $sum: 1 },
          available_cars: {
            $sum: { $cond: [{ $eq: ["$status", "available"] }, 1, 0] },
          },
          rented_cars: {
            $sum: { $cond: [{ $eq: ["$status", "rented"] }, 1, 0] },
          },
          maintenance_cars: {
            $sum: { $cond: [{ $eq: ["$status", "maintenance"] }, 1, 0] },
          },
          average_price: { $avg: "$price_per_day" },
          min_price: { $min: "$price_per_day" },
          max_price: { $max: "$price_per_day" },
        },
      },
    ]);
    const brandStats = await Car.aggregate([
      {
        $group: {
          _id: "$brand",
          count: { $sum: 1 },
          average_price: { $avg: "$price_per_day" },
        },
      },
      { $sort: { count: -1 } },
    ]);
    return { overall: stats[0] || {}, by_brand: brandStats };
  } catch (error) {
    throw new Error(`Failed to get car statistics: ${error.message}`);
  }
};

// Search cars with advanced filters
const searchCars = async (searchParams) => {
  try {
    const {
      query,
      brand,
      min_price,
      max_price,
      fuel_type,
      seating_capacity,
      features,
      sort_by = "price_per_day",
      sort_order = "asc",
    } = searchParams;
    const filter = { status: "available" };
    if (query) {
      filter.$or = [
        { car_name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }
    if (brand) filter.brand = { $regex: brand, $options: "i" };
    if (min_price || max_price) {
      filter.price_per_day = {};
      if (min_price) filter.price_per_day.$gte = parseFloat(min_price);
      if (max_price) filter.price_per_day.$lte = parseFloat(max_price);
    }
    if (fuel_type) filter.fuel_type = fuel_type; // <-- અહીં ફેરફાર કર્યો છે
    if (seating_capacity) filter.seating_capacity = parseInt(seating_capacity); // <-- અહીં ફેરફાર કર્યો છે
    if (features) {
      const featureArray = Array.isArray(features)
        ? features
        : features.split(",");
      filter.features = { $all: featureArray }; // <-- અહીં ફેરફાર કર્યો છે
    }
    const sort = { [sort_by]: sort_order === "desc" ? -1 : 1 };
    return await Car.find(filter).sort(sort);
  } catch (error) {
    throw new Error(`Failed to search cars: ${error.message}`);
  }
};

// Bulk update cars
const bulkUpdateCars = async (carIds, updateData) => {
  try {
    return await Car.updateMany({ _id: { $in: carIds } }, updateData, {
      runValidators: true,
    });
  } catch (error) {
    throw new Error(`Failed to bulk update cars: ${error.message}`);
  }
};

// Get featured cars (high-rated or premium)
const getFeaturedCars = async (limit = 6) => {
  try {
    // 'ratings' કાઢી નાખ્યું છે કારણ કે તે નવા મોડેલમાં નથી.
    return await Car.find({
      status: "available",
      price_per_day: { $gte: 5000 },
    })
      .sort({ price_per_day: -1 }) // ફક્ત કિંમત પ્રમાણે સોર્ટ કર્યું છે
      .limit(limit);
  } catch (error) {
    throw new Error(`Failed to get featured cars: ${error.message}`);
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
};
