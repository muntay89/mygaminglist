import express from 'express'
import ListCtrl from "./list.controller.js"


const router = express.Router()

router.route("/game/:user").get(ListCtrl.apiGetList)
router.route("/status/:status").get(ListCtrl.apiGetListByCat)
router.route("/new").post(ListCtrl.apiAddList)
router.route("/:id")
    .get(ListCtrl.apiGetEntry)
    .put(ListCtrl.apiUpdateList)
    .delete(ListCtrl.apiDeleteList)


export default router