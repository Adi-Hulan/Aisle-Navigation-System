const Product = require("../models/SupplierProductModel");

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Corrected variable name

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        return res.status(200).json({ products });
    } catch (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

//Data Insert
const addProduct = async (req, res) => {
    const { Product_name, quantity, price, last_update } = req.body;
  console.log(Product_name)
    try {
      const product = new Product({ Product_name, quantity, price, last_update });
      await product.save();
  
      // Include Product_name in the response
      return res.status(201).json({ 
          message: "Product added successfully!", 
          product: {
            ...product.toObject(), // Convert Mongoose document to plain object
            Product_name: Product_name, // Add Product_name to the response
          }
      });
  
    } catch (err) {
      console.error("Error adding product:", err);
      return res.status(500).json({ message: "Unable to add product" });
    }
  };


//Get by Id
const getById = async (req, res,next) =>{

    const id = req.params.id;

    let product;

    try{
        product = await Product.findById(id);
    }catch (err) {
        console.log(err);
    }
    
    //No available products
    if (!product) {
        return res.status(404).json({ message: "unable to find products"});
    }
    return res.status(200).json({ product });
}

//Update Product details
const updateProduct= async (req, res, next) => {

    const id = req.params.id;
    const { Product_name, quantity, price, last_update } = req.body;

    let product;

    try{
        product = await Product.findByIdAndUpdate(id,
             { Product_name: Product_name, quantity: quantity, price: price, last_update: last_update});
             product = await product.save();
    }catch(err) {
        console.log(err);
    }
    if (!product) {
        return res.status(404).json({ message: "unable to update Product details"});
    }
    return res.status(200).json({ product });
};

//Delete Product details
const deleteProduct = async (req,res, next) => {
    const id = req.params.id;

    let product;

    try{
        product = await Product.findByIdAndDelete(id)
    }catch(err){
        console.log(err);
    }
    if (!product) {
        return res.status(404).json({ message: "unable to delete Product details"});
    }
    return res.status(200).json({ product });
};

exports.getAllProducts = getAllProducts;
exports.addProduct = addProduct;
exports.getById = getById;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;