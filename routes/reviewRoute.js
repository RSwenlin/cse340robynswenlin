const express = require("express")
const router = new express.Router() 
const reviewController = require("../controllers/reviewController");

/* *******************************
* Define routes
* Ensure that routes requiring
* authentication are protected
* using middleware.
* ******************************* */


/* *******************************
* Adding a review(POST)
* ******************************* */
router.post("/add", reviewController.addReview);

/* *******************************
* Editing a review(GET and POST)
* ******************************* */
router.get('/update/:reviewId', reviewController.showUpdateReviewForm)
router.post('/update/:reviewId', reviewController.updateReview)
/* *******************************
* Deleting a review (POST)
* ******************************* */
router.post('/delete/:reviewId', reviewController.deleteReview)

module.exports = router;