const Ingredient = require("../models/ingredient");
const Supplier = require("../models/supplier");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Suppliers
exports.ingredient_list = asyncHandler(async (req, res, next) => {
    const allIngredients = await Ingredient.find().sort({ name: 1 }).exec();
    res.render("ingredient_list", {
        title: "Ingredient List",
        supplier_list: allIngredients,
    });
});

// Display detail page for a specific Ingredient.

// Display Ingredient create form on GET.

// Handle Ingredient create on POST.

// Display Ingredient delete form on GET.

// Display Ingredient delete form on POST.

// Display Ingredient update form on GET.

// Handle Ingredient update on POST.