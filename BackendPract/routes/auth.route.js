import express from "express"
import bcrypt from "bcrypt"
import { ObjectId } from "mongodb"
import UsersDao from "../dao/usersDAO.js"

const router = express.Router()

const USERNAME = /^[a-zA-Z0-9_]{3,24}$/

function validateCredentials(req, res, next){
  const { username, password } = req.body
  if(typeof username != 'string' || typeof password != 'string'){
    return res.status(400).json({ error: 'Invalid credentials format' })
  }

  if (password.length < 10 || password.length > 72) {
    return res.status(400).json({ error: "Password must be 10-72 characters."})
  }
  next()
}

function normalizeUsername(username) {
  return username.trim().toLowerCase();
}

router.post("/signup", validateCredentials, async (req, res) => {
  try{
    const username = normalizeUsername(req.body.username)
    const password = req.body.password
    
    if (!USERNAME.test(username ?? "")) {
      return res.status(400).json({error: "Invalid username"})
    }
    if (typeof password != "string" || password.length < 10){
      return res.status(400).json({error: "Password must be at least 10 characters"})
    }

    const exists = await UsersDao.findByUsername(username)
    if (exists) {
      return res.status(409).json({error: "Username is taken"})
    }
    
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await UsersDao.createUser({username, passwordHash})

    req.session.user = { id: String(user._id), username: user.username}
    return res.json({user: req.session.user})
  }catch (e) {
    return res.status(500).json({error: e.message})
  }
})


router.post("/login", validateCredentials, async(req, res) => {
  try{
    const username = normalizeUsername(req.body.username)
    const password = req.body.password
    const user = await UsersDao.findByUsername(username)
    if (!user) {
      return res.status(400).json({ error: "No account under that username" })
    }

    const match = await bcrypt.compare(password ?? "", user.passwordHash)
    if (!match){
      return res.status(401).json({error: "Your password is incorrect"})
    }

    req.session.user = { id:String(user._id), username: user.username}
    return res.json({user: req.session.user})
  }catch (e) {
    return res.status(500).json({error: e.message})
  }
})

router.post("/logout", (req, res) => {
  const isProd = process.env.NODE_ENV === "production"
  req.session.destroy((error) => {
    if (error) {
      console.error('Logout failed: ', error)
      return res.status(500).json({
        error: "Unable to log out",
      })
    }
    res.clearCookie("mgl.sid", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    })
    res.json({ ok: true })
  })
})

router.get("/me", (req, res) => {
  if (!req.session?.user){
    return res.status(401).json({error: "Unauthorized"})
  }
  res.json({ user: req.session.user || null })
})

export default router;
