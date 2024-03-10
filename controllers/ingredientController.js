const Ingredient = require("../models/ingredient");
const Supplier = require("../models/supplier");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Ingredients
exports.ingredient_list = asyncHandler(async (req, res, next) => {
    const allIngredients = await Ingredient.find().sort({ name: 1 }).exec();
    res.render("ingredient_list", {
        title: "Ingredient List",
        supplier_list: allIngredients,
    });
});

// Display detail page for a specific Ingredient.
exports.ingredient_detail = asyncHandler(async (req, res, next) => {
    const ingredient = await Ingredient.findById(req.params.id).populate('supplier').exec();
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
    const suppliers = await Supplier.find().exec();
    res.render("ingredient_form", {
        title: "Create Ingredient",
        suppliers: suppliers,
    });
});

// Handle Ingredient create on POST.
exports.ingredient_create_post = [
    // Validation and sanitization
    body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("type", "Type must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("cost", "Cost must be a number.").trim().isNumeric().toFloat(),
    body("quantity", "Quantity must be a number.").trim().isNumeric().toFloat(),
    body("critical", "Critical must be a number.").trim().isNumeric().toFloat(),
    body("supplier", "Supplier must be selected").notEmpty(),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            const suppliers = await Supplier.find().exec();
            res.render("ingredient_form", {
                title: "Create Ingredient",
                ingredient: req.body,
                suppliers: suppliers,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid. Save ingredient.
            const ingredient = new Ingredient({
                name: req.body.name,
                type: req.body.type,
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

// Handle Ingredient delete on POST.
exports.ingredient_delete_post = asyncHandler(async (req, res, next) => {
    const ingredient = await Ingredient.findById(req.body.ingredientid).exec();
    if (!ingredient) {
        const err = new Error("Ingredient not found");
        err.status = 404;
        return next(err);
    }
    // Delete object and redirect to the list of ingredients.
    await Ingredient.findByIdAndRemove(req.body.ingredientid);
    res.redirect("/inventory/ingredients");
});

// Display Ingredient update form on GET.
exports.ingredient_update_get = asyncHandler(async (req, res, next) => {
    const ingredient = await Ingredient.findById(req.params.id).populate('supplier').exec();
    if (!ingredient) {
        const err = new Error("Ingredient not found");
        err.status = 404;
        return next(err);
    }
    const suppliers = await Supplier.find().exec();
    res.render("ingredient_form", {
        title: "Update Ingredient",
        ingredient: ingredient,
        suppliers: suppliers,
    });
});

// Handle Ingredient update on POST.
exports.ingredient_update_post = [
    // Validation and sanitization
    body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("type", "Type must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("cost", "Cost must be a number.").trim().isNumeric().toFloat(),
    body("quantity", "Quantity must be a number.").trim().isNumeric().toFloat(),
    body("critical", "Critical must be a number.").trim().isNumeric().toFloat(),
    body("supplier", "Supplier must be selected").notEmpty(),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            const suppliers = await Supplier.find().exec();
            res.render("ingredient_form", {
                title: "Update Ingredient",
                ingredient: req.body,
                suppliers: suppliers,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid. Update the ingredient.
            const ingredient = new Ingredient({
                name: req.body.name,
                type: req.body.type,
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