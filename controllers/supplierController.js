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

// Display detail page for a specific Author.

// Display Author create form on GET.

// Handle Author create on POST.

// Display Author delete form on GET.

// Display Author delete form on POST.

// Display Author update form on GET.

// Handle Author update on POST.