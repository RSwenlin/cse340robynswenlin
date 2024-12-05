// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities')
const inventoryModel = require('../models/inventory-model');


// Route to build inventory by classification view (GET)
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to get a specific vehicle's detail by ID (GET)
router.get('/detail/:inventoryId', invController.getInventoryDetails);

// Route to display the inventory management page (GET)
router.get('/management', invController.buildManagementView);
router.get('/', invController.buildManagementView);

// Route to display the add classification form (GET)
router.get("/add-classification", invController.addClassificationForm);

// Route to process the add classification form (POST)
router.post("/add-classification", invController.processAddClassification);

// Route to display the add inventory form (GET)
router.get("/add-inventory", invController.addInventoryForm);

// Route to process the add inventory form (POST)
router.post("/add-inventory", 
  utilities.handleErrors(invController.processAddInventory)
);

// Route to display the edit inventory form (GET)
router.get("/edit/:inv_id", 
  utilities.handleErrors(invController.editInventoryView)
);

// Route to process inventory updates (POST)
router.post("/update/", invController.updateInventory);


// Route to display add inventory form based on classification
router.get("/add-inventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

module.exports = router;






