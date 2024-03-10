const RestaurantWare = require("../models/restaurantware");
const Supplier = require("../models/supplier");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all restaurantwares
exports.restaurantware_list = asyncHandler(async (req, res, next) => {
    const allRestaurantWares = await RestaurantWare.find().sort({ name: 1 }).exec();
    res.render("restaurantware_list", {
        title: "Restaurant Ware List",
        restaurantware_list: allRestaurantWares,
    });
});

// Display detail page for a specific RestaurantWare.
exports.restaurantware_detail = asyncHandler(async (req, res, next) => {
    const restaurantware = await RestaurantWare.findById(req.params.id).populate('supplier').exec();
    if (!restaurantware) {
        const err = new Error("RestaurantWare not found");
        err.status = 404;
        return next(err);
    }
    res.render("restaurantware_detail", {
        title: "RestaurantWare Detail",
        restaurantware: restaurantware,
    });
});

// Display RestaurantWare create form on GET.
exports.restaurantware_create_get = asyncHandler(async (req, res, next) => {
    const suppliers = await Supplier.find().exec();
    res.render("restaurantware_form", {
        title: "Create RestaurantWare",
        suppliers: suppliers,
    });
});

// Handle RestaurantWare create on POST.
exports.restaurantware_create_post = [
    // Validation and sanitization
    body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("type", "Type must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("cost", "Cost must be a number.").trim().isNumeric().toFloat(),
    body("stock", "Stock must be a number.").trim().isNumeric().toFloat(),
    body("critical", "Critical must be a number.").trim().isNumeric().toFloat(),
    body("supplier", "Supplier must be selected").notEmpty(),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            const suppliers = await Supplier.find().exec();
            res.render("restaurantware_form", {
                title: "Create RestaurantWare",
                restaurantware: req.body,
                suppliers: suppliers,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid. Save restaurantware.
            const restaurantware = new RestaurantWare({
                name: req.body.name,
                type: req.body.type,
                cost: req.body.cost,
                stock: req.body.stock,
                critical: req.body.critical,
                supplier: req.body.supplier,
            });
            await restaurantware.save();
            res.redirect(restaurantware.url);
        }
    }),
];

// Display RestaurantWare delete form on GET.
exports.restaurantware_delete_get = asyncHandler(async (req, res, next) => {
    const restaurantware = await RestaurantWare.findById(req.params.id).populate('supplier').exec();
    if (!restaurantware) {
        const err = new Error("RestaurantWare not found");
        err.status = 404;
        return next(err);
    }
    res.render("restaurantware_delete", {
        title: "Delete RestaurantWare",
        restaurantware: restaurantware,
    });
});

// Handle RestaurantWare delete on POST.
exports.restaurantware_delete_post = asyncHandler(async (req, res, next) => {
    const restaurantware = await RestaurantWare.findById(req.body.restaurantwareid).exec();
    if (!restaurantware) {
        const err = new Error("RestaurantWare not found");
        err.status = 404;
        return next(err);
    }
    // Delete object and redirect to the list of restaurantwares.
    await RestaurantWare.findByIdAndRemove(req.body.restaurantwareid);
    res.redirect("/inventory/restaurantwares");
});

// Display RestaurantWare update form on GET.
exports.restaurantware_update_get = asyncHandler(async (req, res, next) => {
    const restaurantware = await RestaurantWare.findById(req.params.id).populate('supplier').exec();
    if (!restaurantware) {
        const err = new Error("RestaurantWare not found");
        err.status = 404;
        return next(err);
    }
    const suppliers = await Supplier.find().exec();
    res.render("restaurantware_form", {
        title: "Update RestaurantWare",
        restaurantware: restaurantware,
        suppliers: suppliers,
    });
});

// Handle RestaurantWare update on POST.
exports.restaurantware_update_post = [
    // Validation and sanitization
    body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("type", "Type must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("cost", "Cost must be a number.").trim().isNumeric().toFloat(),
    body("stock", "Stock must be a number.").trim().isNumeric().toFloat(),
    body("critical", "Critical must be a number.").trim().isNumeric().toFloat(),
    body("supplier", "Supplier must be selected").notEmpty(),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            const suppliers = await Supplier.find().exec();
            res.render("restaurantware_form", {
                title: "Update RestaurantWare",
                restaurantware: req.body,
                suppliers: suppliers,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid. Update the restaurantware.
            const restaurantware = new RestaurantWare({
                name: req.body.name,
                type: req.body.type,
                cost: req.body.cost,
                stock: req.body.stock,
                critical: req.body.critical,
                supplier: req.body.supplier,
                _id: req.params.id,
            });
            await RestaurantWare.findByIdAndUpdate(req.params.id, restaurantware, {});
            res.redirect(restaurantware.url);
        }
    }),
];