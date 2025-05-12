/***
 * @Developed By: Udayanga
 * @Developed On: 24th March 2025
 */

const Category = require('../models/CategoryModel');

//get all categories
const getAllCategories = async(req, res, next) => {
    let categories;

    try{
        categories = await Category.find();

        //if category not found
        if(!categories) {
            return res.status(404).json({message: 'Category not found'});
        }
    } catch(err) {
        console.log(err);
    }

    //display all categories
    res.status(200).json({categories});
};

//add new category
const addCategory = async(req, res, next) => {
    let newCategory;
    
        try {
            const {cat_name, description} = req.body;
    
            //add new category
            newCategory = new Category({
                cat_name,
                description
            });
    
            //save product
            await newCategory.save();
        } catch(err) {
            return res.status(500).json({ message: 'Server Error', error: err.message });
        }
    
        // Send a success response with the saved product
        return res.status(201).json({newCategory});
}

//export
exports.getAllCategories = getAllCategories;
exports.addCategory = addCategory;