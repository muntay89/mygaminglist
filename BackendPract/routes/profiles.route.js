import express from 'express'
import ProfilesCtrl from "../api/profiles.controller.js"
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

router.route("/:username/profile").get(ProfilesCtrl.apiGetProfile)


export default router