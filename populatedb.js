#! /usr/bin/env node
require("dotenv").config();
console.log('This script populates some test ingredients, recipes, restaurantwares, and suppliers to your database');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Ingredient = require("./models/ingredient");
const Recipe = require("./models/recipe");
const RestaurantWare = require("./models/restaurantware");
const Supplier = require("./models/supplier");

const ingredients = [];
const recipes = [];
const restaurantwares = [];
const suppliers = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    // Delete existing data
    await deleteIngredients();
    await deleteRecipes();
    await deleteRestaurantWares();
    await deleteSuppliers();
    await createSuppliers();
    await createIngredients();
    await createRecipes();
    await createRestaurantWares();
    mongoose.connection.close();
}

async function deleteIngredients() {
    await Ingredient.deleteMany({});
}

async function deleteRecipes() {
    await Recipe.deleteMany({});
}

async function deleteRestaurantWares() {
    await RestaurantWare.deleteMany({});
}

async function deleteSuppliers() {
    await Supplier.deleteMany({});
}

async function IngredientCreate(index, name, type, cost, quantity, critical, supplierIndex) {
    const supplier = suppliers[supplierIndex]; // Fetch the correct Supplier document based on index

    const ingredientdetail = {
        name: name, type: type, cost: cost, quantity: quantity, critical: critical, supplier: supplier,
    };

    const ingredient = new Ingredient(ingredientdetail);

    await ingredient.save();
    ingredients.push(ingredient); // Use push instead of assigning to a specific index
    console.log(`Added ingredient: ${name}`);
}

async function RecipeCreate(index, name, ingr_list, prep_time, price) {
    const recipedetail = { name: name, ingr_list: ingr_list, prep_time: prep_time, price: price };

    const recipe = new Recipe(recipedetail);

    await recipe.save();
    recipes.push(recipe); // Use push instead of assigning to a specific index
    console.log(`Added Recipe: ${name}`);
}

async function RestaurantWareCreate(index, name, type, cost, stock, critical, supplierIndex) {
    const supplier = suppliers[supplierIndex]; // Fetch the correct Supplier document based on index

    const restaurantwaredetail = { name: name, type: type, cost: cost, stock: stock, critical: critical, supplier: supplier };

    const restaurantware = new RestaurantWare(restaurantwaredetail);

    await restaurantware.save();
    restaurantwares.push(restaurantware); // Use push instead of assigning to a specific index
    console.log(`Added RestaurantWare: ${name}`);
}

async function SupplierCreate(index, name, address, tel) {
    const supplierdetail = { name: name, address: address, tel: tel };

    const supplier = new Supplier(supplierdetail);

    await supplier.save();
    suppliers.push(supplier); // Use push instead of assigning to a specific index
    console.log(`Added Supplier: ${name}`);
}

async function createIngredients() {
    console.log("Adding Ingredients");
    await Promise.all([
        IngredientCreate(0, "tomato", "fruit", 10, 100, 25, 0),
        IngredientCreate(1, "lettuce", "fruit", 12, 100, 25, 0),
        IngredientCreate(2, "onions", "fruit", 6, 100, 25, 0),
        IngredientCreate(3, "bread", "bread", 6, 100, 25, 2),
        IngredientCreate(4, "beef", "meet", 6, 100, 25, 1),
        IngredientCreate(5, "egg", "poultry", 6, 100, 25, 1),
    ]);
}

async function createRecipes() {
    console.log("Adding Recipes");
    await Promise.all([
        RecipeCreate(0, "Salad", [ingredients[0], ingredients[1], ingredients[2]], "10 min", 24),
        RecipeCreate(1, "Omelet", [ingredients[0], ingredients[1], ingredients[2], ingredients[5]], "6 min", 17),
        RecipeCreate(2, "Hamburger", [ingredients[0], ingredients[1], ingredients[2], ingredients[3], ingredients[4], ingredients[5]], "15 min", 29),
    ]);
}

async function createRestaurantWares() {
    console.log("Adding RestaurantWares");
    await Promise.all([
        RestaurantWareCreate(0, "fork", "tableware", 10, 40, 20, 2),
        RestaurantWareCreate(1, "knife", "tableware", 10, 40, 20, 0),
        RestaurantWareCreate(2, "plate", "tableware", 15, 30, 20, 1),
    ]);
}

async function createSuppliers() {
    console.log("Adding Suppliers");
    await Promise.all([
        SupplierCreate(0, "SIAGRO", "Av. Malick Sy, Dakar", "+221 33 849 56 66"),
        SupplierCreate(1, "Agroline", "km 11, Rte de Rufisque, Dakar 11000", "+221 33 879 12 00"),
        SupplierCreate(2, "SENICO", "Bargny", "+221 33 879 18 03"),
    ]);
}
