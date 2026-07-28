import ReviewsDAO from "../dao/reviewsDAO.js"

export default class ReviewsController {
  
  static isValidHalfStarRating(rating) {
    return (
    Number.isFinite(rating) &&
    rating >= 0.5 &&
    rating <= 5 &&
    rating * 2 === Math.floor(rating * 2)
  )
  }

  static async apiPostReview(req, res, next) {
    try {
      const gameId = parseFloat(req.body.gameId)
      const gameTitle = req.body.gameTitle
      const review = req.body.review
      const { id: userId, username } = req.session.user;
      const rating = parseFloat(req.body.rating)
      if (!ReviewsController.isValidHalfStarRating(rating)) {
        return res.status(400).json({ error: "Rating must be between 0.5 and 5 in 0.5 increments" });
      }
      const reviewResponse = await ReviewsDAO.addReview(
        gameId,
        gameTitle, 
        userId,
        username,
        review,
        rating,
      )
      console.log('review', req.body.gameTitle)
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiGetReview(req, res, next) {
    try {
      let id = req.params.id || {}
      let review = await ReviewsDAO.getReview(id)
      if (!review) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(review)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiUpdateReview(req, res, next) {
  try {
    const reviewId = req.params.id;
    const review = req.body.review;
    const user = req.userId;
    const rating = parseFloat(req.body.rating);
    if (!ReviewsController.isValidHalfStarRating(rating)) {
        return res.status(400).json({ error: "Rating must be between 0.5 and 5 in 0.5 increments" });
      }
    const reviewResponse = await ReviewsDAO.updateReview(
      reviewId,
      user,
      review,
      rating
    );

    if (reviewResponse?.error) {
      return res.status(400).json({ error: reviewResponse.error });
    }

    if (reviewResponse.matchedCount === 0) {
      return res.status(404).json({ error: "review not found" });
    }

    return res.json({ status: "success" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}


  static async apiDeleteReview(req, res, next) {
    try {
      const reviewId = req.params.id
      const user = req.userId
      const reviewResponse = await ReviewsDAO.deleteReview(reviewId, user)
      if (reviewResponse.deletedCount === 0) {
        return res.status(404).json({
          error: 'Review not found',
        })
      }
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiGetReviews(req, res, next) {
    try {
      const gameId = Number(req.params.id)
      if (!Number.isInteger(gameId) || gameId <= 0) {
        return res.status(400).json({ error: "Invalid gameId" })
      }
      let reviews = await ReviewsDAO.getReviewsBygameId(gameId)
      if (!reviews) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(reviews)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiGetReviewsByUser(req, res, next) {
    try {
      let { id: userId, username } = req.session.user || {}
      if (!userId) return res.status(401).json({ error: "Unauthorized" })
      let reviews = await ReviewsDAO.getReviewsByUser(userId)
      if (!reviews) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(reviews)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }


  static async apiGetReviewsByGameAndUser(req, res, next) {
    try{
      const gameId = Number(req.params.id)
      let { id: userId, username } = req.session.user || {}
      if (!userId) return res.status(401).json({ error: "Unauthorized" })
      if (!Number.isInteger(gameId) || gameId <= 0) {
        return res.status(400).json({ error: "Invalid gameId" })
      }
      let reviews = await ReviewsDAO.getReviewsByIdAndUser(gameId, userId)
      if (!reviews) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(reviews)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}