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
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id
       WHERE i.classification_id = $1`, 
      [classification_id]
    );
    return data.rows; 
  } catch (error) {
    console.error("getclassificationsbyid error" + error)
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
/* ***************************
 * update inventory item
 * ************************** */

async function updateInventory(
  inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id
) {
  try {
    const sql = `
      UPDATE public.inventory 
      SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 
      WHERE inv_id = $11 
      RETURNING *`;
    
    const data = await pool.query(sql, [
      inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id
    ]);

    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}


module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  addInventory,
  updateInventory
};
