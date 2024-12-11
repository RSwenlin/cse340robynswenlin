const pool = require("../database/")
/* *******************************
* Use prepared statements for database operations:
* ******************************* */

/* *******************************
* add new review.
* ******************************* */
async function addReview(review_id, review_text, review_date, inv_id, account_id){
      const sql = `
      INSERT INTO review (review_text, review_date, inv_id, account_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
      const result = await pool.query(sql, [review_id, review_text, review_date, inv_id, account_id])
    return result.rows[0];
    }
  
/* *******************************
* Update existing review.
* ******************************* */
async function getReviewsByInventoryId(inv_id) {
    try {
      const result = await pool.query(
        `SELECT review_text, review_date,  FROM public.inventory WHERE review_inv_id = $1,
        ORDER BY review_date DESC`,
        [vehicleId]
      );
      return result.rows[0];   
    } catch (error) {
  }
}   

/* *******************************
* Delete review by ID.
* ******************************* */

/* **************************************
* Fetch reviews for inventory or account.
* ************************************* */

module.exports = {
    addReview,
    getReviewsByInventoryId
}