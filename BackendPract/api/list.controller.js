import listDAO from "../dao/listDAO.js"

export default class ListController {
    static async apiAddList(req, res, next) {
      try {
        const gameId = parseFloat(req.body.gameId)
        const user = req.userId
        const status = req.body.status
        const name = req.body.name
        const card = req.body.card
        console.log('gameid', gameId)
        const listResponse = await listDAO.addList(
          gameId,
          user,
          status,
          name,
          card,
        )
        res.json({ status: "success" })
      } catch (e) {
        res.status(500).json({ error: e.message })
      }
    }


    
  // static async apiGetList(req, res, next) {
  //   try {
  //     let id = req.params.id || {}
  //     let lis = await listDAO.getList(id)
  //     if (!lis) {
  //       res.status(404).json({ error: "Not found" })
  //       return
  //     }
  //     res.json(lis)
  //   } catch (e) {
  //     console.log(`api, ${e}`)
  //     res.status(500).json({ error: e })
  //   }
  // }


  static async apiUpdateList(req, res, next) {
    try {
      const listId = req.params.id
      const user = req.userId
      const status = req.body.status
      console.log(status)
      const name = req.body.name

      const listResponse = await listDAO.updateList(
        listId,
        user,
        status,
        name,
      )

      var { error } = listResponse
      if (error) {
        res.status(400).json({ error })
      }

      if (listResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update review",
        )
      }

      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeleteList(req, res, next) {
    try {
      const listId = req.params.id
      const user = req.userId
      const listResponse = await listDAO.deleteList(listId, user)
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiGetList(req, res, next) {
    try {
      let user = req.userId || {}
      let list = await listDAO.getListByUser(user)
      if (!list) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(list)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiGetEntry(req, res, next){
    try {
      let gameId = Number(req.params.id) || {}
      let user = req.userId || {}
      let list = await listDAO.getEntry(user, gameId)
      if (!user) return res.status(401).json({ error: "Unauthorized" })
      if (Number.isNaN(gameId)) return res.status(400).json({ error: "Invalid gameId" })
      if (!list) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(list)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiGetListByCat(req, res, next){
    try {
      let status = req.params.status || {}
      let user = req.userId || {}
      let list = await listDAO.getListByStatus(user, status)
      if (!user) return res.status(401).json({ error: "Unauthorized" })
      if (!list) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(list)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  


}