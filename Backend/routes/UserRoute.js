const express = require("express");
const router = express.Router();

//Insert model
const user = require("../models/UserModel");

//Insert controller
const UserController = require("../controllers/userController");
const { default: requireUser } = require("../middleware/requireUser");
const { default: requireAdmin } = require("../middleware/requireAdmin");

router.use((req, res, next) => {
  console.log(req);
  next();
});

//Get all users
router.get("/", UserController.getAllUsers);

//insert user by admin
router.post("/add", requireUser, UserController.addUser);

//get by id
router.get("/:id", UserController.getById);

//update user
router.put("/update/:id", UserController.updateUser);

//delete user
router.delete("/delete/:id", UserController.deleteUser);

// Register user
router.post("/register", UserController.registerCustomer);

// Loging user
router.post("/login", UserController.loginUser);

//add new inventory manager
router.post("/addinvenmanager", UserController.addInventoryManager);

// Location routes
router.put("/:userId/location", requireUser, UserController.updateUserLocation);
router.get("/:userId/location", requireUser, UserController.getUserLocation);

//export
module.exports = router;
