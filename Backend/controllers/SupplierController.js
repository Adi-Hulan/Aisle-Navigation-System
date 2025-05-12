const Supplier = require('../models/SupplierModel');
const SupplierRequest = require('../models/SupplierRequestModel');

const getAllSuppliers = async(req, res, next) => {
    let supplier;

    //get all users
    try {
        supplier = await Supplier.find();
    } catch(err) {
        console.log(err);
    }

    //if users not found
    if (!supplier) {
        return res.status(404).json({message: 'Users not found'});
    }

    //display all users
    res.status(200).json({supplier});
};

// add new supplier
const addSupplier = async(req, res, next) => {
    
    let newSupplier;

    try {
        const {supplier_name, email, phone, address, is_active, products} = req.body;
        
        //validate required fields
        if(!supplier_name || !email) {
            return res.status(400).json({message: "Please fill all required fields"});
        }

        //add new supplier
        newSupplier = new Supplier({
            supplier_name,
            email,
            phone: phone || "",
            address: address || "",
            is_active: is_active !== undefined ? is_active: true,
            created_at: Date.now(),
            products: products || []
        });

        //save product
        await newSupplier.save();
    } catch(err) {
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }

    // Send a success response with the saved product
    return res.status(201).json({newSupplier});
};

// Create a new supplier request
const createSupplierRequest = async(req, res, next) => {
    try {
        const { supplierId, item, qty } = req.body;
        
        // Validate required fields
        if(!supplierId || !item || !qty) {
            return res.status(400).json({message: "Please fill all required fields"});
        }

        // Check if supplier exists
        const supplier = await Supplier.findById(supplierId);
        if (!supplier) {
            return res.status(404).json({message: "Supplier not found"});
        }

        // Create new request
        const newRequest = new SupplierRequest({
            supplierId,
            item,
            qty,
            status: 'pending'
        });

        await newRequest.save();
        return res.status(201).json({newRequest});
    } catch(err) {
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get all supplier requests
const getAllSupplierRequests = async(req, res, next) => {
    try {
        const requests = await SupplierRequest.find().populate('supplierId');
        return res.status(200).json({requests});
    } catch(err) {
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get supplier request by ID
const getSupplierRequestById = async(req, res, next) => {
    try {
        const request = await SupplierRequest.findById(req.params.id).populate('supplierId');
        if (!request) {
            return res.status(404).json({message: "Request not found"});
        }
        return res.status(200).json({request});
    } catch(err) {
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Update request status
const updateRequestStatus = async(req, res, next) => {
    try {
        const { status } = req.body;
        if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({message: "Invalid status"});
        }

        const request = await SupplierRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({message: "Request not found"});
        }

        return res.status(200).json({request});
    } catch(err) {
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.getAllSuppliers = getAllSuppliers;
exports.addSupplier = addSupplier;
exports.createSupplierRequest = createSupplierRequest;
exports.getAllSupplierRequests = getAllSupplierRequests;
exports.getSupplierRequestById = getSupplierRequestById;
exports.updateRequestStatus = updateRequestStatus;