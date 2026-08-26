let accesstoken = null
let tokenExpires = 0

async function getAccessToken() {
    const now = Date.now()

    if (accesstoken && now < tokenExpires - 60000) {
        return accesstoken
    }

    const params = new URLSearchParams({
        client_id: process.env.IGDB_CLIENT_ID,
        client_secret: process.env.IGDB_CLIENT_SECRET,
        grant_type: 'client_credentials'
    })

    const response = await fetch(
        `https://id.twitch.tv/oauth2/token?${params.toString()}`,
        {
            method: 'POST'
        }
    )

    if (!response.ok) {
        const text = await response.text()
        throw new Error(`Twitch auth failed: ${text}`)
    }

    const data = await response.json()

    accesstoken = data.access_token

    tokenExpires = Date.now() + data.expires_in * 1000

    return accesstoken
}

export async function igdbRequest(endpoint, body) {
    const token = await getAccessToken()

    const response = await fetch(
        `https://api.igdb.com/v4/${endpoint}`,
        {
            method: 'POST',
            headers: {
                'Client-ID': process.env.IGDB_CLIENT_ID,
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'text/plain'
            },

            body
        }
    )

    const text = await response.text()

    if (!response.ok) {
        throw new Error(`IGDB error ${response.status}: ${text}`)
    }

    return JSON.parse(text)
}