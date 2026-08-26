import ReviewsDAO from "../dao/reviewsDAO.js"
import ListDAO from "../dao/listDAO.js"

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
      const gameId = Number(req.body.gameId)
      const gameTitle = String(req.body.gameTitle || '').trim()
      const gameImage = req.body.gameImage
      const review = String(req.body.review || '').trim()
      const { id: userId, username } = req.session.user;
      const rating = Number(req.body.rating)

      if (!Number.isInteger(gameId) || gameId <= 0) {
        return res.status(400).json({
          error: "Invalid game ID",
        })
      }

      if (!gameTitle || gameTitle.length > 200) {
        return res.status(400).json({
          error: "Invalid game title",
        })
      }

      if (!review) {
        return res.status(400).json({
          error: "Review cannot be empty",
        })
      }

      if (review.length > 5000) {
        return res.status(400).json({
          error: "Review cannot exceed 5000 characters",
        })
      }

      if (!ReviewsController.isValidHalfStarRating(rating)) {
        return res.status(400).json({ error: "Rating must be between 0.5 and 5 in 0.5 increments" });
      }

      const existingReviews = await ReviewsDAO.getReviewsByIdAndUser(gameId, userId)
      if (existingReviews?.length > 0) {
        return res.status(409).json({error: 'You have already reviewed this game'})
      }

      const reviewResponse = await ReviewsDAO.addReview(
        gameId,
        gameTitle,
        gameImage, 
        userId,
        username,
        review,
        rating,
      )
      const listResult = await ListDAO.upsertFromReview(
        userId,
        gameId,
        gameTitle,
        gameImage, 
        rating
      )
      if (listResult?.error) {
            throw listResult.error
        }

        return res.status(201).json({
            status: "success"
        })
    } catch (e) {
      if (e.code === 11000){
        return res.status(409).json({error: 'You have already reviewed this game'})
      }
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
      const reviewId = req.params.id
      const review = String(req.body.review || "").trim()
      const userId = req.userId
      const rating = Number(req.body.rating)
      const existingReview = await ReviewsDAO.getReview(reviewId)

      if (!existingReview){
        return res.status(404).json({
          error: 'Review not found'
        })
      }

      if (!review) {
        return res.status(400).json({
          error: "Review cannot be empty",
        })
      }

      if (review.length > 5000) {
        return res.status(400).json({
          error: "Review cannot exceed 5000 characters",
        })
      }
      if (!ReviewsController.isValidHalfStarRating(rating)) {
          return res.status(400).json({ error: "Rating must be between 0.5 and 5 in 0.5 increments" });
        }
      const reviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        userId,
        review,
        rating
      );

      if (reviewResponse?.error) {
        return res.status(400).json({ error: reviewResponse.error });
      }

      if (reviewResponse.matchedCount === 0) {
        return res.status(404).json({ error: "review not found" });
      }

      const updateList = await ListDAO.upsertFromReview(
        userId,
        existingReview.gameId,
        existingReview.gameTitle,
        existingReview.gameImage,
        rating
      )

      if (updateList?.error) {
        throw updateList.error
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