import { ObjectId } from "mongodb"



let reviews

export default class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) {
      return
    }
    try {
      reviews = await conn.db("reviews").collection("reviews")
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`)
    }
  }

  static async addReview(gameId, user, review, rating) {
    try {
      const reviewDoc = {
        gameId: gameId,
        user: user,
        review: review,
        rating: rating,
      }
      console.log("adding")
      return await reviews.insertOne(reviewDoc)
    } catch (e) {
      console.error(`Unable to post review: ${e}`)
      return { error: e }
    }
  }

  static async getReview(reviewId) {
    const objectId = new ObjectId(reviewId);
    try {
      return await reviews.findOne({ _id: objectId })
    } catch (e) {
      console.error(`Unable to get review: ${e}`)
      return { error: e }
    }
  }

  static async updateReview(reviewId, user, review, rating) {
    const objectId = new ObjectId(reviewId)
    try {
      const updateResponse = await reviews.updateOne(
        { _id: objectId },
        { $set: { user: user, review: review, rating: rating } }
      )

      return updateResponse
    } catch (e) {
      console.error(`Unable to update review: ${e}`)
      return { error: e }
    }
  }

  static async deleteReview(reviewId) {
    const objectId = new ObjectId(reviewId)
    try {
      const deleteResponse = await reviews.deleteOne({
        _id: objectId,
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete review: ${e}`)
      return { error: e }
    }
  }

  static async getReviewsBygameId(gameId) {
    try {
      const cursor = await reviews.find({ gameId: parseInt(gameId) })
      return cursor.toArray()
    } catch (e) {
      console.error(`Unable to get review: ${e}`)
      return { error: e }
    }
  }

}