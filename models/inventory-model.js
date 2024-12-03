const pool = require("../database/");

/* ***************************
 * Get all classifications data
 * ************************** */
async function getClassifications() {
  try {
    const result = await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
    return result.rows;  // Ensure to return the rows
  } catch (error) {
    console.error("Error fetching classifications: ", error);
    throw error;  // Rethrow error to be handled by the calling function
  }
}

/* ***************************
 * Get all inventory items by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const result = await pool.query(
      `SELECT * FROM public.inventory AS i
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id
       WHERE i.classification_id = $1`, 
      [classification_id]
    );
    return result.rows;  // Return rows with inventory data
  } catch (error) {
    console.error("Error fetching inventory by classification ID:", error);
    throw error;  // Rethrow to be handled by the controller
  }
}

/* ***************************
 * Get inventory details by vehicle ID
 * ************************** */
async function getVehicleById(vehicleId) {
  try {
    const result = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`, 
      [vehicleId]
    );
    return result.rows[0];  // Return the first result (the vehicle itself)
  } catch (error) {
    console.error("Error fetching vehicle by ID:", error);
    throw error;  // Rethrow to be handled by the controller
  }
}

/* ***************************
 * Add a new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const result = await pool.query(
      `INSERT INTO public.classification (classification_name) 
       VALUES ($1) RETURNING *`, 
      [classification_name]
    );
    return result.rows[0];  // Return the inserted classification
  } catch (error) {
    console.error("Error adding classification:", error);
    throw error;  // Rethrow error to be handled by the controller
  }
}

/* ***************************
 * Add a new inventory item
 * ************************** */
async function addInventory(vehicle_make, vehicle_model, vehicle_year, classification_id, price, miles, description, color, image) {
  try {
    const result = await pool.query(
      `INSERT INTO public.inventory (inv_make, inv_model, inv_year, classification_id, inv_price, inv_miles, inv_description, inv_color, inv_image) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, 
      [vehicle_make, vehicle_model, vehicle_year, classification_id, price, miles, description, color, image]
    );
    return result.rows[0];  // Return the inserted inventory item
  } catch (error) {
    console.error("Error adding inventory item:", error);
    throw error;  // Rethrow error to be handled by the controller
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  addInventory
};
