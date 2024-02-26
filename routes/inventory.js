const express = require("express");
const router = express.Router();

// Require controller modules
const ingredient_controller = require("../controllers/ingredientController");
const recipe_controller = require("../controllers/recipeController");
const restaurantware_controller = require("../controllers/restaurantwareController");
const supplier_controller = require("../controllers/supplierController");

/// Supplier Routes ///