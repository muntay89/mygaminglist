import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
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
  const { loading } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const [assetsLoaded, setAssetsLoaded] = useState(false)
  const [trending, setTrending] = useState([])
  const [trendingLoading, setTrendingLoading] = useState(true)
  const [trendingError, setTrendingError] = useState("")
  const displaygames = [...trending, ...trending];

    useEffect(()=> {
      setIntro('Welcome to MyGamingList!')
    },[])

    useEffect(() => {
      const images = [geralt, tlou, arthur]

      const imagePromise = images.map((src) => {
        return new Promise((resolve) => {
          const img = new Image()
          img.onload = resolve
          img.onerror = resolve
          img.src = src
          if (img.complete) {
            resolve()
          }
        })
      })
      const fontsLoaded = document.fonts ? document.fonts.ready : Promise.resolve()
      Promise.all([...imagePromise, fontsLoaded]).then(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setAssetsLoaded(true)
          })
        })
      })
    }, [])

    useEffect(() => {
      const loadTrending = async () => {
        try{
          const response = await api.get('igdb/games/trending')
          console.log('trending', trending)
          setTrending(response.data)
        }
        catch (error) {
          console.error(error)
          setTrendingError('Unable to load trending games')
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
    };

  const getCardPosition = (index) => {
    const total = trending.length;
    const leftIndex = (activeIndex - 1 + total) % total;
    const rightIndex = (activeIndex + 1) % total;

    if (index === activeIndex) return 'active';
    if (index === leftIndex) return 'left';
    if (index === rightIndex) return 'right';
    return 'hidden';
  };

  if (loading){
    return(
    <div className='loader' id = 'homepage-loader'>
        <PacmanLoader color="white" />
      </div>)
  }
  return(
    <>
    {!assetsLoaded && (
      <div className='loader' id = 'homepage-loader'>
        <PacmanLoader color="white" />
      </div>
    )}

      <div className={`homepage ${assetsLoaded ? 'homepage-ready' : 'homepage-loading'}`}>
        <div className='homepage-cont'>
          <p className='homepage-title' >MyGamingList</p>
          <p className="homepage-under-header">Discover, track, rate, and share the games you play—all in one place.</p>
          <Link className="homepage-signup" to = '/mygaminglist/signup'>Get Started</Link>
          <div className="homepage-features">
            {features.map((feature, index) => (
              <div
                  className={`homepage-feature`}
                >
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