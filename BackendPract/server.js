import express from "express"
import cors from "cors"
import session from "express-session"
import reviews from "./routes/reviews.route.js"
import list from "./routes/list.route.js"
import profiles from './routes/profiles.route.js'
import router from "./routes/auth.route.js"
import deals from './routes/deals.route.js'
import igdbRouter from './routes/igdb.route.js'
import MongoStore from "connect-mongo"

const app = express()

const isProd = process.env.NODE_ENV === 'production'

const sessionSecret =  process.env.SESSION_SECRET || (isProd ? null : 'dev-secret')

// const corsOrigin = isProd ? process.env.FRONTEND_ORIGIN : "http://localhost:5173"
const corsOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173"


if (isProd) {
  app.set("trust proxy", 1);
}
if (isProd && !sessionSecret) {
  throw new Error('SESSION_SECRET REQUIRED')
}


app.use(cors({
  origin: corsOrigin, // EXACT Vite origin
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"], 
}))
app.use(express.json({limit: '1mb'}))
app.use(
  session({
    name: "mgl.sid",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    proxy: isProd,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions", 
      ttl: 60 * 60 * 24 * 7,
    }),
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
)
app.get("/ping", (req, res) => {
  res.json({ ok: true });
})
app.use("/api/v1/auth", router)
app.use("/api/v1/reviews", reviews)
app.use("/api/v1/list", list)
app.use("/api/v1/profiles", profiles)
app.use("/api/v1/deals", deals)
app.use("/api/v1/igdb", igdbRouter)
app.use("", (req, res) => 
res.status(404).json({error: "not found"}))

export default app



