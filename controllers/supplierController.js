const Supplier = require("../models/supplier");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Suppliers
exports.supplier_list = asyncHandler(async (req, res, next) => {
    const allSuppliers = await Supplier.find().sort({ name: 1 }).exec();
    res.render("supplier_list", {
        title: "Supplier List",
        supplier_list: allSuppliers,
    });
});

// Display detail page for a specific Supplier.
exports.supplier_detail = asyncHandler(async (req, res, next) => {
    const supplier = await Supplier.findById(req.params.id).exec();
    if (!supplier) {
        const err = new Error("Supplier not found");
        err.status = 404;
        return next(err);
    }
    res.render("supplier_detail", {
        title: "Supplier Detail",
        supplier: supplier,
    });
});

// Display Supplier create form on GET.
exports.supplier_create_get = (req, res) => {
    res.render("supplier_form", { title: "Create Supplier" });
};

// Handle Supplier create on POST.
exports.supplier_create_post = [
    // Validation and sanitization
    body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("address", "Address must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("tel", "Telephone must not be empty.").trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render("supplier_form", {
                title: "Create Supplier",
                supplier: req.body,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid. Save supplier.
            const supplier = new Supplier({
                name: req.body.name,
                address: req.body.address,
                tel: req.body.tel,
            });
            await supplier.save();
            res.redirect(supplier.url);
        }
    }),
];

// Display Supplier delete form on GET.
exports.supplier_delete_get = asyncHandler(async (req, res, next) => {
    const supplier = await Supplier.findById(req.params.id).exec();
    if (!supplier) {
        const err = new Error("Supplier not found");
        err.status = 404;
        return next(err);
    }
    res.render("supplier_delete", {
        title: "Delete Supplier",
        supplier: supplier,
    });
});

// Handle Supplier delete on POST.
exports.supplier_delete_post = asyncHandler(async (req, res, next) => {
    const supplier = await Supplier.findById(req.body.supplierid).exec();
    if (!supplier) {
        const err = new Error("Supplier not found");
        err.status = 404;
        return next(err);
    }
    // Delete object and redirect to the list of suppliers.
    await Supplier.findByIdAndRemove(req.body.supplierid);
    res.redirect("/inventory/suppliers");
});

// Display Supplier update form on GET.
exports.supplier_update_get = asyncHandler(async (req, res, next) => {
    const supplier = await Supplier.findById(req.params.id).exec();
    if (!supplier) {
        const err = new Error("Supplier not found");
        err.status = 404;
        return next(err);
    }
    res.render("supplier_form", {
        title: "Update Supplier",
        supplier: supplier,
    });
});

// Handle Supplier update on POST.
exports.supplier_update_post = [
    // Validation and sanitization
    body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("address", "Address must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("tel", "Telephone must not be empty.").trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render("supplier_form", {
                title: "Update Supplier",
                supplier: req.body,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid. Update the supplier.
            const supplier = new Supplier({
                name: req.body.name,
                address: req.body.address,
                tel: req.body.tel,
                _id: req.params.id,
            });
            await Supplier.findByIdAndUpdate(req.params.id, supplier, {});
            res.redirect(supplier.url);
        }
    }),
];