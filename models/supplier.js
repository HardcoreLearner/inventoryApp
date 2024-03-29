const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SupplierSchema = new Schema({
    name: { type: String, required: true, unique:true },
    address: { type: String, required: true },
    tel: { type: String, required: true },
});

// Virtual for supplier's URL
SupplierSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need this object
    return `/inventory/supplier/${this._id}`;
});

// Export model
module.exports = mongoose.model("Supplier", SupplierSchema);