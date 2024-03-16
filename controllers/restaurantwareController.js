// Import required modules and models
const RestaurantWare = require("../models/restaurantware");
const Supplier = require("../models/supplier");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all restaurantwares
exports.restaurantware_list = asyncHandler(async (req, res, next) => {
    const allRestaurantWares = await RestaurantWare.find().populate('supplier').sort({ name: 1 });
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
    try {
        const suppliers = await Supplier.find().exec();
        const types = await RestaurantWare.distinct('type').exec(); // Fetch distinct types
        res.render("restaurantware_form", {
            title: "Create RestaurantWare",
            suppliers: suppliers,
            types: types,
        });
    } catch (err) {
        next(err);
    }
});

// Handle RestaurantWare create on POST.
exports.restaurantware_create_post = [
    // Validation and sanitization
    body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
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
            const types = await RestaurantWare.distinct('type').exec();
            res.render("restaurantware_form", {
                title: "Create RestaurantWare",
                restaurantware: req.body,
                suppliers: suppliers,
                types: types,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid. Save restaurantware.
            const newType = req.body.new_type ? req.body.new_type : req.body.type;
            const restaurantware = new RestaurantWare({
                name: req.body.name,
                type: newType,
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
    await RestaurantWare.findByIdAndDelete(req.body.restaurantwareid);
    res.redirect("/inventory/restaurantwares");
});

// Display RestaurantWare update form on GET.
exports.restaurantware_update_get = asyncHandler(async (req, res, next) => {
    try {
        const restaurantware = await RestaurantWare.findById(req.params.id).populate('supplier').exec();
        if (!restaurantware) {
            const err = new Error("RestaurantWare not found");
            err.status = 404;
            throw err;
        }
        const suppliers = await Supplier.find().exec();
        const types = await RestaurantWare.distinct('type').exec(); // Fetch distinct types
        res.render("restaurantware_form", {
            title: "Update RestaurantWare",
            restaurantware: restaurantware,
            suppliers: suppliers,
            types: types,
        });
    } catch (err) {
        next(err);
    }
});

// Handle RestaurantWare update on POST.
exports.restaurantware_update_post = [
    // Validation and sanitization
    body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
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
            const types = await RestaurantWare.distinct('type').exec();
            res.render("restaurantware_form", {
                title: "Update RestaurantWare",
                restaurantware: req.body,
                suppliers: suppliers,
                types: types,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid. Update the restaurantware.
            const newType = req.body.new_type ? req.body.new_type : req.body.type;
            const restaurantware = {
                name: req.body.name,
                type: newType,
                cost: req.body.cost,
                stock: req.body.stock,
                critical: req.body.critical,
                supplier: req.body.supplier,
                _id: req.params.id,
            };
            await RestaurantWare.findByIdAndUpdate(req.params.id, restaurantware, {});
            res.redirect(`/inventory/restaurantware/${req.params.id}`); // Corrected redirect URL
        }
    }),
];
