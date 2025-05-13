const Stock = require("../models/StockModel"); // This is correct based on your model file
const Product = require("../models/ProductModel");
const StockRequest = require("../models/StockRequestModel"); // You'll need to create this model

//get all product on stock
//get all product on stock
// Get all products in stock
const getAllProducts = async (req, res, next) => {
  try {
    const stock = await Stock.find().populate("product_id");

    if (!stock || stock.length === 0) {
      return res.status(404).json({ message: "No products found in stock" });
    }

    res.status(200).json({
      success: true,
      Products: stock,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// ***************** DO NOT TOUCH *****************

// ***************** I SAY AGAIN *****************

// ***************** DONT TOUCH *****************

// Add Product to stock - Enhanced version
const addProductToStock = async (req, res) => {
  const { product_id, quantity, min_qty, max_qty, location } = req.body;

  // Validate incoming data
  if (
    !product_id ||
    !location ||
    quantity === undefined ||
    !location.aisle_number ||
    !location.shelf_number ||
    !location.row_number
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields (product_id, location details, quantity)",
    });
  }

  try {
    // Check if product exists in Product collection
    const existingProduct = await Product.findById(product_id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        details: `No product found with ID: ${product_id} `,
      });
    }

    // Check if product already exists in Stock
    const existingStock = await Stock.findOne({ product_id });
    if (existingStock) {
      // Update existing stock
      existingStock.quantity += Number(quantity);
      existingStock.location = location;
      existingStock.min_qty =
        min_qty !== undefined ? Number(min_qty) : existingStock.min_qty;
      existingStock.max_qty =
        max_qty !== undefined ? Number(max_qty) : existingStock.max_qty;
      existingStock.last_update = Date.now();

      await existingStock.save();
      return res.status(200).json({
        success: true,
        message: "Stock quantity updated successfully",
        stock: existingStock,
      });
    }

    // Create new stock entry
    const newProductStock = new Stock({
      product_id,
      location,
      quantity: Number(quantity),
      min_qty: min_qty !== undefined ? Number(min_qty) : 0,
      max_qty: max_qty !== undefined ? Number(max_qty) : 1000,
      last_update: Date.now(),
    });

    await newProductStock.save();
    return res.status(201).json({
      success: true,
      message: "Product added to stock successfully",
      stock: newProductStock,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

//Get by Id

const getById = async (req, res) => {
  try {
    const product = await Stock.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    console.error("Error fetching product:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

//Update stock qty

// Update stock quantity - Improved version
const updateproduct = async (req, res) => {
  const { id } = req.params;
  const { quantity, min_qty, max_qty, location } = req.body;

  try {
    // Find and update the stock item
    const updatedStock = await Stock.findByIdAndUpdate(
      id,
      {
        quantity: Number(quantity),
        min_qty: Number(min_qty),
        max_qty: Number(max_qty),
        location,
        last_update: Date.now(),
      },
      { new: true } // Return the updated document
    ).populate("product_id");

    if (!updatedStock) {
      return res.status(404).json({
        success: false,
        message: "Stock item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      product: updatedStock,
    });
  } catch (err) {
    console.error("Error updating stock:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Delete product from stock - Improved version
const deleteproduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Stock.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found in stock",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product removed from stock successfully",
      product: deletedProduct,
    });
  } catch (err) {
    console.error("Error deleting product:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Create a new stock request
const createStockRequest = async (req, res) => {
  console.log('Received request body:', req.body);
  
  const { product_id, quantity, requested_date } = req.body;

  // Validate incoming data
  if (!product_id || !quantity || !requested_date) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields (product_id, quantity, requested_date)",
    });
  }

  try {
    // Check if product exists
    const existingProduct = await Product.findById(product_id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        details: `No product found with ID: ${product_id}`,
      });
    }

    // Create new stock request
    const newStockRequest = new StockRequest({
      product_id,
      quantity: Number(quantity),
      requested_date: new Date(requested_date),
      status: 'pending',
      created_at: Date.now(),
      updated_at: Date.now()
    });

    console.log('Attempting to save request:', newStockRequest);

    try {
      const savedRequest = await newStockRequest.save();
      console.log('Successfully saved request:', savedRequest);

      // Populate the product details before sending response
      const populatedRequest = await StockRequest.findById(savedRequest._id)
        .populate('product_id');

      return res.status(201).json({
        success: true,
        message: "Stock request created successfully",
        request: populatedRequest,
      });
    } catch (saveError) {
      console.error('Error saving request:', saveError);
      return res.status(500).json({
        success: false,
        message: "Error saving stock request",
        error: saveError.message,
      });
    }
  } catch (err) {
    console.error("Error in createStockRequest:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// Get all stock requests
const getAllStockRequests = async (req, res) => {
  try {
    const requests = await StockRequest.find()
      .populate("product_id")
      .sort({ created_at: -1 });

    if (!requests || requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No stock requests found",
      });
    }

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (err) {
    console.error("Error fetching stock requests:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Update stock request status
const updateStockRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['pending', 'approved', 'rejected', 'completed'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status. Must be one of: pending, approved, rejected, completed",
    });
  }

  try {
    const updatedRequest = await StockRequest.findByIdAndUpdate(
      id,
      {
        status,
        updated_at: Date.now(),
      },
      { new: true }
    ).populate("product_id");

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "Stock request not found",
      });
    }

    // If request is approved, update the stock quantity
    if (status === 'approved') {
      const stock = await Stock.findOne({ product_id: updatedRequest.product_id._id });
      if (stock) {
        stock.quantity += updatedRequest.quantity;
        stock.last_update = Date.now();
        await stock.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Stock request status updated successfully",
      request: updatedRequest,
    });
  } catch (err) {
    console.error("Error updating stock request:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = {
  getAllProducts,
  addProductToStock,
  getById,
  updateproduct,
  deleteproduct,
  createStockRequest,
  getAllStockRequests,
  updateStockRequestStatus,
};
