import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Loader from '../components/Loader';
import geralt from "../images/geralt3.png"
import tlou from "../images/tlou.png"
import arthur from "../images/arthur.png"
import Embers from "../components/Embers";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import fog from '../images/foggy.jpg'
import { FaSearch, FaPencilAlt, FaPlus, FaPeopleArrows, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Homepage ({reset, setReset, setIntro}){
  const { user, isLoggedIn, loading, login, logout } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
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

  const displayFeatures = [...features, ...features];

    if (reset === true){
      console.log('reset')
      window.localStorage.setItem('NUMBER', JSON.stringify(1))
    }

    useEffect(()=> {
      setIntro('Welcome to my GamingList!')
    },[])
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
    return <Loader/>
  }
  return(
    <div className='homepage'>
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
          {/* <Swiper
            slidesPerView={3}
            slidesPerGroup={1}
            centeredSlides={true}
            loop={true}
            spaceBetween={20}
            watchOverflow={false}
            loopAdditionalSlides={4}
            navigation={true}
            pagination={{ clickable: true }}
            modules={[Pagination, Navigation]}
            className="homepage-swiper"
          >
            {displayFeatures.map((feature, index) => (
      <SwiperSlide className="homepage-feature" key={`${feature.title}-${index}`}>
        <p className='feature-text'>
          {feature.title} {feature.icon}
        </p>
        <p className='feature-side'>{feature.text}</p>
      </SwiperSlide>
    ))}
          </Swiper> */}
        <div className="mountains"></div>
        <div className="firelight"></div>
        <div className="vignette"></div>
        {/* <img src={fog} className="fog fog1" alt="" />
        <img src={fog} className="fog fog2" alt="" /> */}
        <Embers/>
        {/* <img src={fog} className="fog"/> */}
        <div className="homepage-img-cont">
          <img src={geralt} id = 'geralt' />
          <img src={tlou} id = "tlou"  />
          <img src={arthur} id = "arthur"/>
        </div>
      </div>
    </div>
  )
    
}