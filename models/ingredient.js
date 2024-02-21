const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    cost: { type: "Double", required: true },
    acq_date: { type: Date },
    exp_date: { type: Date },
    critical: { type: Double },
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier" },
});

// Virtual for ingredient's URL
IngredientSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need this object
    return `/inventory/ingredient/${this._id}`;
});

// Export model
module.exports = mongoose.model("Ingredient", IngredientSchema);