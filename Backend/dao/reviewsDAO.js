import { ObjectId } from "mongodb"



let reviews

export default class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) {
      return
    }
    try {
      reviews = await conn.db("reviews").collection("reviews")
      await reviews.createIndex(
        {
          userId: 1,
          gameId: 1
        },
        {
          unique: true
        }
      )
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`)
    }
  }

  static async addReview(gameId, gameTitle, gameImage, userId, username, review, rating) {
    try {
      const reviewDoc = {
        gameId: gameId,
        gameTitle: gameTitle,
        gameImage: gameImage,
        userId: new ObjectId(userId),
        username: username,
        review: review,
        rating: rating,
        createdAt: new Date(),
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
        { _id: new ObjectId(reviewId), userId: new ObjectId(user) },
        { $set: { review: review, rating: rating } }
      )

      return updateResponse
    } catch (e) {
      console.error(`Unable to update review: ${e}`)
      return { error: e }
    }
  }

  static async deleteReview(reviewId, user) {
    const objectId = new ObjectId(reviewId)
    try {
      const deleteResponse = await reviews.deleteOne({ _id: new ObjectId(reviewId), 
        userId: new ObjectId(user) })
      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete review: ${e}`)
      return { error: e }
    }
  }

  static async getReviewsBygameId( gameId) {
    try {
      const cursor = await reviews.find({gameId: parseInt(gameId) })
      return cursor.toArray()
    } catch (e) {
      console.error(`Unable to get review: ${e}`)
      return { error: e }
    }
  }

  static async getReviewsByUser( userId) {
    try {
      const cursor = await reviews.find({userId: new ObjectId(userId)})
      return cursor.toArray()
    } catch (e) {
      console.error(`Unable to get review: ${e}`)
      return { error: e }
    }
  }

  static async getReviewsByIdAndUser(gameId, userId) {
    try {
      const cursor = await reviews.find({gameId: parseInt(gameId), userId: new ObjectId(userId)})
      return cursor.toArray()
    } catch (e) {
      console.error(`Unable to get review: ${e}`)
      return { error: e }
    }
  }

}