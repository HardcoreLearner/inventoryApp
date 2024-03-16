// Import required modules and models
const Ingredient = require('../models/ingredient');
const Recipe = require('../models/recipe');
const RestaurantWare = require('../models/restaurantware');
const Supplier = require('../models/supplier');

// Import asyncHandler and express-validator
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");

// Display index page
exports.index = asyncHandler(async (req, res, next) => {
    // Retrieve counts for various entities
    const [
        numIngredients,
        numRecipes,
        numRestaurantWares,
        numSuppliers,
    ] = await Promise.all([
        Ingredient.countDocuments({}),
        Recipe.countDocuments({}),
        RestaurantWare.countDocuments({}),
        Supplier.countDocuments({}),
    ]);

    // Render index page with counts
    res.render('index', {
        title: 'Restaurant Inventory Home',
        ingredient_count: numIngredients,
        recipe_count: numRecipes,
        restaurantware_count: numRestaurantWares,
        supplier_count: numSuppliers,
    });
});

// Display list of ingredients
exports.ingredient_list = asyncHandler(async (req, res, next) => {
    const allIngredients = await Ingredient.find().populate('supplier').sort({ name: 1 });
    res.render("ingredient_list", {
        title: "Ingredient List",
        ingredient_list: allIngredients,
    });
});

// Display detail page for a specific Ingredient.
exports.ingredient_detail = asyncHandler(async (req, res, next) => {
    const ingredient = await Ingredient.findById(req.params.id).populate('supplier');
    if (!ingredient) {
        const err = new Error("Ingredient not found");
        err.status = 404;
        return next(err);
    }
    res.render("ingredient_detail", {
        title: "Ingredient Detail",
        ingredient: ingredient,
    });
});

// Display Ingredient create form on GET.
exports.ingredient_create_get = asyncHandler(async (req, res, next) => {
    const suppliers = await Supplier.find();
    const types = await Ingredient.distinct('type');
    res.render("ingredient_form", {
        title: "Create Ingredient",
        suppliers: suppliers,
        types: types,
    });
});

// Handle Ingredient create on POST.
exports.ingredient_create_post = [
    // Validation and sanitization
    body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("cost", "Cost must be a number.").trim().isNumeric().toFloat(),
    body("quantity", "Quantity must be a number.").trim().isNumeric().toFloat(),
    body("critical", "Critical must be a number.").trim().isNumeric().toFloat(),
    body("supplier", "Supplier must be selected").notEmpty(),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const suppliers = await Supplier.find();
            const types = await Ingredient.distinct('type');
            res.render("ingredient_form", {
                title: "Create Ingredient",
                ingredient: req.body,
                suppliers: suppliers,
                types: types,
                errors: errors.array(),
            });
            return;
        } else {
            let ingredientType = req.body.type;
            if (req.body.new_type) {
                ingredientType = req.body.new_type;
            }
            const ingredient = new Ingredient({
                name: req.body.name,
                type: ingredientType,
                cost: req.body.cost,
                quantity: req.body.quantity,
                critical: req.body.critical,
                supplier: req.body.supplier,
            });
            await ingredient.save();
            res.redirect(ingredient.url);
        }
    }),
];

// Display Ingredient update form on GET.
exports.ingredient_update_get = asyncHandler(async (req, res, next) => {
    const ingredient = await Ingredient.findById(req.params.id).populate('supplier');
    const suppliers = await Supplier.find();
    const types = await Ingredient.distinct('type');
    res.render("ingredient_form", {
        title: "Update Ingredient",
        ingredient: ingredient,
        suppliers: suppliers,
        types: types,
    });
});

// Handle Ingredient update on POST.
exports.ingredient_update_post = [
    // Validation and sanitization
    body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("cost", "Cost must be a number.").trim().isNumeric().toFloat(),
    body("quantity", "Quantity must be a number.").trim().isNumeric().toFloat(),
    body("critical", "Critical must be a number.").trim().isNumeric().toFloat(),
    body("supplier", "Supplier must be selected").notEmpty(),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const suppliers = await Supplier.find();
            const types = await Ingredient.distinct('type');
            res.render("ingredient_form", {
                title: "Update Ingredient",
                ingredient: req.body,
                suppliers: suppliers,
                types: types,
                errors: errors.array(),
            });
            return;
        } else {
            let ingredientType = req.body.type;
            if (req.body.new_type) {
                ingredientType = req.body.new_type;
            }
            const ingredient = new Ingredient({
                name: req.body.name,
                type: ingredientType,
                cost: req.body.cost,
                quantity: req.body.quantity,
                critical: req.body.critical,
                supplier: req.body.supplier,
                _id: req.params.id,
            });
            await Ingredient.findByIdAndUpdate(req.params.id, ingredient, {});
            res.redirect(ingredient.url);
        }
    }),
];

// Handle Ingredient delete on POST.
exports.ingredient_delete_post = asyncHandler(async (req, res, next) => {
    try {
        const ingredient = await Ingredient.findById(req.body.ingredientid);
        if (!ingredient) {
            const err = new Error("Ingredient not found");
            err.status = 404;
            throw err;
        }
        await Ingredient.findByIdAndDelete(req.body.ingredientid);
        res.redirect("/inventory/ingredients");
    } catch (err) {
        next(err);
    }
});

// Display Ingredient delete form on GET.
exports.ingredient_delete_get = asyncHandler(async (req, res, next) => {
    const ingredient = await Ingredient.findById(req.params.id).populate('supplier').exec();
    if (!ingredient) {
        const err = new Error("Ingredient not found");
        err.status = 404;
        return next(err);
    }
    res.render("ingredient_delete", {
        title: "Delete Ingredient",
        ingredient: ingredient,
    });
});
