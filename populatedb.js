#! /usr/bin/env node

console.log(
    'This script populates some test ingredients, recipes, restaurantwares and suppliers to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
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
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createSuppliers();
    await createIngredients();
    await createRecipes();
    await createRestaurantWares();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  async function IngredientCreate(index, name, type, cost, quantity, critical, supplier) {
    const ingredientdetail = {
      name: name, type: type, cost: cost, quantity: quantity, critical: critical, supplier: supplier,
    };
  
    const ingredient = new Ingredient(ingredientdetail);

    await ingredient.save();
    ingredients[index] = ingredient;
    console.log(`Added ingredient: ${name}`);
  }
  
  async function RecipeCreate(index, name, ingr_list, prep_time, price) {
    const recipedetail = { name: name, ingr_list: ingr_list, prep_time: prep_time, price: price};
  
    const recipe = new Recipe(recipedetail);
  
    await recipe.save();
    recipes[index] = recipe;
    console.log(`Added Recipe: ${name}`);
  }
  
  async function RestaurantWareCreate(index, name, type, cost, stock, critical, supplier) {
    const restaurantwaredetail = { name: name, type: type, cost: cost, stock: stock, critical: critical, supplier: supplier};
  
    const restaurantware = new RestaurantWare(restaurantwaredetail);
  
    await restaurantware.save();
    restaurantwares[index] = restaurantware;
    console.log(`Added RestaurantWare: ${name}`);
  }
  
  async function SupplierCreate(index, name, address, tel) {
    const supplierdetail = { name: name, address: address, tel: tel};
  
    const supplier = new Supplier(supplierdetail);
  
    await supplier.save();
    suppliers[index] = supplier;
    console.log(`Added Supplier: ${name}`);
  }

  async function createIngredients() {
    console.log("Adding Ingredients");
    await Promise.all([
      IngredientCreate(0, "tomato", "fruit", 10, 100, 25, suppliers[0]
      ),
      IngredientCreate(1, "lettuce", "fruit", 12, 100, 25, suppliers[0]
      ),
      IngredientCreate(2, "onions", "fruit", 6, 100, 25, suppliers[0]
      ),
      IngredientCreate(3, "bread", "bread", 6, 100, 25, suppliers[2]
      ),
      IngredientCreate(4, "beef", "meet", 6, 100, 25, suppliers[1]
      ),
      IngredientCreate(5, "egg", "poultry", 6, 100, 25, suppliers[1]
      ),
    ]);
  }

  async function createRecipes() {
    console.log("Adding Recipes");
    await Promise.all([
      RecipeCreate(0, "Salad", [ingredients[0], ingredients[1], ingredients[2]], "10 min", 24),
      RecipeCreate(1, "Omelet", [ingredients[0], ingredients[1], ingredients[2], ingredients[5]], "6 min", 17),
      RecipeCreate(0, "Hamburger", [ingredients[0], ingredients[1], ingredients[2],ingredients[3], ingredients[4], ingredients[5]], "15 min", 29),
    ]);
  }
  
  async function createRestaurantWares() {
    console.log("Adding RestaurantWares");
    await Promise.all([
      RestaurantWareCreate(0, "fork", "", 10, 40, 20, suppliers[2]),
      RestaurantWareCreate(0, "knife", "", 10, 40, 20, suppliers[0]),
      RestaurantWareCreate(0, "plate", "", 15, 30, 20, suppliers[1])
    ]);
  }
  
  async function createSuppliers() {
    console.log("Adding Recipes");
    await Promise.all([
      SupplierCreate(0, "SIAGRO", "Av. Malick Sy, Dakar","+221 33 849 56 66"),
      SupplierCreate(1, "Agroline", "km 11, Rte de Rufisque, Dakar 11000","+221 33 879 12 00"),
      SupplierCreate(2, "SENICO", "Bargny","+221 33 879 18 03")
    ]);
  }
  