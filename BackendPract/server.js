import express from "express"
import cors from "cors"
import session from "express-session"
import reviews from "./routes/reviews.route.js"
import list from "./routes/list.route.js"
import router from "./routes/auth.route.js"
import MongoStore from "connect-mongo"

const app = express()

const isProd = process.env.NODE_ENV === 'production'

const sessionSecret =  process.env.SESSION_SECRET || (isProd ? null : 'dev-secret')

const corsOrigin = isProd ? process.env.FRONTEND_ORIGIN : "http://localhost:5173"


if (isProd) {
  app.set("trust proxy", 1);
}
if (isProd && !sessionSecret) {
  throw new Error('SESSION_SECRET REQUIRED')
}


app.use(cors({
  origin: corsOrigin, // EXACT Vite origin
  credentials: true
}))
app.use(express.json())
app.use(
  session({
    name: "mgl.sid",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions", 
      ttl: 60 * 60 * 24 * 7,
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
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
app.use("", (req, res) => 
res.status(404).json({error: "not found"}))

export default app



