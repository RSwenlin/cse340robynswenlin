const pool = require("../database/")


/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getInventoryByClassificationId error " + error)
    }
  }

  async function getVehicleById(vehicleId) {
    try {
        const result = await pool.query(
            `SELECT * From public.inventory WHERE inventory_id = $1`,
            [vehicleIdId]
        );

        if (result.rows.length === 0) {
            return null; 
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error fetching vehicle by Id:', error);
        throw error;
    }
  }


module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById};