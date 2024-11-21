// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to get a specific vehicle's detail by ID
router.get('/detail/:inventoryId', invController.getInventoryDetails);

module.exports = router;





