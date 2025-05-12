const User = require('../models/UserModel');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')


// create a jwt
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET);
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json({ users });
    } catch (err) {
        console.error('Error retrieving users:', err);
        res.status(500).json({ message: 'Error retrieving users', error: err.message });
    }
};

// Get user by ID
const getById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (err) {
        console.error('Error retrieving user:', err);
        res.status(500).json({ message: 'Error retrieving user', error: err.message });
    }
};

// Update user (by admin)
const updateUser = async (req, res, next) => {
    let updatedUser;

    try {
        const userId = req.params.id;
        const { username, password, email, firstName, lastName, phone, salary } = req.body;

        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user with the new values from the request body
        user.username = username || user.username;
        user.pw_hash = password || user.pw_hash;
        user.email = email || user.email;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.phone = phone || user.phone;
        user.job_title = user.job_title;
        user.salary = salary || user.salary;
        user.hire_date = user.hire_date;
        user.is_active = user.is_active;

        updatedUser = await user.save();

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
};


//delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate if the ID is a valid MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ 
            message: "User deleted successfully", 
            success: true 
        });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: "Error deleting user", error: err.message });
    }
};



// Register user (self-registration)
const registerCustomer = async (req, res) => {
    const { username, password, confirmPassword, email, firstName, lastName, phone } = req.body;
    console.log('register', username)
    try {

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }


        const newUser = await User.createNew({
            username,
            password,
            email,
            firstName,
            lastName,
            phone: phone || "",
            job_title: 'customer',
            salary: 0,
        });

        res.status(200  ).json({ 
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName
            }
        });
    } catch (err) {
        res.status(400).json({error: err.message})
        console.log(err);
    }
};

// admin add user 
const addUser = async (req, res) => {
    const { username, password, confirmPassword, email, firstName, lastName, phone, job_title, salary} = req.body;
    console.log('register', username)
    try {

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }


        const newUser = await User.createNew({
            username,
            password,
            email,
            firstName,
            lastName,
            phone: phone || "",
            job_title,
            salary,
        });

        res.status(200  ).json({ 
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName
            }
        });
    } catch (err) {
        res.status(400).json({error: err.message})
        console.log(err);
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password)

        // Update last_login timestamp
        user.last_login = new Date();
        await user.save();

        const token = createToken(user._id)

        // Return user data including the primary role
        res.status(200).json({ 
            message: "Login successful", 
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email,
                role: user.job_title,
                token
            } 
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Error during login", error: err.message });
    }
};

// Add new inventory manager (who must already exist as a user)
const addInventoryManager = async (req, res) => {
    try {
      const { user_id, hire_date, section, salary } = req.body;
  
      // Validate required fields
      if (!user_id || !hire_date || !salary) {
        return res.status(400).json({
          status: 'fail',
          message: 'Please provide user_id, hire_date, and salary'
        });
      }
  
      // Check if user exists
      const existingUser = await User.findById(user_id);
      if (!existingUser) {
        return res.status(404).json({
          status: 'fail',
          message: 'User not found with the provided ID'
        });
      }
  
      // Check if user is a manager
      const userRole = await User.findById(user_id);
      if (!userRole.roles) {
        return res.status(404).json({
          status: 'fail',
          message: 'User not found with the provided ID'
        });
      }
  
      // Check if user is already an inventory manager
      const existingManager = await InventoryManager.findOne({ user_id });
      if (existingManager) {
        return res.status(400).json({
          status: 'fail',
          message: 'This user is already an inventory manager'
        });
      }
  
      // Create new inventory manager
      const newManager = await InventoryManager.create({
        user_id,
        hire_date,
        section,
        salary,
        job_title: 'Inventory Manager' // Default value
      });
  
      res.status(201).json({
        status: 'success',
        data: {
          inventoryManager: newManager
        }
      });
  
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: err.message
      });
    }
  };
  
// Update user location
const updateUserLocation = async (req, res) => {
    try {
        const { userId } = req.params;
        const { latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                location: {
                    latitude,
                    longitude,
                    lastUpdated: new Date()
                }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Location updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user location
const getUserLocation = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('location');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ location: user.location });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllUsers, addUser, getById, updateUser, deleteUser, registerCustomer, loginUser, addInventoryManager, updateUserLocation, getUserLocation };