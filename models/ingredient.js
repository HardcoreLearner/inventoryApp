const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    cost: { type: Schema.Types.Number, required: true },
    quantity: { type: Schema.Types.Number, required: true},
    critical: { type: Schema.Types.Number, required: true },
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier" },
});

// Display inventory home page
exports.index = asyncHandler(async (req, res, next) => {
    const numIngredients = await Ingredient.countDocuments({}).exec();
  
    res.render("index", {
      title: "Ingredient Inventory",
      ingredient_count: numIngredients,
    });
  });

// Virtual for ingredient's URL
IngredientSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need this object
    return `/inventory/ingredient/${this._id}`;
});

// Export model
module.exports = mongoose.model("Ingredient", IngredientSchema);