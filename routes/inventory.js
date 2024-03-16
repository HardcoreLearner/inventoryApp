const express = require("express");
const router = express.Router();

// Require controller modules
const ingredient_controller = require("../controllers/ingredientController");
const recipe_controller = require("../controllers/recipeController");
const restaurantware_controller = require("../controllers/restaurantwareController");
const supplier_controller = require("../controllers/supplierController");

/// INVENTORY ROUTES ///

// GET inventory home page
router.get("/", ingredient_controller.index);

// GET request for list of all Suppliers
router.get("/suppliers", supplier_controller.supplier_list);

// GET request for creating a Supplier. NOTE This must come before routes that display Supplier (uses id).
router.get("/supplier/create", supplier_controller.supplier_create_get);

// POST request for creating Supplier
router.post("/supplier/create", supplier_controller.supplier_create_post);

// GET request to delete Supplier
router.get("/supplier/:id/delete", supplier_controller.supplier_delete_get);

// POST request to delete Supplier
router.post("/supplier/:id/delete", supplier_controller.supplier_delete_post);

// GET request to update Supplier
router.get("/supplier/:id/update", supplier_controller.supplier_update_get);

// POST request to update Supplier
router.post("/supplier/:id/update", supplier_controller.supplier_update_post);

// GET request for one Supplier
router.get("/supplier/:id", supplier_controller.supplier_detail);

// Routes for Ingredients

// GET request for list of all Ingredients
router.get("/ingredients", ingredient_controller.ingredient_list);

// GET request for creating an Ingredient. NOTE This must come before routes that display Ingredient (uses id).
router.get("/ingredient/create", ingredient_controller.ingredient_create_get);

// POST request for creating Ingredient
router.post("/ingredient/create", ingredient_controller.ingredient_create_post);

// GET request to delete Ingredient
router.get("/ingredient/:id/delete", ingredient_controller.ingredient_delete_get);

// POST request to delete Ingredient
router.post("/ingredient/:id/delete", ingredient_controller.ingredient_delete_post);

// GET request to update Ingredient
router.get("/ingredient/:id/update", ingredient_controller.ingredient_update_get);

// POST request to update Ingredient
router.post("/ingredient/:id/update", ingredient_controller.ingredient_update_post);

// GET request for one Ingredient
router.get("/ingredient/:id", ingredient_controller.ingredient_detail);

// Routes for Recipes

// GET request for list of all Recipes
router.get("/recipes", recipe_controller.recipe_list);

// GET request for creating a Recipe. NOTE This must come before routes that display Recipe (uses id).
router.get("/recipe/create", recipe_controller.recipe_create_get);

// POST request for creating Recipe
router.post("/recipe/create", recipe_controller.recipe_create_post);

// GET request to delete Recipe
router.get("/recipe/:id/delete", recipe_controller.recipe_delete_get);

// POST request to delete Recipe
router.post("/recipe/:id/delete", recipe_controller.recipe_delete_post);

// GET request to update Recipe
router.get("/recipe/:id/update", recipe_controller.recipe_update_get);

// POST request to update Recipe
router.post("/recipe/:id/update", recipe_controller.recipe_update_post);

// GET request for one Recipe
router.get("/recipe/:id", recipe_controller.recipe_detail);

// Routes for RestaurantWares

// GET request for list of all RestaurantWares
router.get("/restaurantwares", restaurantware_controller.restaurantware_list);

// GET request for creating a RestaurantWare. NOTE This must come before routes that display RestaurantWare (uses id).
router.get("/restaurantware/create", restaurantware_controller.restaurantware_create_get);

// POST request for creating RestaurantWare
router.post("/restaurantware/create", restaurantware_controller.restaurantware_create_post);

// GET request to delete RestaurantWare
router.get("/restaurantware/:id/delete", restaurantware_controller.restaurantware_delete_get);

// POST request to delete RestaurantWare
router.post("/restaurantware/:id/delete", restaurantware_controller.restaurantware_delete_post);

// GET request to update RestaurantWare
router.get("/restaurantware/:id/update", restaurantware_controller.restaurantware_update_get);

// POST request to update RestaurantWare
router.post("/restaurantware/:id/update", restaurantware_controller.restaurantware_update_post);

// GET request for one RestaurantWare
router.get("/restaurantware/:id", restaurantware_controller.restaurantware_detail);

module.exports = router;