const Recipe = require("../models/recipe");
const Ingredient = require("../models/ingredient");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all recipes
exports.recipe_list = asyncHandler(async (req, res, next) => {
    const allrecipes = await Recipe.find().sort({ name: 1 }).exec();
    res.render("recipe_list", {
        title: "Recipe List",
        recipe_list: allrecipes,
    });
});

// Display detail page for a specific Recipe.

// Display Recipe create form on GET.

// Handle Recipe create on POST.

// Display Recipe delete form on GET.

// Display Recipe delete form on POST.

// Display Recipe update form on GET.

// Handle Recipe update on POST.