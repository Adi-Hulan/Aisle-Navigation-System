/***
 * @Developed By: Udayanga
 * @Developed On: 22th March 2025
 */

const InventoryActivityLogModel = require('../models/InventoryActivityLogModel');
const Inventory = require('../models/InventoryModel');
const Product = require('../models/ProductModel');

//get all inventory
const getAllInventory = async(req, res, next) => {
    let inventory;

    //get inventories
    try {
        inventory = await Inventory.find();
    } catch(err) {
        console.log(err);
    }

    //if inventory not found
    if(!inventory) {
        return res.status(404).json({message: 'Inventory not found'});
    }

    //display all inventory
    res.status(200).json({inventory});
};

//count inventory
const getInventoryCount = async(req, res, next) => {
    let count;

    //get count
    try {
        count = await Inventory.countDocuments();
        
    } catch(err) {
        console.log(err);
    }

    //display count
    res.status(200).json({count: count});
};

//Count low stock products in inventory
const getLowStockCount = async(req, res, next) => {
    let lowStockCount;

    //get low stock count
    try {
        lowStockCount = await Inventory.countDocuments({
            $expr: {$lt: ["$current_stock", "$min_quan"]}
        });
    } catch(err) {
        console.log(err);
    }

    //display low stock count
    res.status(200).json({lowStockCount: lowStockCount});
};

// Count expiring products in inventory
const getExpiringCount = async (req, res, next) => {
    let expiringCount;

    try {
        const today = new Date();
        const expiringIn = new Date();
        expiringIn.setDate(today.getDate() + 7);    // Set checking expiring time in 7 days

        expiringCount = await Inventory.aggregate([
            {
                $lookup: {
                    from: "products",           // Name of the product collection
                    localField: "product_id",   // Field in the inventory collection
                    foreignField: "_id",        // Field in the product collection
                    as: "product"               // Joined data saved here
                }
            },
            { $unwind: "$product" },            // Flatten the joined product data
            {
                $match: {
                    "product.exp_date": {
                        $gte: today,            // Expiry date is greater than or equal to today
                        $lte: expiringIn        // Expiry date is less than or equal to expiringIn (7 days from today)
                    }
                }
            },
            { $count: "expiringItems" }         // Count the expiring items
        ]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
    }

    // display expiring item count
    res.status(200).json({ expiringCount: expiringCount[0]?.expiringItems || 0 });
};

// Get expired item count
const getExpiredCount = async (req, res, next) => {
    try {
        const today = new Date();

        const expiredCount = await Inventory.aggregate([
            {
                $lookup: {
                    from: "products",           // Name of the product collection
                    localField: "product_id",   // Field in the inventory collection
                    foreignField: "_id",        // Field in the product collection
                    as: "product"               // Joined data saved here
                }
            },
            { $unwind: "$product" },            // Flatten the joined product data
            {
                $match: {
                    "product.exp_date": {
                        $lt: today,             // Expiry date is less than today (already expired)
                    }
                }
            },
            { $count: "expiredItems" }          // Count the expired items
        ]);

        // Send the response with the correct field name
        res.status(200).json({ expiredCount: expiredCount[0]?.expiredItems || 0 });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get recent Activity Logs
const getRecentActivity = async(req, res, next) => {
    let activityLog;

    try {
        activityLog = await InventoryActivityLogModel.find().populate('product_id', 'message').sort({timestamp: -1}).limit(5);
    } catch(err) {
        console.log(err);
    }

    //if activity log not found
    if(!activityLog) {
        return res.status(404).json({message: 'Activity log not found'});
    }

    //display recent activity log
    res.status(200).json({activityLog});
}

//add products to inventory
const addProductsToInventory = async (req, res, next) => {
    const { product_id, current_stock, min_quan, max_quan, last_updated, cat_id } = req.body;

    if (!product_id || current_stock === undefined) {
        return res.status(400).json({ message: "Missing required fields (product_id, current_stock)" });
    }

    try {
        // Check if the product exists and populate category
        const existingProduct = await Product.findById(product_id).populate('cat_id');
        if (!existingProduct) {
            return res.status(404).json({ 
                message: "Product not found", 
                details: `No product found with ID: ${product_id}` 
            });
        }

        // Debug: Log the populated product to check cat_id
        console.log("Populated Product:", existingProduct);

        // Extract product name from the populated product
        const product_name = existingProduct ? existingProduct.pr_name : null;

        // Extract category name from the populated product
        const cat_name = existingProduct.cat_id ? existingProduct.cat_id.cat_name : null;
        
        console.log("Category Name:", cat_name);

        //Create new inventory entry
        const newProductInventory = new Inventory({
            product_id,
            product_name: product_name,
            current_stock: Number(current_stock),
            min_quan: Number(min_quan) || 0,
            max_quan: Number(max_quan) || 1000,
            last_updated: last_updated || Date.now(),
            cat_id: cat_id,
            cat_name: cat_name
        });

        await newProductInventory.save();

        //Log activity
        const activityLog = new InventoryActivityLogModel({
            product_id: newProductInventory._id,
            message: `New product ${existingProduct.pr_name} (ID: ${newProductInventory.product_id}) added to inventory`,
            type: 'PRODUCT_ADDED_TO_INVENTORY'
        });
        
        await activityLog.save();
        
        return res.status(201).json({ 
            message: "Product added to inventory successfully", 
            inventory: newProductInventory 
        });

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ 
            message: "Server error", 
            error: err.message 
        });
    }
};

// Get inventory product by ID
const getById = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.product_id);
        
        if (!inventory) {
            return res.status(404).json({ 
                message: "Inventory item not found",
                success: false
            });
        }
        
        return res.status(200).json({
            success: true,
            inventory
        });
        
    } catch (err) {
        console.error("Error fetching inventory:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};

// Get inventory product by cat_id
const getByCategory = async (req, res) => {
    try {
        const { cat_id } = req.params;
        let query = {};
        if (cat_id) {
            query.cat_id = cat_id;
        } else {
            // If no category is specified, return all inventory
            const inventory = await Inventory.find();
            return res.json({ inventory });
        }
        const inventory = await Inventory.find(query);
        res.json({ inventory });
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
};

// Delete product from inventory
const deleteProduct = async (req, res, next) => {
    const id = req.params.product_id;

    try {
        const inventory = await Inventory.findByIdAndDelete(id);
        if (!inventory) {
            return res.status(404).json({ message: "Unable to delete inventory item" });
        }

        //create an activity log for the new product
        const activityLog = new InventoryActivityLogModel({
            product_id: id,
            message: `Product ${id} deleted from inventory`,
            type: 'PRODUCT_DELETED_FROM_INVENTORY'
        });
        
        //save activity log
        await activityLog.save();

        return res.status(200).json({ 
            message: "Inventory item deleted successfully",
            inventory 
        });
    } catch (err) {
        console.error("Error deleting inventory:", err);
        return res.status(500).json({ 
            message: "Server error", 
            error: err.message 
        });
    }
};

exports.getAllInventory = getAllInventory;
exports.getInventoryCount = getInventoryCount;
exports.getLowStockCount = getLowStockCount;
exports.getExpiringCount = getExpiringCount;
exports.getExpiredCount = getExpiredCount;
exports.getRecentActivity = getRecentActivity;
exports.addProductsToInventory = addProductsToInventory;
exports.getById = getById;
exports.getByCategory = getByCategory;
exports.deleteProduct = deleteProduct;