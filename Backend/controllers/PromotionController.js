/***
 * @Developed By: Udayanga
 * @Developed On: 25th March 2025
 */

const Promotion = require('../models/PromotionModel');

const getAllPromotions = async(req, res, next) => {
    let promotion;

    //get all users
    try {
        promotion = await Promotion.find();
    } catch(err) {
        console.log(err);
    }

    //if users not found
    if (!promotion) {
        return res.status(404).json({message: 'Users not found'});
    }

    //display all users
    res.status(200).json({promotion});
};

exports.getAllPromotions = getAllPromotions;