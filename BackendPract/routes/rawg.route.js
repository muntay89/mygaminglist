import express from "express"

const router = express.Router()

router.get("/*", async (req, res) => {
  try {
    const rawgPath = req.path.replace(/^\/+/, "")

    const url = new URL(
      `https://api.rawg.io/api/${rawgPath}`
    )

    for (const [key, value] of Object.entries(req.query)) {
      if (key !== "key") {
        url.searchParams.append(key, value)
      }
    }

    url.searchParams.set("key", process.env.RAWG_KEY)

    console.log("RAWG REQUEST:", url.toString())

    const response = await fetch(url)

    const contentType = response.headers.get("content-type")

    console.log("RAWG STATUS:", response.status)
    console.log("RAWG CONTENT TYPE:", contentType)

    const body = await response.text()

    if (!response.ok) {
      console.error("RAWG ERROR BODY:", body)

      return res.status(response.status).json({
        error: "RAWG request failed",
        status: response.status,
      })
    }

    if (!contentType?.includes("application/json")) {
      console.error("RAWG RETURNED NON-JSON:", body)

      return res.status(502).json({
        error: "RAWG returned an unexpected response",
      })
    }

    const data = JSON.parse(body)

    res.json(data)

  } catch (error) {
    console.error("RAWG proxy error:", error)

    res.status(500).json({
      error: "Unable to communicate with RAWG",
    })
  }
})

export default router