// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const inventoryModel = require('../models/inventory-model');

// Route to build inventory by classification view (GET)
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to get a specific vehicle's detail by ID (GET)
router.get('/detail/:inventoryId', invController.getInventoryDetails);

// Route to display the inventory management page (GET)
//router.get('/management', invController.buildInventoryManagement);

// Route to display the add classification form (GET)
router.get("/add-classification", invController.addClassificationForm);

// Route to process the add classification form (POST)
router.post("/add-classification", invController.processAddClassification);

// Route to display the add inventory form (GET)
router.get("/add-inventory", invController.addInventoryForm);

// Route to process the add inventory form (POST)
router.post("/add-inventory", invController.processAddInventory);


module.exports = router;





