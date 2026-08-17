import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { api } from "../api/client";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import Loader from "../components/Loader";
import { FaArrowLeft, FaArrowRight, FaTimesCircle, FaHeartBroken } from "react-icons/fa";

export default function Images (props) {
  const navigate = useNavigate()
  const [screenshots, setScreenshots] = useState([])
  const [loading, setLoading] = useState(true)
  let {gameID} = useParams()

  useEffect( () => {
    const fetch = async() => {
      try{
        const response = await api.get(`/igdb/games/${gameID}/screenshots`)
        setScreenshots(response.data.results ?? [])
      }
      catch(error){
        console.error(error)
      }
      finally{
        setLoading(false)
      }
    }
    fetch()
  }, [gameID])

  useEffect(()=> {
    if (props.selected) {
      props.setIntro(`${props.selected} - Screenshots`)
    }
  }, [])

  const closeImgs = () => {
    navigate(`/mygaminglist/game/${gameID}`)
    console.log('close', props.searchResults)
  }

  if (loading) {
    return (
      <Loader></Loader>
    )
  }

  return screenshots.length > 0 ?
    (<div className='container'>
      <Swiper 
      effect='coverflow'
      grabCursor={true}
      centeredSlides={true}
      loop={true}
      slidesPerView='auto'
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2.5,
      }}
      pagination={{ el: '.swiper-pagination', clickable: true, renderBullet: function (index, className) {
        return `<span class="${className}"><div class = 'pagin-index'>${index + 1}</div></span>`;
      }, }}
      navigation={{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        clickable: true,
      }}
      modules={[EffectCoverflow, Pagination, Navigation]}
      className='swiper_container'>
        {screenshots[0] && <SwiperSlide className='swiper-slide-custom'>
          <img className = 'enlarged' src = {screenshots[0].image} alt = 'screenshot1'
           onClick={() => {window.open(screenshots[0].image)}}></img>
        </SwiperSlide>}
        {screenshots[1] && <SwiperSlide className='swiper-slide-custom'>
          <img className = 'enlarged' src = {screenshots[1].image} alt = 'screenshot2'
          onClick={() => {window.open(screenshots[1].image)}}></img>
        </SwiperSlide>}
        {screenshots[2] && <SwiperSlide className='swiper-slide-custom'>
          <img className = 'enlarged' src = {screenshots[2].image} alt = 'screenshot3'
          onClick={() => {window.open(screenshots[2].image)}}></img>
        </SwiperSlide>}
        {screenshots[3] && <SwiperSlide className='swiper-slide-custom'>
          <img className = 'enlarged' src = {screenshots[3].image} alt = 'screenshot4'
          onClick={() => {window.open(screenshots[3].image)}}></img>
        </SwiperSlide>}
        {screenshots[4] && <SwiperSlide className='swiper-slide-custom'>
          <img className = 'enlarged' src = {screenshots[4].image} alt = 'screenshot5'
          onClick={() => {window.open(screenshots[4].image)}}></img>
        </SwiperSlide>}
        {screenshots[5] &&<SwiperSlide className='swiper-slide-custom'>
          <img className = 'enlarged' src = {screenshots[5].image} alt = 'screenshot6'
          onClick={() => {window.open(screenshots[5].image)}}></img>
        </SwiperSlide>}

        <div className="slider-controler">
          <div className="swiper-button-prev slider-arrow">
            <FaArrowLeft style={{color: 'hsl(0, 96%, 29%)'}}/>
          </div>
          <div className="swiper-button-next slider-arrow">
            <FaArrowRight/>
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </Swiper>
      <div className='slider-closer'>
          <FaTimesCircle style={{height: '100%', width: '100%', cursor: 'pointer'}} onClick={()=> {closeImgs()}}/>
        </div>
    </div>) : 
    (
      <div
        className="no-results"
        style={{ backgroundColor: "hsl(0, 1%, 90%)" }}
      >
        <h2 className="no-res-head">NO SCREENSHOTS AVAILABLE...</h2>
        <FaHeartBroken className="heart-crack" />
      </div>
      )
}