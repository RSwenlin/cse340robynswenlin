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

/* *******************************
* Deleting a review (POST)
* ******************************* */

module.exports = router;