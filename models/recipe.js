const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    name: { type: String, required: true },
    ingr_list: [{ type: Schema.Types.ObjectId, ref: "Ingredient", required: true }],
    prep_time: { type: String, required: true },
    price: { type: Schema.Types.Number, required: true },
});

// Virtual for recipe's URL
RecipeSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need this object
    return `/inventory/recipe/${this._id}`;
});

// Export model
module.exports = mongoose.model("Recipe", RecipeSchema);