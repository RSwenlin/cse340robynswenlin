const utilities = require('../utilities/')
const reviewModel = require('../models/review-model')
const reviewController = {};



/* *******************************
* Adding a review ()
* ******************************* */

async function addReview(req, res) {
    let nav = await utilities.getNav()
    const account_id = req.session.accountId
    const {
    review_text,
    review_date,
    inv_id

    } = req.body


const newReview = await reviewModel.addReview
(review_text, review_date, inv_id, account_id);

res.redirect(`/inv/detail/${inv_id}`);

}




/* *******************************
* Updating a review and form for review()
* ******************************* */
async function showUpdateReviewForm(req, res) {
    let nav = await utilities.getNav()
    const reviewId = req.params;
    const review = await reviewModel.getReviewsByInventoryId(reviewId)
    res.render('reviews/update-review', { review})
}
async function updateReview(req, res) {
    const reviewId = req.params;
    const review_text = req.body;

    const updateReview = await reviewModel.updateReview(reviewId, review_text)
    res.redirect(`/inv/detail/${updatedReview.inventoryId}`)
}

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