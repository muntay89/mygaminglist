import express from "express"
import { igdbRequest } from "../services/igdb.service.js"
import { adaptGame } from "../services/igdb.adapter.js"

const router = express.Router()


const PLATFORM_GROUPS = {
    pc: [6],
    playstation: [7, 8, 9, 38, 46, 48, 167],
    xbox: [11, 12, 49, 169],
    nintendo: [4, 5, 18, 19, 20, 21, 22, 24, 33, 37, 41, 130, 508]
}

const LEGACY_RAWG_PLATFORM_FILTERS = {
    '14,1,186': 'xbox',
    '18,16,19,187': 'playstation',
    '7,8,9,10,11,83,43,105,24': 'nintendo',
    '5,6,4': 'pc'
}

function getPlatformGroup(req) {
    const platform = typeof req.query.platform === 'string'
        ? req.query.platform.trim().toLowerCase()
        : ''

    if (Object.hasOwn(PLATFORM_GROUPS, platform)) {
        return platform
    }

    const legacyPlatforms = typeof req.query.platforms === 'string'
        ? req.query.platforms.trim()
        : ''

    return LEGACY_RAWG_PLATFORM_FILTERS[legacyPlatforms] ?? null
}

router.get('/games', async (req, res) => {
    try{
        const search = typeof req.query.search === 'string' ? req.query.search.trim() : ''
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1)
        const pageSize = 20
        const offset = (page - 1) * pageSize
        const platformGroup = getPlatformGroup(req)
        const platformIds = platformGroup
            ? PLATFORM_GROUPS[platformGroup]
            : []
        const whereConditions = ['game_type = (0,4,8,9,10)', 'version_parent = null']
        if (platformIds.length > 0) {
            whereConditions.push(
                `platforms = (${platformIds.join(',')})`
            )
        }
        
        let query = `fields
                    id,
                    name,
                    slug,
                    summary,
                    first_release_date,
                    rating,
                    rating_count,
                    cover.image_id,
                    genres.id,
                    genres.name,
                    platforms.id,
                    platforms.name;
                    where ${whereConditions.join(' & ')};
                    limit ${pageSize};
                    offset ${offset};`
        
        if (search) {
            const safeSearch = search.replace(/"/g, '\\"')
            query += `search "${safeSearch}";`
        }

        const games = await igdbRequest('games', query)
        const results = games.map(adaptGame)
        
        res.json({
            count: results.length,
            next: results.length === pageSize ? page + 1 : null,
            previous: page > 1 ? page - 1 : null,
            results
        })
    }
    catch(error) {
        console.error(`IGDB search error:`, error)
        res.status(500).json({error: 'Unable to search IGDB'})
    }
})

router.get('/games/:id', async (req, res) => {
    try{
        const gameId = Number(req.params.id)

        if (!Number.isInteger(gameId)) {
            return res.status(400).json({
                error: 'Invalid game ID'
            })
        }

        const query = `fields
                    id,
                    name,
                    slug,
                    summary,
                    storyline,
                    first_release_date,
                    rating,
                    rating_count,
                    cover.image_id,
                    genres.id,
                    genres.name,
                    platforms.id,
                    platforms.name,
                    screenshots.id,
                    screenshots.image_id,
                    websites.url,
                    involved_companies.developer,
                    involved_companies.publisher,
                    involved_companies.company.id,
                    involved_companies.company.name;
                    where id = ${gameId};
                    limit 1;`
        const games = await igdbRequest('games', query)

        if (!games.length) {
            return res.status(404).json({
                error: 'Game not found'
            })
        }
        res.json(adaptGame(games[0]))
    }
    catch (error) {
        console.error('IGDB detail error:', error)
        res.status(500).json({
            error: 'Unable to load game'
        })
    }
})

router.get('/games/:id/screenshots', async(req, res) => {
    try{
        const gameId = Number(req.params.id)

        if (!Number.isInteger(gameId)) {
            return res.status(400).json({
                error: 'Invalid game ID'
            })
        }

        const query = `fields
                    screenshots.id,
                    screenshots.image_id;
                    where id = ${gameId};
                    limit 1;`
        const games = await igdbRequest('games', query)

        if (!games.length) {
            return res.status(404).json({
                error: 'Game not found'
            })
        }

        const results = games[0].screenshots?.map(screenshot => ({
            id: screenshot.id,
            image: `https://images.igdb.com/igdb/image/upload/t_1080p/${screenshot.image_id}.jpg`
        })) ?? []

        res.json({
            count: results.length,
            next: null,
            previous: null,
            results
        })
    }
    catch (error) {
        console.error('IGDB screenshot error:', error)
        res.status(500).json({
            error: 'Unable to load screenshots'
        })
    }
})

export default router