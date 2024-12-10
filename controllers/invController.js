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
    inv_make,
    inv_model,
    inv_year,
    classification_id,
    inv_price,
    inv_miles,
    inv_description,
    inv_color,
    inv_image
 } = req.body;

  // Validate form data (basic validation for all fields)
  if (!inv_make || !inv_model || !inv_year || !classification_id || 
    !inv_price || !inv_miles || !inv_description ||
    !inv_color || !inv_image) {
    req.flash("notice", "All fields are required.");
    return res.redirect("/inv/add-inventory");
  }

  // Call model function to insert new inventory
  const result = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    classification_id,
    inv_price,
    inv_miles,
    inv_description,
    inv_color,
    inv_image
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
  /* ***************************
 *  Build edit Inventory View
 * *************************** */


  invCont.editInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryById(inv_id);
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
    });
  };
  
  invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    } = req.body;
  
    const updateResult = await invModel.updateInventory(
      inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id
    );
  
    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model;
      req.flash("notice", `The ${itemName} was successfully updated.`);
      res.redirect("/inv/");
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id);
      req.flash("notice", "Sorry, the update failed.");
      res.status(501).render("inventory/edit-inventory", {
        title: `Edit ${inv_make} ${inv_model}`,
        nav,
        classificationSelect,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
      });
    }
  };
/* *******************************
* Fetch reviews along with inv details ()
* ******************************* */
  

module.exports = invCont;




