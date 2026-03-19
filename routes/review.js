const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn, validateReview, isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");

// add review
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));
module.exports = router;