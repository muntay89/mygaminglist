import ListDAO from "../dao/listDAO.js"
import UsersDao from "../dao/usersDAO.js"

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
            res.json({
                username: user.username,
                joined: user.createdAt,
                total,
                stats,
                favorites,
            })
        }
        catch (e) {
        console.log(`api, ${e}`);
        res.status(500).json({ error: e.message })
        }
    }
}