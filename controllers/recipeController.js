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
exports.recipe_detail = asyncHandler(async (req, res, next) => {
    const recipe = await Recipe.findById(req.params.id).populate('ingr_list').exec();
    if (!recipe) {
        const err = new Error("Recipe not found");
        err.status = 404;
        return next(err);
    }
    res.render("recipe_detail", {
        title: "Recipe Detail",
        recipe: recipe,
    });
});

// Display Recipe create form on GET.
exports.recipe_create_get = asyncHandler(async (req, res, next) => {
    const ingredients = await Ingredient.find().exec();
    res.render("recipe_form", {
        title: "Create Recipe",
        ingredients: ingredients,
    });
});

// Handle Recipe create on POST.
exports.recipe_create_post = [
    // Validation and sanitization
    body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("ingr_list", "Ingredients must be selected").notEmpty(),
    body("prep_time", "Preparation time must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("price", "Price must be a number.").trim().isNumeric().toFloat(),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            const ingredients = await Ingredient.find().exec();
            res.render("recipe_form", {
                title: "Create Recipe",
                recipe: req.body,
                ingredients: ingredients,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid. Save recipe.
            const recipe = new Recipe({
                name: req.body.name,
                ingr_list: req.body.ingr_list,
                prep_time: req.body.prep_time,
                price: req.body.price,
            });
            await recipe.save();
            res.redirect(recipe.url);
        }
    }),
];

// Display Recipe delete form on GET.
exports.recipe_delete_get = asyncHandler(async (req, res, next) => {
    const recipe = await Recipe.findById(req.params.id).populate('ingr_list').exec();
    if (!recipe) {
        const err = new Error("Recipe not found");
        err.status = 404;
        return next(err);
    }
    res.render("recipe_delete", {
        title: "Delete Recipe",
        recipe: recipe,
    });
});

// Handle Recipe delete on POST.
exports.recipe_delete_post = asyncHandler(async (req, res, next) => {
    const recipe = await Recipe.findById(req.body.recipeid).exec();
    if (!recipe) {
        const err = new Error("Recipe not found");
        err.status = 404;
        return next(err);
    }
    // Delete object and redirect to the list of recipes.
    await Recipe.findByIdAndRemove(req.body.recipeid);
    res.redirect("/inventory/recipes");
});

// Display Recipe update form on GET.
exports.recipe_update_get = asyncHandler(async (req, res, next) => {
    const recipe = await Recipe.findById(req.params.id).populate('ingr_list').exec();
    if (!recipe) {
        const err = new Error("Recipe not found");
        err.status = 404;
        return next(err);
    }
    const ingredients = await Ingredient.find().exec();
    res.render("recipe_form", {
        title: "Update Recipe",
        recipe: recipe,
        ingredients: ingredients,
    });
});

// Handle Recipe update on POST.
exports.recipe_update_post = [
    // Validation and sanitization
    body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("ingr_list", "Ingredients must be selected").notEmpty(),
    body("prep_time", "Preparation time must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("price", "Price must be a number.").trim().isNumeric().toFloat(),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            const ingredients = await Ingredient.find().exec();
            res.render("recipe_form", {
                title: "Update Recipe",
                recipe: req.body,
                ingredients: ingredients,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid. Update the recipe.
            const recipe = new Recipe({
                name: req.body.name,
                ingr_list: req.body.ingr_list,
                prep_time: req.body.prep_time,
                price: req.body.price,
                _id: req.params.id,
            });
            await Recipe.findByIdAndUpdate(req.params.id, recipe, {});
            res.redirect(recipe.url);
        }
    }),
];