import { useEffect, useState } from "react"
import { api } from "../api/client"

function Giveaways() {
  const [giveaways, setGiveaways] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getGiveaways() {
      try {
        const response = await api.get("/deals/giveaways")
        setGiveaways(response.data)
      } catch (error) {
        console.error("Could not load giveaways:", error)
        setGiveaways([])
      } finally {
        setLoading(false)
      }
    }

    getGiveaways()
  }, [])

  return (
    <section className="giveaways">
      <h2>Current Gaming Giveaways</h2>

      {loading && <p>Loading giveaways...</p>}

      {!loading && giveaways.length === 0 && (
        <p>No giveaways are currently available.</p>
      )}

      <div className="giveaway-grid">
        {giveaways.map((giveaway) => (
          <article className="giveaway-card" key={giveaway.id}>
            <img
              src={giveaway.thumbnail}
              alt={`${giveaway.title} giveaway`}
            />

            <h3>{giveaway.title}</h3>
            <p>{giveaway.platforms}</p>
            <p>{giveaway.worth || "Free"}</p>

            <a
              href={giveaway.open_giveaway_url}
              target="_blank"
              rel="noreferrer"
            >
              View Giveaway
            </a>
          </article>
        ))}
      </div>

      <small>Giveaway data provided by GamerPower.com.</small>
    </section>
  )
}

export default Giveaways