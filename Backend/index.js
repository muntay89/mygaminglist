import "./env.js";
import app from "./server.js"
import router from "./routes/auth.route.js";
import session from "express-session";
import mongodb from "mongodb"
import ReviewsDAO from "./dao/reviewsDAO.js"
import ListDAO from "./dao/listDAO.js"
import UsersDao from "./dao/usersDAO.js";


const MongoClient = mongodb.MongoClient
// const MONGO_PASSW = process.env.MONGO_PASSWORD
const uri = process.env.MONGO_URI



const port = process.env.PORT || 8000

MongoClient.connect(
    uri,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
    })
    .catch(err => {
        console.error(err.stack)
        process.exit(1)
    })
    .then(async client => {
        await UsersDao.injectDB(client)
        await ReviewsDAO.injectDB(client)
        await ListDAO.injectDB(client)
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    })



