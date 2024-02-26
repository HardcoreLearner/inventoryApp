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

// Display RestaurantWare create form on GET.

// Handle RestaurantWare create on POST.

// Display RestaurantWare delete form on GET.

// Display RestaurantWare delete form on POST.

// Display RestaurantWare update form on GET.

// Handle RestaurantWare update on POST.