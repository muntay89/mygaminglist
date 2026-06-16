import express from 'express'
import ReviewsController from '../api/reviews.controller.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

router.route("/game/:id").get(ReviewsController.apiGetReviews)
router.route("/my/game/:id").get(ReviewsController.apiGetReviewsByUser)
router.route("/new").post(requireAuth, ReviewsController.apiPostReview)
router.route("/:id")
    .get(ReviewsController.apiGetReview)
    .put(requireAuth, ReviewsController.apiUpdateReview)
    .delete(requireAuth, ReviewsController.apiDeleteReview)


export default router