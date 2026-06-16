import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";

import { FaArrowLeft, FaArrowRight, FaTimesCircle } from "react-icons/fa";

export default function Images (props) {
  const { user, isLoggedIn, login, logout } = useAuth();
  const navigate = useNavigate()

  useEffect(() =>{
    const storedScreenshots = JSON.parse(window.localStorage.getItem('SCREENSHOTS'));
       if (storedScreenshots) {
           props.setScreenshots(storedScreenshots);
       } 
  }, [])


  useEffect(() => {
    if (props.screenshots){
      window.localStorage.setItem('SCREENSHOTS', JSON.stringify(props.screenshots))
      // console.log('changed', props.screenshots)
    }
  }, [props.screenshots])

  const closeImgs = () => {
    navigate(`/mygaminglist/game/${props.searchResults.id}`)
    console.log('close', props.searchResults)
  }


  return (
    <div className='container'>
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
        {props.screenshots[0] && <SwiperSlide className='swiper-slide-custom'>
          <img className = 'enlarged' src = {props.screenshots[0].image} alt = 'screenshot1'
           onClick={() => {window.open(props.screenshots[0].image)}}></img>
        </SwiperSlide>}
        {props.screenshots[1] && <SwiperSlide className='swiper-slide-custom'>
          <img className = 'enlarged' src = {props.screenshots[1].image} alt = 'screenshot2'
          onClick={() => {window.open(props.screenshots[1].image)}}></img>
        </SwiperSlide>}
        {props.screenshots[2] && <SwiperSlide className='swiper-slide-custom'>
          <img className = 'enlarged' src = {props.screenshots[2].image} alt = 'screenshot3'
          onClick={() => {window.open(props.screenshots[2].image)}}></img>
        </SwiperSlide>}
        {props.screenshots[3] && <SwiperSlide className='swiper-slide-custom'>
          <img className = 'enlarged' src = {props.screenshots[3].image} alt = 'screenshot4'
          onClick={() => {window.open(props.screenshots[3].image)}}></img>
        </SwiperSlide>}
        {props.screenshots[4] && <SwiperSlide className='swiper-slide-custom'>
          <img className = 'enlarged' src = {props.screenshots[4].image} alt = 'screenshot5'
          onClick={() => {window.open(props.screenshots[4].image)}}></img>
        </SwiperSlide>}
        {props.screenshots[5] &&<SwiperSlide className='swiper-slide-custom'>
          <img className = 'enlarged' src = {props.screenshots[5].image} alt = 'screenshot6'
          onClick={() => {window.open(props.screenshots[5].image)}}></img>
        </SwiperSlide>}

        <div className="slider-controler">
          <div className="swiper-button-prev slider-arrow">
            <FaArrowLeft style={{color: 'hsl(0, 96%, 29%);'}}/>
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
    </div>
  )
}