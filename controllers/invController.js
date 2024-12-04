const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Get inventory details by vehicle ID
 * ************************** */
invCont.getInventoryDetails = async function (req, res, next) {
  const { inventoryId } = req.params;
  try {
    const vehicle = await invModel.getVehicleById(inventoryId);
    if (!vehicle) {
      const error = new Error('Vehicle not found');
      error.status = 404;
      throw error;
    }
    const nav = await utilities.getNav();
    const vehicleHTML = await utilities.buildVehicleHTML(vehicle);

    res.render('inventory/details', {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleHTML,
    });
  } catch (err) {
    next(err); 
  }
};

/* ***************************
 *  Add new classification form
 * ************************** */
invCont.addClassificationForm = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("inventory/addClassification", {
    title: "Add New Classification",
    nav,
    messages: req.flash("notice"),
  });
};

/* ***************************
 *  Process new classification form
 * ************************** */
invCont.processAddClassification = async function (req, res) {
  const { classification_name } = req.body;

  // Validate classification name (no spaces or special characters)
  const isValid = /^[a-zA-Z0-9]+$/.test(classification_name); // Only alphanumeric characters allowed
  if (!isValid) {
    req.flash(
      "notice",
      "Classification name can only contain letters and numbers, no spaces or special characters."
    );
    return res.redirect("/inv/add-classification");
  }

  // Call model function to insert new classification
  const result = await invModel.addClassification(classification_name);

  if (result) {
    req.flash("notice", "New classification added successfully!");
    res.redirect("/inv/management"); // Redirect to the inventory management page
  } else {
    req.flash("notice", "Failed to add new classification.");
    res.redirect("/inv/add-classification");
  }
};

/* ***************************
 *  Add new inventory form
 * ************************** */
invCont.addInventoryForm = async function (req, res) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();

  res.render("inventory/addInventory", {
    title: "Add New Inventory Item",
    nav,
    classificationList,
    messages: req.flash("notice"),
  });
};

/* ***************************
 *  Process new inventory form
 * ************************** */
invCont.processAddInventory = async function (req, res) {
  const { 
    vehicle_make,
    vehicle_model,
    vehicle_year,
    classification_id,
    vehicle_price,
    vehicle_miles,
    vehicle_description,
    vehicle_color,
    vehicle_image
 } = req.body;

  // Validate form data (basic validation for all fields)
  if (!vehicle_make || !vehicle_model || !vehicle_year || !classification_id || 
    !vehicle_price || !vehicle_miles || !vehicle_description ||
    !vehicle_color || !vehicle_image) {
    req.flash("notice", "All fields are required.");
    return res.redirect("/inv/add-inventory");
  }

  // Call model function to insert new inventory
  const result = await invModel.addInventory(
    vehicle_make,
    vehicle_model,
    vehicle_year,
    classification_id,
    vehicle_price,
    vehicle_miles,
    vehicle_description,
    vehicle_color,
    vehicle_image
  );

  if (result) {
    req.flash("notice", "New inventory item added successfully!");
    res.redirect("/inv/management"); // Redirect to the inventory management page
  } else {
    req.flash("notice", "Failed to add new inventory item.");
    res.redirect("/inv/add-inventory");
  }
};

/* ***************************
 *  Build vehicle management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav();

    const classificationSelect = await utilities.buildClassificationList();

    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect,
    });
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
  }
  
  

module.exports = invCont;




