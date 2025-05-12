const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        pw_hash: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String },
        last_login: { type: Date, default: null },
        is_active: { type: Boolean, default: true },
        hire_date: { type: Date, default: Date.now },
        job_title: {
            type: String,
            required: true,
            enum: ["admin", "inventoryManager", "stockManager", "customer", "supplier"],
        },
        salary: { type: Number, required: true },
        location: {
            latitude: { type: Number },
            longitude: { type: Number },
            lastUpdated: { type: Date, default: null }
        },
        overtime: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Overtime" }],
            default: [],
        },
        roles: [
            {
                type: String,
                enum: ["admin", "inventoryManager", "stockManager", "customer", "supplier"],
            },
        ],
    },
    { timestamps: true }
);

// Static createNew method
userSchema.statics.createNew = async function ({
    username,
    password,
    email,
    firstName,
    lastName,
    phone,
    job_title,
    salary,
    roles,
}) {
    // Validation for required fields
    console.log(username);
    console.log(password);
    console.log(salary);
    if (
        !username ||
        !password ||
        !email ||
        !firstName ||
        !lastName ||
        !job_title
    ) {
        throw new Error(
            "All required fields must be filled: username, password, email, firstName, lastName, job_title, salary"
        );
    }

    // Validate email format
    if (!validator.isEmail(email)) {
        throw new Error("Email must be valid");
    }

    // Validate password strength
    if (!validator.isStrongPassword(password)) {
        throw new Error("Password not strong enough");
    }

    // Validate job_title
    const validRoles = [
        "admin",
        "inventoryManager",
        "stockManager",
        "customer",
        "supplier",
    ];
    if (!validRoles.includes(job_title)) {
        throw new Error(`Job title must be one of: ${validRoles.join(", ")}`);
    }

    // Validate roles array (if provided)
    if (roles && Array.isArray(roles)) {
        for (const role of roles) {
            if (!validRoles.includes(role)) {
                throw new Error(
                    `Role '${role}' is not valid. Must be one of: ${validRoles.join(
                        ", "
                    )}`
                );
            }
        }
    }

    // Check for duplicate username or email
    const exists = await this.findOne({ $or: [{ email }, { username }] });
    if (exists) {
        throw new Error("Email or username already in use");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const pw_hash = await bcrypt.hash(password, salt);

    // Create user
    const user = await this.create({
        username,
        pw_hash,
        email,
        firstName,
        lastName,
        phone,
        job_title,
        salary,
        roles: roles || [],
    });

    return user;
};

userSchema.statics.login = async function (email, password) {
    // validate
    if (!email || !password) {
        throw Error("All field must be filled ");
    }

    const user = await this.findOne({ email });

    if (!user) {
        throw Error("incorrect email");
    }

    const match = await bcrypt.compare(password, user.pw_hash);

    if (!match) {
        throw Error("incorrect password");
    }

    return user;
};

module.exports = mongoose.model("User", userSchema);
