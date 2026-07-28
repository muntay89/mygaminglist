import express from "express"

const router = express.Router()

router.get("/cheapshark/search", async (req, res) => {
  try {
    const title = req.query.title?.trim()

    if (!title) {
      return res.status(400).json({
        error: "A game title is required."
      })
    }

    // const url =
    //   `https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(title)}&limit=5`
    const searchParams = new URLSearchParams({
      title,
      limit: '1'
    })

    const headers = {
      "User-Agent": "MyGamingList/1.0"
    }

    const searchResponse = await fetch(
      `https://www.cheapshark.com/api/1.0/games?${searchParams}`, {headers}
    )
    
    if (!searchResponse.ok) {
      throw new Error(`CheapShark returned ${searchResponse.status}`)
    }

    const searchResults = await searchResponse.json()

    if (searchResults.length === 0){
      return res.json({
        game: null,
        deals: []
      })
    }

    const matchedGame = searchResults[0]

    const gameResponse = await fetch(
      `https://www.cheapshark.com/api/1.0/games?id=${encodeURIComponent(matchedGame.gameID)}`,
      {headers}
    )

    if (!gameResponse.ok) {
      throw new Error(
        `CheapShark game lookup returned ${gameResponse.status}`
      )
    }

    const gameDetails = await gameResponse.json()

    const storesResponse = await fetch(
      "https://www.cheapshark.com/api/1.0/stores",
      { headers }
    )

    if (!storesResponse.ok) {
      throw new Error(
        `CheapShark stores request returned ${storesResponse.status}`  
      )
    }

    const stores = await storesResponse.json()

    const storeNames = Object.fromEntries(
      stores.map((store) => [
        store.storeID,
        store.storeName
      ])
    )

    const deals = gameDetails.deals.map((deal) => ({
      storeID: deal.storeID,
      storeName: storeNames[deal.storeID] || 'Unknown Store',
      price: deal.price,
      retailPrice: deal.retailPrice,
      savings: Number(deal.savings).toFixed(0),
      dealID: deal.dealID,
      dealURL: `https://www.cheapshark.com/redirect?dealID=${encodeURIComponent(deal.dealID)}`
    }))

    return res.json({
      game: {
        gameID: matchedGame.gameID,
        title: matchedGame.external,
        thumbnail: matchedGame.thumb,
        cheapestPriceEver: gameDetails.cheapestPriceEver?.price || null
      },
      deals
    })
  } catch (error) {
    console.error("CheapShark error:", error)

    return res.status(500).json({
      error: "Unable to retrieve game deals.",
      details: error.message
    })
  }
})

router.get("/free-games", async (req, res) => {
  try {
    const response = await fetch(
      "https://www.freetogame.com/api/games?platform=pc&sort-by=popularity"
    )

    if (!response.ok) {
      throw new Error(`FreeToGame returned ${response.status}`)
    }

    const games = await response.json()

    return res.json(games)
  } catch (error) {
    console.error("FreeToGame error:", error)

    return res.status(500).json({
      error: "Unable to retrieve free-to-play games."
    })
  }
})

export default router