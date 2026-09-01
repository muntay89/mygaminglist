import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { api } from "../api/client"
import Loader from '../components/Loader';
import geralt from "../images/geralt3.png"
import tlou from "../images/tlou.png"
import arthur from "../images/arthur.png"
import Embers from "../components/Embers";
import PacmanLoader from "react-spinners/PacmanLoader";
import { FaSearch, FaList, FaStar, FaChartBar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const features = [
  {
    // title: "Discover",
    text: "Search thousands of games, explore details, screenshots, ratings, and current deals.",
    icon: <FaSearch className="feature-icon" style={{verticalAlign: 'center'}}/>,
  },
  {
    // title: "Track",
    text: "Build your personal library and organize games by playing, completed, planned, or dropped.",
    icon: <FaList className="feature-icon" style={{verticalAlign: 'center'}}/>,
  },
  {
    // title: "Rate & Review",
    text: "Rate games with half-star precision and write reviews to share your thoughts.",
    icon: <FaStar className="feature-icon" style={{verticalAlign: 'center'}}/>,
  },
  {
    // title: "Profiles & Stats",
    text: "View public profiles, favorite games, activity stats, and rating distributions.",
    icon: <FaChartBar className="feature-icon" style={{verticalAlign: 'center'}}/>,
  },
]

export default function Homepage ({setIntro}){
  const [activeIndex, setActiveIndex] = useState(0);
  const [assetsLoaded, setAssetsLoaded] = useState(false)
  const [trending, setTrending] = useState([])
  const [trendingLoading, setTrendingLoading] = useState(true)
  const [trendingError, setTrendingError] = useState("")

    useEffect(()=> {
      setIntro('Welcome to MyGamingList!')
    },[])

    useEffect(() => {
      const frame = requestAnimationFrame(() => {setAssetsLoaded(true)})
      return () => cancelAnimationFrame(frame);
    }, [])

    useEffect(() => {
      const loadTrending = async () => {
        try {
          let response

          try {
            response = await api.get('/igdb/games/trending', {timeout: 30000})
          }
          catch {
            await new Promise(resolve => setTimeout(resolve, 1000))
            response = await api.get('/igdb/games/trending', {timeout: 30000})
          }
          setTrending(response.data)
          setTrendingError('')
        }
        catch(error) {
          console.error('Trending games failed:', error)
          setTrendingError('Unable to load popular games.')
        }
        finally{
          setTrendingLoading(false)
        }
      }
      loadTrending()
    }, [])

  const prevSlide = () => {
      setActiveIndex((prev) => (prev - 1 + trending.length) % trending.length);
    };

    const nextSlide = () => {
      setActiveIndex((prev) => (prev + 1) % trending.length);
    }

  const getCardPosition = (index) => {
    const total = trending.length
    if (!total) return 'hidden-right'

    let offset = (index - activeIndex + total) % total

    if (offset > total / 2) {
      offset -= total
    }

    if (offset === 0) return 'active'
    if (offset === -1) return 'left'
    if (offset === 1) return 'right'

    return offset < 0 ? 'hidden-left' : 'hidden-right'
  } 

  
  return(
    <>
      <div className={`homepage ${assetsLoaded ? 'homepage-ready' : 'homepage-loading'}`}>
        <div className='homepage-cont'>
          <p className='homepage-title' >MyGamingList</p>
          <p className="homepage-under-header">Discover, track, rate, and share the games you play—all in one place.</p>
          <Link className="homepage-signup" to = '/mygaminglist/signup'>Get Started</Link>
          <div className="homepage-features">
            {features.map((feature, index) => (
              <div key = {feature.text} className='homepage-feature'>
                  <span className="feature-text">
                    {feature.icon}
                  </span>
                  <p className="feature-side">{feature.text}</p>
                </div>
            ))}
          </div>
          <div className="homepage-carousel">
            <button className="carousel-btn left-btn" onClick={prevSlide} aria-label="Previous game">
              <FaChevronLeft />
            </button>
            <div className="homepage-carousel-track">
              <p className="trending-heading">Popular Games</p>
              <div className="trending-cont">
                {trendingLoading && (
                  <p className="trending-status">
                    Loading popular games...
                  </p>
                )}
                {trendingError && (
                  <p className="trending-status">
                    {trendingError}
                  </p>
                )}
                {trending.map((game, index) => (
                  <Link key={game.id} to = {`/mygaminglist/game/${game.id}`} className={`homepage-game trending-card ${getCardPosition(index)}`}>
                    <img src = {game.background_image} alt = '' className="trending-cover"></img>
                    <div className="trending-info">
                      <p className="trending-title">
                        {game.name}
                      </p>
                      {game.rating > 0 && (
                        <p className="trending-rating">
                          ★ {game.rating.toFixed(1)}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <button className="carousel-btn right-btn" onClick={nextSlide} aria-label="Next game">
              <FaChevronRight />
            </button>
          </div>
          <div className="homepage-dots">
            {trending.map((game, index) => (
              <button
                key={index}
                className={index === activeIndex ? 'dot active-dot' : 'dot'}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to game ${index + 1}`}
              />
            ))}
          </div>
          <div className="mountains"></div>
          <div className="firelight"></div>
          <div className="vignette"></div>
          <Embers/>
          <div className="homepage-img-cont">
            <img src={geralt} id = 'geralt' />
            <img src={tlou} id = "tlou"  />
            <img src={arthur} id = "arthur"/>
          </div>
        </div>
      </div>
    </>
  )
  
}