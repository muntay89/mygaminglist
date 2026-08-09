import listDAO from "../dao/listDAO.js"

export default class ListController {
    static async apiAddList(req, res, next) {
      const VALID_STATUSES = new Set([
        "playing",
        "completed",
        "plan to play",
        "dropped",
      ])
      function isValidRating(rating) {
        return (
          Number.isFinite(rating) &&
          rating >= 0.5 &&
          rating <= 5 &&
          rating * 2 === Math.floor(rating * 2)
        )
      }
      try {
        const gameId = Number(req.body.gameId)
        const user = req.userId
        const status = String(req.body.status || "").trim().toLowerCase()
        const name = String(req.body.name || "").trim()
        const card = String(req.body.card || "").trim()
        const favorite = req.body.favorite === true

        const rating =
          req.body.rating === "" ||
          req.body.rating === null ||
          req.body.rating === undefined
            ? null
            : Number(req.body.rating)

        if (!Number.isInteger(gameId) || gameId <= 0) {
          return res.status(400).json({
            error: "Invalid game ID",
          })
        }

        if (!VALID_STATUSES.has(status)) {
          return res.status(400).json({
            error: "Invalid list status",
          })
        }

        if (!name || name.length > 200) {
          return res.status(400).json({
            error: "Invalid game name",
          })
        }

        if (status === "completed" && !isValidRating(rating)) {
          return res.status(400).json({
            error: "Completed games require a rating from 0.5 to 5",
          })
        }

        if (rating !== null && !isValidRating(rating)) {
          return res.status(400).json({
            error: "Rating must be between 0.5 and 5 in 0.5 increments",
          })
        }
        const listResponse = await listDAO.addList(
          gameId,
          user,
          status,
          name,
          rating,
          card,
          favorite
        )
      return res.status(201).json({
      status: "success",
      entry: {
        _id: listResponse.insertedId,
        gameId,
        user,
        status,
        name,
        rating,
        card,
        favorite,
      },
      })
      } catch (e) {
        res.status(500).json({ error: e.message })
      }
    }


  static async apiUpdateList(req, res, next) {
    try {
      const listId = req.params.id
      const user = req.userId
      const status = req.body.status
      const name = req.body.name
      const rating = req.body.rating
      const favorite = req.body.favorite

      const listResponse = await listDAO.updateList(
        listId,
        user,
        status,
        name,
        rating,
        favorite,
      )

      var { error } = listResponse
      if (error) {
        res.status(400).json({ error })
      }

      // if (listResponse.modifiedCount === 0) {
      //   throw new Error(
      //     "unable to update review",
      //   )
      // }

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
      if (listResponse.deletedCount === 0) {
        return res.status(404).json({
          error: "List entry not found",
          })
      }
      return res.json({
        status: "success",
      })
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
      const gameId = Number(req.params.id)
      let user = req.userId || {}
      if (!user) return res.status(401).json({ error: "Unauthorized" })
      if (!Number.isInteger(gameId) || gameId <= 0) {
        return res.status(400).json({ error: "Invalid gameId" })
      }
      let list = await listDAO.getEntry(user, gameId)
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
      if (!user) return res.status(401).json({ error: "Unauthorized" })
      let list = await listDAO.getListByStatus(user, status)
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

  static async apiGetFavorites(req, res, next) {
    try{
      const user = req.userId
      if (!user) {
        return res.status(401).json({error: 'Unauthorized' })
      }
      const favorites = await listDAO.getFavorites(user)
      res.json(favorites)
    }
    catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e.message })
    }
  }

  // static async apiGetProfile(req, res, next) {
  //   try{
  //     const user = req.userId
  //     if (!user) {
  //       return res.status(401).json({error: 'Unauthorized' })
  //     }
  //     let list 
  //   }
  // }
}