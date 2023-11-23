const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../../config')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please Enter your name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 5 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter your Email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
    },
    image: String,
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER"
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    // resetPasswordToken: String,
    // resetPasswordExpire: Date,
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// JWT - Token
userSchema.methods.getJWTToken = function () {
    return jsonWebToken.sign({ userId: this._id, role: this.role }, config.JWT, {
        expiresIn: config.token.TOKEN_EXPIRE_TIME,
    });
}

// Generating Password Reset Token
// userSchema.methods.getResetPasswordToken = function () {
//     // Generating Token
//     const resetToken = crypto.randomBytes(20).toString("hex");

//     // Hashing and adding to User Schema
//     this.resetPasswordToken = crypto.createHash("sha256")
//         .update(resetToken)
//         .digest("hex");

//     this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

//     return resetToken;
// }

const User = mongoose.model('user', userSchema);
module.exports = User