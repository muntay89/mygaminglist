import { useEffect, useState } from "react"
import {FaArrowLeft, FaArrowRight, FaExternalLinkAlt,FaHeartBroken} from "react-icons/fa"
import Loader from "../components/Loader"
import { api } from "../api/client"

export default function FreeGames({ setIntro }) {
  const [freeGames, setFreeGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)

  const gamesPerPage = 8

  useEffect(() => {
    if (setIntro) {
      setIntro("Free-to-Play Games")
    }
  }, [setIntro])

  useEffect(() => {
    const getFreeGames = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await api.get("/deals/free-games")

        setFreeGames(
          Array.isArray(response.data)
            ? response.data
            : []
        )
      } catch (error) {
        console.error("Unable to load free games:", error)

        setError(
          error.response?.data?.error ||
          "Unable to load free-to-play games."
        )

        setFreeGames([])
      } finally {
        setLoading(false)
      }
    }

    getFreeGames()
  }, [])

  const openGame = (url) => {
    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    )
  }

  const totalPages = Math.ceil(
    freeGames.length / gamesPerPage
  )

  const startingIndex =
    (page - 1) * gamesPerPage

  const endingIndex =
    startingIndex + gamesPerPage

  const currentGames = freeGames.slice(
    startingIndex,
    endingIndex
  )

  const previousPage = () => {
    setPage((currentPage) =>
      Math.max(currentPage - 1, 1)
    )

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  const nextPage = () => {
    setPage((currentPage) =>
      Math.min(currentPage + 1, totalPages)
    )

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  if (loading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="no-results">
        <h2 className="no-res-head">
          UNABLE TO LOAD FREE GAMES...
        </h2>

        <FaHeartBroken className="heart-crack" />

        <p className="error-message">
          {error}
        </p>
      </div>
    )
  }

  if (freeGames.length === 0) {
    return (
      <div className="no-results">
        <h2 className="no-res-head">
          NO FREE GAMES FOUND...
        </h2>

        <FaHeartBroken className="heart-crack" />
      </div>
    )
  }

  return (
    <div className="free-games-page">
      

      <div className="pagination">
        <button
          id="previous"
          type="button"
          disabled={page === 1}
          onClick={previousPage}
        >
          <FaArrowLeft aria-hidden="true" />
        </button>

        <span className="page-number">
          {page} / {totalPages}
        </span>

        <button
          id="next"
          type="button"
          disabled={page === totalPages}
          onClick={nextPage}
        >
          <FaArrowRight aria-hidden="true" />
        </button>
      </div>

      {currentGames.map((game) => (
        <div key={game.id} className="row" style={{height: 'unset'}}>
          <div className="card">
            <span className="center">
              <img
                id="image"
                className="thumbnail"
                src={game.thumbnail}
                alt={`${game.title} cover`}
                loading="lazy"
              />
            </span>
          </div>

          <div className="row-main">
            <div className="row-content">
              <p
                className="title-card"
                onClick={() =>
                  openGame(game.game_url)
                }
              >
                <u>{game.title}</u>
              </p>

              <p className="platform-list">
                <u>Platforms</u>:{" "}
                {game.platform}
              </p>

              <p className="platform-list">
                <u>Genre</u>:{" "}
                {game.genre || "Not listed"}
              </p>

              <p className="free-game-description">
                {game.short_description}
              </p>
            </div>

            <div className="review-functions">
              <div className="rev-butt-cont">
                <button
                  type="button"
                  className="access-rev-button"
                  style={{height: 'unset'}}
                  onClick={() =>
                    openGame(game.game_url)
                  }
                >
                  View Game

                  <FaExternalLinkAlt
                    aria-hidden="true"
                    style={{
                      marginLeft: "6px",
                      verticalAlign: "middle"
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="pagination">
        <button
          id="previous"
          type="button"
          disabled={page === 1}
          onClick={previousPage}
        >
          <FaArrowLeft aria-hidden="true" />
        </button>

        <span className="page-number">
          {page} / {totalPages}
        </span>

        <button
          id="next"
          type="button"
          disabled={page === totalPages}
          onClick={nextPage}
        >
          <FaArrowRight aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}