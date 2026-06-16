import { ObjectId } from "mongodb";

let users

export default class UsersDao{
    static async injectDB(conn) {
    if (users) {
      return
    }
    try {
      users = await conn.db("users").collection("users")
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`)
    }
  }


    static async findById(userId){
        try{
            if (!users) {
                throw new Error("UsersDAO not initialized. Did you call injectDB?")
            }
            const _id = new ObjectId(userId)
            return await users.findOne({_id}, {projection: {passwordHash: 0}})
        } catch (e) {
            console.error(`Unable to find user by id: ${e}`);
            return null;
        }
    }

    static async findByUsername(username) {
        try{
            if (!users){
                throw new Error("UsersDAO not initialized. Did you call injectDB?")
            }
            return await users.findOne({username})
        } catch (e) {
            console.error(`Unable to find user by username: ${e}`);
            return null;
        }
    }

    static async createUser({username, passwordHash}) {
        try{
            if (!users) {
                throw new Error("UsersDAO not initialized. Did you call injectDB?")
            }
            const doc = {
                username, passwordHash, createdAt: new Date(),
            }
            const result = await users.insertOne(doc)
            return {
                _id: result.insertedId, username,
                createdAt: doc.createdAt
            }
        }
        catch (e) {
            if (String(e).includes("E11000")){
                return {error: "USERNAME_TAKEN"}
            }
            console.error(`Unable to create user: ${e}`);
            return { error: e.message };
        }
    }
    


}