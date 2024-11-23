const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

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
        const vehicleHTML =  await utilities.buildVehicleHTML(vehicle);

        res.render('inventory/details', {
            title: `${vehicle.inv_make} ${vehicle.inv_model}`,
            nav,
            vehicleHTML,
        });
    } catch (err) {
        next(err); 
    }
};

module.exports = invCont; 

