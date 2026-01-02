import listDAO from "../dao/listDAO.js"

export default class ListController {
    static async apiAddList(req, res, next) {
      try {
        const gameId = parseFloat(req.body.gameId)
        const user = req.body.user
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


    
  static async apiGetLis(req, res, next) {
    try {
      let id = req.params.id || {}
      let lis = await listDAO.getList(id)
      if (!lis) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(lis)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }


  static async apiUpdateList(req, res, next) {
    try {
      const listId = req.params.id
      const user = req.body.user
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
      const listResponse = await listDAO.deleteList(listId)
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiGetList(req, res, next) {
    try {
      let user = req.params.user || {}
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
      let id = req.params.id || {}
      let list = await listDAO.getEntry(id)
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
      // let user = req.params.user || {}
      // console.log(status)
      let list = await listDAO.getListByStatus(status)
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