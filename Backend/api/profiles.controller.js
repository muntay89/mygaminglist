import ListDAO from "../dao/listDAO.js"
import UsersDao from "../dao/usersDAO.js"

const VALID_STATUSES = new Set([
  "playing",
  "completed",
  "plan to play",
  "dropped",
])

export default class ProfilesController{
    static async apiGetProfile(req, res) {
        try{
            const username = req.params.username
            const user = await UsersDao.findByUsername(username)
            if (!user) {
                return res.status(404).json({
                    error: "User not found"
                })
            }
            const statsArray = await ListDAO.getProfileStats(user._id.toString())
            const stats = {
                playing: 0,
                completed: 0,
                dropped: 0,
                "plan to play": 0,
            }
            let total = 0;
            statsArray.forEach(stat => {
                stats[stat._id] = stat.count
                total += stat.count
            })
            const favorites = await ListDAO.getFavorites(user._id.toString())
            const ratings = await ListDAO.getRatingDistribution(user._id.toString())
            const ratingDistribution = ratings.map((item) => ({
                rating: Number(item._id),
                count: item.count,
            }))
            res.json({
                username: user.username,
                joined: user.createdAt,
                total,
                stats,
                favorites,
                ratingDistribution,
            })
        }
        catch (e) {
        console.log(`api, ${e}`);
        res.status(500).json({ error: e.message })
        }
    }

    static async apiGetPublicListByStatus(req, res) {
        try{
            const username = String(req.params.username).trim().toLowerCase()
            const status = String(req.params.status).trim().toLowerCase()

            if (!VALID_STATUSES.has(status)){
                return res.status(400).json({
                    error: 'Invalid list status',
                })
            }

            const user = await UsersDao.findByUsername(username)

            if (!user) {
                return res.status(404).json({
                    error: 'User not found',
                })
            }
            const games = await ListDAO.getPublicListByStatus(user._id.toString(), status)
            if (games?.error) {
                throw games.error
            }
            return res.json(games)
        }
        catch (e) {
            console.error(`Unable to get public list: ${e}`)
            return res.status(500).json({
                error: 'Unable to get public list',
            })
        }
    }
}