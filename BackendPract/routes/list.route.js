import express from 'express'
import ListCtrl from "../api/list.controller.js"
import { requireAuth } from '../middleware/requireAuth.js'



const router = express.Router()

router.route("/game").get(requireAuth, ListCtrl.apiGetList)
router.route("/status/:status").get(requireAuth, ListCtrl.apiGetListByCat)
router.route("/favorites").get(requireAuth, ListCtrl.apiGetFavorites)
router.route("/new").post(requireAuth, ListCtrl.apiAddList)
router.route("/:id")
    .get(requireAuth, ListCtrl.apiGetEntry)
    .put(requireAuth, ListCtrl.apiUpdateList)
    .delete(requireAuth, ListCtrl.apiDeleteList)


export default router