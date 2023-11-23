const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    country: String,
	province: String,
	district: String,
	village: String,
	detail: String,
	name: String,
	phone: String,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user"
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

const Address = mongoose.model('address', addressSchema);
module.exports = Address