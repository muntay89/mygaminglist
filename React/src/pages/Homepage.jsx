import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Loader from '../components/Loader';
import geralt from "../images/geralt3.png"
import tlou from "../images/tlou.png"
import arthur from "../images/arthur.png"
import Embers from "../components/Embers";
import PacmanLoader from "react-spinners/PacmanLoader";
import { FaSearch, FaPencilAlt, FaPlus, FaPeopleArrows, FaChevronLeft, FaChevronRight } from "react-icons/fa";
const features = [
  {
    title: "Search",
    text: "search and gain info on thousands of games.",
    icon: <FaSearch className='feature-icon' />,
  },
  {
    title: "Review",
    text: "write reviews and share opinions.",
    icon: <FaPencilAlt className='feature-icon' />,
  },
  {
    title: "Keep Track",
    text: "list and categorize your games.",
    icon: <FaPlus className='feature-icon' />,
  },
  {
    title: "Connect",
    text: "share opinions and see how others feel about your favorite games!",
    icon: <FaPeopleArrows className='feature-icon' />,
  },
]


export default function Homepage ({setIntro}){
  const { loading } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const [assetsLoaded, setAssetsLoaded] = useState(false)
  const displayFeatures = [...features, ...features];

    useEffect(()=> {
      setIntro('Welcome to my GamingList!')
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
    })
  const prevSlide = () => {
      setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
    };

    const nextSlide = () => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    };

  const getCardPosition = (index) => {
    const total = features.length;
    const leftIndex = (activeIndex - 1 + total) % total;
    const rightIndex = (activeIndex + 1) % total;

    if (index === activeIndex) return 'active';
    if (index === leftIndex) return 'left';
    if (index === rightIndex) return 'right';
    return 'hidden';
  };

  if (loading){
    <div className='loader' id = 'homepage-loader'>
        <PacmanLoader color="rgba(145, 3, 3, 1)" />
      </div>
  }
  return(
    <>
    {!assetsLoaded && (
      <div className='loader' id = 'homepage-loader'>
        <PacmanLoader color="rgba(145, 3, 3, 1)" />
      </div>
    )}

      <div className={`homepage ${assetsLoaded ? 'homepage-ready' : 'homepage-loading'}`}>
        <div className='homepage-cont'>
          <p className='homepage-title' >MyGamingList</p>
          <div className="homepage-carousel">
            <button className="carousel-btn left-btn" onClick={prevSlide} aria-label="Previous feature">
              <FaChevronLeft />
            </button>
            <div className="homepage-carousel-track">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`homepage-feature ${getCardPosition(index)}`}
                >
                  <p className="feature-text">
                    {feature.title} {feature.icon}
                  </p>
                  <p className="feature-side">{feature.text}</p>
                </div>
              ))}
            </div>
            <button className="carousel-btn right-btn" onClick={nextSlide} aria-label="Next feature">
              <FaChevronRight />
            </button>
          </div>
          <div className="homepage-dots">
            {features.map((_, index) => (
              <button
                key={index}
                className={index === activeIndex ? 'dot active-dot' : 'dot'}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to feature ${index + 1}`}
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