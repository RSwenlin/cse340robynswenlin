const utilities = require('../utilities/')
const reviewModel = require('../models/review-model')
const reviewController = {};



/* *******************************
* Adding a review ()
* ******************************* */

async function addReview(req, res) {
    let nav = await utilities.getNav()
    const {
    review_text,
    review_date,
    inv_id,
    account_id

    } = req.body


const newReview = await review-model.addReview
(review_text, review_date, inv_id, account_id);

}




/* *******************************
* Updating a review ()
* ******************************* */



/* *******************************
* Deleting a review ()
* ******************************* */


/* *******************************
* Fetching reviews ()
* detail-view and client admin
* ******************************* */
module.exports = {
addReview,
//updateReview,
//deleteReview

}