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

    static async addList(gameId, user, status, name, rating, card, favorite = false) {
        try {
        const listDoc = {
            gameId: gameId,
            user: user,
            status: status,
            name: name,
            rating: rating, 
            card: card,
            favorite: favorite,
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
        return await list.findOne({ _id: objectId });
      } catch (e) {
        console.error(`Unable to get list entry: ${e}`);
        return { error: e };
      }
    }


    
      static async updateList(listId, user, status, name, rating, favorite) {
        const objectId = new ObjectId(listId)
        try {
          const updateFields = {};
          if (status !== undefined) updateFields.status = status;
          if (name !== undefined) updateFields.name = name;
          if (rating !== undefined) updateFields.rating = rating;
          if (favorite !== undefined) updateFields.favorite = favorite;
          const updateResponse = await list.updateOne(
            { _id: objectId, user: user },
            { $set: updateFields }
          )
    
          return updateResponse
        } catch (e) {
          console.error(`Unable to update review: ${e}`)
          return { error: e }
        }
      }


      static async deleteList(listId, user) {
        const objectId = new ObjectId(listId)
        try {
          const deleteResponse = await list.deleteOne({
            _id: objectId, user: user
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

      static async getEntry(userId, gameId) {
        try {
          const cursor = await list.find({user: userId, gameId: parseInt(gameId) })
          return cursor.toArray()
        } catch (e) {
          console.error(`Unable to get review: ${e}`)
          return { error: e }
        }
      }

      static async getListByStatus(userId, status){
        try{
          const cursor = await list.find({user: userId, status: status})
          return cursor.toArray()
        } catch(e) {
          console.error(`Unable to get review: ${e}`)
          return {error: e}
        }
      }

      static async getFavorites(userId){
        try{
          const cursor = await list.find({user: userId, favorite: true})
          return cursor.toArray()
        } catch(e) {
          console.error(`Unable to get favorites: ${e}`);
          return { error: e };
        }
      }

      static async getProfileStats(userId){
        try{
          return await list.aggregate([
           {
            $match: {
              user: userId
            } 
           }, 
           {
            $group: {
              _id: '$status',
              count: {
                $sum: 1
              }
            }
           }
          ]).toArray()
        } catch (e) {
          return {error: e}
        }
      }

}