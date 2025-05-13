/***
 * @Developed By: Udayanga
 * @Developed On: 22th March 2025
 */

const InventoryActivityLogModel = require("../models/InventoryActivityLogModel");
const Product = require("../models/ProductModel");
const Promotion = require("../models/PromotionModel");

//get all products
const getAllProducts = async (req, res, next) => {
  let products;

  try {
    products = await Product.find({ is_active: true });

    //if product not found
    if (!products) {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.log(err);
  }

  //display all products
  res.status(200).json({ products });
};

const getAllProductsWithDet = async (req, res, next) => {
  let products;

  try {
    products = await Product.find({ is_active: true })
      .populate("cat_id") // Populate the Category document
      .populate("supplier_id"); // Populate the Supplier document;

    //if product not found
    if (!products) {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.log(err);
  }

  //display all products
  res.status(200).json({ products });
};

//get product by ID
const getById = async (req, res) => {
  try {
    const id = req.params.id; // Retrieve the product ID from the URL params
    const product = await Product.findById(id)
      .populate("cat_id") // Populate the category data
      .populate("supplier_id"); // Populate the supplier data

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }
    res.json({ product, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// add new product
const addProduct = async (req, res, next) => {
  let newProduct;

  try {
    const {
      pr_name,
      description,
      cat_id,
      barcode,
      shelf,
      aisle,
      row,
      unit_price,
      supplier_id,
      exp_date,
      image_url,
    } = req.body;

    //validate required fields
    if (!pr_name || !unit_price || !barcode || !exp_date) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    // Check if a product with the same barcode already exists
    const existingProduct = await Product.findOne({ barcode });
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "A product with this barcode already exists" });
    }

    //create new product
    newProduct = new Product({
      pr_name,
      description: description || "",
      cat_id,
      barcode: barcode || "",
      aisle: aisle || "",
      shelf: shelf || "",
      row: row || "",
      unit_price,
      is_active: true,
      supplier_id: supplier_id || null,
      exp_date: exp_date,
      image_url: image_url || "", // Add default empty string if no image URL provided
    });

    //save product
    await newProduct.save();

    //create an activity log for the new product
    const activityLog = new InventoryActivityLogModel({
      product_id: newProduct._id,
      message: `New product ${newProduct.pr_name} added to inventory`,
      type: "NEW_PRODUCT_ADDED",
    });

    //save activity log
    await activityLog.save();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }

  // Send a success response with the saved product
  return res.status(201).json({ newProduct });
};

//update product
const updateProduct = async (req, res, next) => {
  let updatedProduct;

  try {
    const product_id = req.params.id;
    const {
      pr_name,
      description,
      cat_id,
      barcode,
      unit_price,
      is_active,
      supplier_id,
      exp_date,
      promotions,
      image_url,
    } = req.body;

    // Check if the product exists
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product
    product.pr_name = pr_name || product.pr_name;
    product.description = description || product.description;
    product.cat_id = cat_id || product.cat_id;
    product.barcode = barcode || product.barcode;
    product.unit_price = unit_price || product.unit_price;
    product.is_active = is_active !== undefined ? is_active : product.is_active;
    product.supplier_id = supplier_id || product.supplier_id;
    product.exp_date = exp_date || product.exp_date;
    product.image_url = image_url || product.image_url; // Update image URL if provided

    // Validate and update promotions
    if (promotions && promotions.length > 0) {
      const validPromotions = await Promotion.find({
        _id: { $in: promotions },
      });
      product.promotions = validPromotions.map((promo) => promo._id);
    }

    // Save the updated product
    updatedProduct = await product.save();

    // Create an activity log for the price update
    const activityLog = new InventoryActivityLogModel({
      product_id: product_id,
      message: `Product details updated`,
      type: "PRODUCT_DETAIL_UPDATED",
    });

    // Save the activity log
    await activityLog.save();
  } catch (err) {
    console.log(err);
  }

  // Send a success response with the updated product
  res
    .status(200)
    .json({ message: "Product updated successfully", product: updatedProduct });
};

// Update price of product
const updateProductPrice = async (req, res, next) => {
  let updatedProduct;

  try {
    const { product_id, new_price } = req.body;

    //validate required fields
    if (!product_id || !new_price) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    // Check if the product exists
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check the new price is valid
    if (new_price <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid price. Price cannot be minus." });
    }

    // Update the product price
    product.unit_price = new_price;
    updatedProduct = await product.save();

    // Create an activity log for the price update
    const activityLog = new InventoryActivityLogModel({
      product_id: product_id,
      message: `Price updated to ${new_price}`,
      type: "PRODUCT_PRICE_UPDATED",
    });

    // Save the activity log
    await activityLog.save();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }

  // Send a success response with the updated product
  return res.status(200).json({
    message: "Product price updated successfully",
    product: updatedProduct,
  });
};

//add promotions to product
const addPromotions = async (req, res, next) => {
  let updatedProduct;

  try {
    const { product_id, promotion_id } = req.body;

    //find the product
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    //find the promotions
    const promotion = await Promotion.findById(promotion_id);
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    //check if the promotion is already added
    if (product.promotions.includes(promotion_id)) {
      return res.status(400).json({ message: "Promotion already added" });
    }

    //add promotion to the product
    product.promotions.push(promotion_id);
    updatedProduct = await product.save();

    // Create an activity log for the price update
    const activityLog = new InventoryActivityLogModel({
      product_id: product_id,
      message: `Promotion added to ${updateProduct.pr_name}`,
      type: "PROMOTION_ADDED_TO_PRODUCT",
    });

    // Save the activity log
    await activityLog.save();
  } catch (err) {
    console.log(err);
  }

  //send a success response
  res
    .status(200)
    .json({ message: "Promotion added successfully", updateProduct });
};

//soft delete product
const deleteProduct = async (req, res, next) => {
  let deletedProduct;

  try {
    const { id: product_id } = req.params;

    //find the product
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (!product.is_active) {
      return res.status(400).json({ message: "Product is already deleted" });
    }

    //soft delete the product
    product.is_active = false;
    deletedProduct = await product.save();

    // Create an activity log for the price update
    const activityLog = new InventoryActivityLogModel({
      product_id: product_id,
      message: `Product ${updateProduct.pr_name} deleted`,
      type: "PRODUCT_DELETED",
    });

    // Save the activity log
    await activityLog.save();
  } catch (err) {
    console.log(err);
  }

  //send a success response
  res.status(200).json({ message: "Product deleted successfully" });
};

//Search products by name
const searchProducts = async (req, res, next) => {
  try {
    const query = req.query.q || "";
    console.log(`Search query received: ${query}`); // Log the query

    // If no query is provided, return an empty array
    if (!query.trim()) {
      console.log("No query provided, returning empty array");
      return res.status(200).json({ products: [] });
    }

    // Search for products by pr_name (case-insensitive) and only return active products
    const products = await Product.find({
      pr_name: { $regex: query, $options: "i" },
      is_active: true,
    })
      .select("pr_name _id")
      .limit(10);

    console.log(`Found ${products.length} products`); // Log the number of products found
    console.log("Products:", products); // Log the products

    // If no products are found, return an empty array
    if (!products || products.length === 0) {
      console.log("No products found, returning empty array");
      return res.status(200).json({ products: [] });
    }

    // Return the matching products
    return res.status(200).json({ products });
  } catch (err) {
    console.error("Error in searchProducts:", err); // Log the error with more detail
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

//export
exports.addProduct = addProduct;
exports.getAllProducts = getAllProducts;
exports.getById = getById;
exports.updateProduct = updateProduct;
exports.updateProductPrice = updateProductPrice;
exports.addPromotions = addPromotions;
exports.deleteProduct = deleteProduct;
exports.searchProducts = searchProducts;
exports.getAllProductsWithDet = getAllProductsWithDet;
