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
    const { reviewId } = req.params;
    const review = await reviewModel.getReviewsByInventoryId(reviewId)
    res.render('reviews/update-review', { review, nav})
}
async function updateReview(req, res) {
    const reviewId = req.params.reviewId
    const review_text = req.body.review_text
    const inventoryId = req.body.inventoryId

     await reviewModel.updateReview(reviewId, review_text)
   
     res.redirect(`/inv/detail/${inventoryId}`)
}

/* *******************************
* Deleting a review ()
* ******************************* */
async function deleteReview(req, res) {
    let nav = await utilities.getNav()
    const reviewId = req.params.reviewId
    const inventoryId = req.body.inventoryId

    await reviewModel.deleteReview(reviewId)
    
    res.redirect(`/inv/detail/${inventoryId}`)

}

/* *******************************
* Fetching reviews ()
* detail-view and client admin
* ******************************* */
module.exports = {
addReview,
updateReview,
showUpdateReviewForm,
deleteReview

}