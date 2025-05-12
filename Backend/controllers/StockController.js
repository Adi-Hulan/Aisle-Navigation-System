const Stock = require("../models/StockModel");  // This is correct based on your model file
const Product = require ("../models/ProductModel");


//get all product on stock
//get all product on stock
// Get all products in stock
const getAllProducts = async(req, res, next) => {
    try {
        const stock = await Stock.find().populate('product_id');
        
        if (!stock || stock.length === 0) {
            return res.status(404).json({message: 'No products found in stock'});
        }

        res.status(200).json({ 
            success: true,
            Products: stock
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({ 
            message: 'Server error',
            error: err.message 
        });
    }
};



// ***************** DO NOT TOUCH *****************

// ***************** I SAY AGAIN *****************

// ***************** DONT TOUCH *****************

// Add Product to stock - Enhanced version
const addProductToStock = async (req, res) => {
    const { product_id, shelf_id, quantity, min_qty, max_qty } = req.body;

    // Validate incoming data
    if (!product_id || !shelf_id || quantity === undefined) {
        return res.status(400).json({ 
            success: false,
            message: "Missing required fields (product_id, shelf_id, quantity)" 
        });
    }

    try {
        // Check if product exists in Product collection
        const existingProduct = await Product.findById(product_id);
        if (!existingProduct) {
            return res.status(404).json({ 
                success: false,
                message: "Product not found", 
                details: `No product found with ID: ${product_id} `
            });
        }

        // Check if product already exists in Stock
        const existingStock = await Stock.findOne({ product_id });
        if (existingStock) {
            // Update existing stock
            existingStock.quantity += Number(quantity);
            existingStock.shelf_id = shelf_id;
            existingStock.min_qty = min_qty !== undefined ? Number(min_qty) : existingStock.min_qty;
            existingStock.max_qty = max_qty !== undefined ? Number(max_qty) : existingStock.max_qty;
            existingStock.last_update = Date.now();
            
            await existingStock.save();
            return res.status(200).json({ 
                success: true,
                message: "Stock quantity updated successfully", 
                stock: existingStock 
            });
        }

        // Create new stock entry
        const newProductStock = new Stock({
            product_id,
            shelf_id,
            quantity: Number(quantity),
            min_qty: min_qty !== undefined ? Number(min_qty) : 0,
            max_qty: max_qty !== undefined ? Number(max_qty) : 1000,
            last_update: Date.now()
        });

        await newProductStock.save();
        return res.status(201).json({ 
            success: true,
            message: "Product added to stock successfully", 
            stock: newProductStock 
        });

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ 
            success: false,
            message: "Server error", 
            error: err.message 
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
                success: false
            });
        }
        
        return res.status(200).json({
            success: true,
            product
        });
        
    } catch (err) {
        console.error("Error fetching product:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};



//Update stock qty

// Update stock quantity - Improved version
const updateproduct = async (req, res) => {
    const { id } = req.params;
    const { quantity, min_qty, max_qty, shelf_id } = req.body;

    try {
        // Find and update the stock item
        const updatedStock = await Stock.findByIdAndUpdate(
            id,
            { 
                quantity: Number(quantity),
                min_qty: Number(min_qty),
                max_qty: Number(max_qty),
                shelf_id,
                last_update: Date.now()
            },
            { new: true } // Return the updated document
        ).populate('product_id');

        if (!updatedStock) {
            return res.status(404).json({ 
                success: false,
                message: "Stock item not found" 
            });
        }

        return res.status(200).json({ 
            success: true,
            message: "Stock updated successfully",
            product: updatedStock
        });
        
    } catch (err) {
        console.error("Error updating stock:", err);
        return res.status(500).json({ 
            success: false,
            message: "Server error",
            error: err.message 
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
                message: "Product not found in stock" 
            });
        }

        return res.status(200).json({ 
            success: true,
            message: "Product removed from stock successfully",
            product: deletedProduct
        });

    } catch (err) {
        console.error("Error deleting product:", err);
        return res.status(500).json({ 
            success: false,
            message: "Server error",
            error: err.message 
        });
    }
};

module.exports = {
    getAllProducts,
    addProductToStock,
    getById,
    updateproduct,
    deleteproduct
};