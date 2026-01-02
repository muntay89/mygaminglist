import app from "./server.js"
import mongodb from "mongodb"
import ReviewsDAO from "./dao/reviewsDAO.js"
import ListDAO from "./dao/listDAO.js"
import dotenv from "dotenv";
dotenv.config();

const MongoClient = mongodb.MongoClient
const MONGO_PASSW = process.env.MONGO_PASSWORD
const uri = `mongodb+srv://montebradford2004:${MONGO_PASSW}@cluster0.pzngoil.mongodb.net/`

console.log(process.env.MONGO_USERNAME)
console.log(process.env.MONGO_PASSWORD)
console.log(process.env.MONGO_CLUSTER)

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
        await ReviewsDAO.injectDB(client)
        await ListDAO.injectDB(client)
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    })



