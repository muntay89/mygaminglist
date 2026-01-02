import { ObjectId } from "mongodb"

let list

export default class ListDAO {
    static async injectDB(conn) {
      if (list) {
        return
      }
      try {
        list = await conn.db("list").collection("list")
      } catch (e) {
        console.error(`Unable to establish collection handles in userDAO: ${e}`)
      }
    }

    static async addList(gameId, user, status, name, card) {
        try {
        const listDoc = {
            gameId: gameId,
            user: user,
            status: status,
            name: name,
            card: card,
        }
        console.log("adding")
        return await list.insertOne(listDoc)
        } catch (e) {
        console.error(`Unable to post review: ${e}`)
        return { error: e }
        }
    }

    static async getList(listId) {
        const objectId = new ObjectId(listId);
        try {
          return await reviews.findOne({ _id: objectId })
        } catch (e) {
          console.error(`Unable to get review: ${e}`)
          return { error: e }
        }
      }

    
      static async updateList(listId, user, status, name) {
        const objectId = new ObjectId(listId)
        try {
          const updateResponse = await list.updateOne(
            { _id: objectId },
            { $set: { user: user, status: status, name: name,  } }
          )
    
          return updateResponse
        } catch (e) {
          console.error(`Unable to update review: ${e}`)
          return { error: e }
        }
      }


      static async deleteList(listId) {
        const objectId = new ObjectId(listId)
        try {
          const deleteResponse = await list.deleteOne({
            _id: objectId,
          })
    
          return deleteResponse
        } catch (e) {
          console.error(`Unable to delete review: ${e}`)
          return { error: e }
        }
      }

      static async getListByUser(user) {
        try {
          const cursor = await list.find({ user: user })
          return cursor.toArray()
        } catch (e) {
          console.error(`Unable to get review: ${e}`)
          return { error: e }
        }
      }

      static async getEntry(gameId) {
        try {
          const cursor = await list.find({gameId: parseInt(gameId) })
          return cursor.toArray()
        } catch (e) {
          console.error(`Unable to get review: ${e}`)
          return { error: e }
        }
      }

      static async getListByStatus(status){
        try{
          const cursor = await list.find({status: status})
          return cursor.toArray()
        } catch(e) {
          console.error(`Unable to get review: ${e}`)
          return {error: e}
        }
      }

}