function igdbImage(imageId, size = 't_cover_big') {
    if (!imageId) {
        return null
    }

    return `https://images.igdb.com/igdb/image/upload/${size}/${imageId}.jpg`
}

function formatReleaseDate(timestamp) {
    if (!timestamp) {
        return null
    }

    return new Date(timestamp * 1000).toISOString().split('T')[0]
}

export function adaptGame(game) {
    return {
        id: game.id,
        name: game.name ?? '',
        slug: game.slug ?? '',
        released: formatReleaseDate(game.first_release_date),
        background_image: game.cover?.image_id ? igdbImage(game.cover.image_id) : game.artworks?.[0]?.image_id ? 
        igdbImage(game.artworks[0].image_id) : game.screenshots?.[0]?.image_id,
        rating: game.rating ? game.rating / 20 : 0,
        ratings_count: game.rating_count ?? 0,
        metacritic: null,
        description_raw: game.summary ?? '',
        genres: game.genres?.map(genre => ({
            id: genre.id,
            name: genre.name
        })) ?? [],
        platforms: game.platforms?.map(platform => ({
            platform: {
                id: platform.id,
                name: platform.name
            }
        })) ?? [],
        developers: game.involved_companies?.filter(item => 
            item.developer && item.company
        ).map(item => ({
                id: item.company.id,
                name: item.company.name
        })) ?? [],
        publishers: game.involved_companies?.filter(item => 
            item.publisher && item.company
        ).map(item => ({
                id: item.company.id,
                name: item.company.name
        })) ?? [],
        website: game.websites?.[0]?.url ?? null,
        screenshots: game.screenshots?.map(screenshot => ({
            id: screenshot.id,
            image: igdbImage(screenshot.image_id, 't_1080p')
        })) ?? []
    }
}