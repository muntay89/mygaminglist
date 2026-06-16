import ReviewsDAO from "../dao/reviewsDAO.js"

export default class ReviewsController {
  static async apiPostReview(req, res, next) {
    try {
      const gameId = parseFloat(req.body.gameId)
      const review = req.body.review
      const { id: userId, username } = req.session.user;
      const rating = parseFloat(req.body.rating)
      console.log("session user:", req.session?.user);
      console.log("req.userId:", req.userId);
      const reviewResponse = await ReviewsDAO.addReview(
        gameId,
        userId,
        username,
        review,
        rating,
      )
      console.log(reviewResponse)
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
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiGetReviews(req, res, next) {
    try {
      let gameId = Number(req.params.id) || {}
      let reviews = await ReviewsDAO.getReviewsBygameId(gameId)
      if (Number.isNaN(gameId)) return res.status(400).json({ error: "Invalid gameId" })
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
    try{
      let gameId = Number(req.params.id) || {}
      let { id: userId, username } = req.session.user || {}
      let reviews = await ReviewsDAO.getReviewsByIdAndUser(gameId, userId)
      if (!userId) return res.status(401).json({ error: "Unauthorized" })
      if (Number.isNaN(gameId)) return res.status(400).json({ error: "Invalid gameId" })
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