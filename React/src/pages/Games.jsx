import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from '../components/Loader';
import { api } from "../api/client";
import { rawgGameUrl } from "../api/rawg";
import { useAuth } from "../context/AuthContext";


import { FaArrowLeft, FaArrowRight, FaPlus, FaTimesCircle, FaHeartBroken, FaBars } from "react-icons/fa";

export default function Games (props){
  let {number} = useParams()
  const { user, isLoggedIn, login, logout } = useAuth();
  const [rendered, setRendered] = useState(false)
  const [show, setShow] = useState(false)
  const [data, setData] = useState([])
  const [added, setAdded] = useState(false)
  const [close, setClose] = useState(false)
  const [updated, setUpdated] = useState('completed')
  const checkForEntry = (gameID) => api.get(`/list/${gameID}`);
  const navigate = useNavigate()
  const count = props.searchResults.count
  useEffect(()=> {
    if (props.filter === '&platforms=186'){
      props.setIntro('Xbox Search')
    }
    if (props.filter === '&platforms=187'){
      props.setIntro('Playstation Search')
    }
    props.setIntro('Game Search')
  },[])

  useEffect(() => {
    if(!rendered && number){
      props.setLoading(true)
      console.log('games')
      const newAPI = props.genAPI(number, props.search, props.filter)
      props.setAPI(newAPI)
      props.handleIndex(parseInt(number))
      props.setTest(true)
      console.log('count:', count)
    }
    else{
      setRendered(false)
    }
  }, [rendered, number,])

  useEffect(() =>{
    const localnum = window.localStorage.getItem('NUMBER')
    props.handleIndex(JSON.parse(localnum))
    number = JSON.parse(localnum)
    const filter = window.localStorage.getItem('FILTER')
    if (filter !== " "){
    props.setFilter(JSON.parse(filter))
    document.querySelector('.fillin').value = JSON.parse(filter)
    }
    if (props.reset){
      props.setReset(false)
    } 
  }, [])


  useEffect(() => {
    window.localStorage.setItem('NUMBER', JSON.stringify(number))
    if (props.filter){
    window.localStorage.setItem('FILTER', JSON.stringify(props.filter) )
    }
  }, [number, props.reset, props.filter])
  

  const platforms = (game) => {
    const platformNames = []
    if (game.platforms !== null){
      for (let i = 0; i < game.platforms.length; i++){
        platformNames.push(game.platforms[i].platform.name)
      }
      return platformNames.join(', ')
    }
    else{
      platformNames.push('None Listed')
      return platformNames
    }
  }

  const prevPage = () => {
    previous = parseInt(number) - 1
    if (previous < 1){
      alert('No more pages!')
    }
    else{
      props.setLoading(true)
      props.handleIndex(previous)
      const newAPI = props.genAPI(previous, props.search, props.filter)
      props.setAPI(newAPI)
      props.handleSubmission(true)
    }
  }

  const nextPage = async() => {
    try{
    next = parseInt(number) + 1
    props.setLoading(true)
    const response = await axios.get(props.genAPI(next, props.search, props.filter) )
    props.handleIndex(next)
    const newAPI = props.genAPI(next, props.search, props.filter)
    props.setAPI(newAPI)
    props.handleSubmission(true)
    }
    catch(error){
      alert('No more pages')
      props.setLoading(false)
    }
  }
  
  const changeSelected = (event) => {
    setUpdated(event)
    // setChanged(true)
  }
  const navInfo = (element) => {
    const number = element.id
    // const newAPI = `https://api.rawg.io/api/games/${number}?key=b5aedefac9b64ffaae235769e69a62ee`
    props.setAPI(rawgGameUrl(number))
    props.setSelected(element.name)
    props.handleInfo(true)
    navigate(`/mygaminglist/game/${number}`)
  }

  const navReviews = (game) => {
    props.setSelected(game.name)
    navigate(`/mygaminglist/reviews/${game.id}`)
  }

  const displayEdit=async(thing)=> {
    const check = await checkForEntry(thing.id)
    console.log(check.data)
    if(check.data.length !== 0){
      console.log('doin it')
      // props.setEdit(true)
      setClose(true)
      setAdded(true)
    }
    else{
      props.setEdit(true)
      setShow(true)
      setData(thing)
      setAdded(false)
    }
    // props.setEdit(true)
    // setShow(true)
    // setData(thing)
  }

  const saveToList = async(status, data) => {
    // const url = "http://localhost:8000/api/v1/list/new"

    // const fetch = async() => {
    //   try{
    //     const response = await axios.post(url, {gameId: data.id, user: 'user', status: status, name: data.name, card: data.background_image })
    //     window.location.reload()
    //   }
    //   catch(error){
    //     alert(error)
    //   }
    // }
    // fetch()
    try{
      await api.post('/list/new', {
        gameId: data.id,
        userId: "dev-user-123", // temporary bridge until auth
        status,
        name: data.name,
        card: data.background_image,
      })
      setShow(false)
      setTimeout(() => props.setEdit(false), 200);
      setAdded(true);
      setClose(true);
    }
    catch (error){
      alert(error)
    }
  }

  const results = props.searchResults?.results || [];
  // const count = results.count

  if (props.loading) {
    return (
      <Loader/>
    )
  }

  if (count !== 0) {
    return(
      <div>
        <div className='pagination' style = {{borderBottom: '1px solid', color: 'hsl(0, 1%, 79%)'}}>
          <FaArrowLeft id = 'previous' onClick={prevPage}/>
          <span className='page-number'>{number}</span>
          <FaArrowRight id = 'next' onClick={nextPage} />
        </div>
        {results.map((element) => (
          <div key ={element.id} className='row'>
            <div className='card'>
              <span className='center'>
                <img id = 'image' className='thumbnail' 
                src = {element.background_image}>
                </img>
              </span>
            </div>
            <div className='row-main'>
              <div className='row-content'>
                <p className='title-card' onClick={()=> navInfo(element)}>
                  <u>{element.name}</u>
                </p>
                  <p className='platform-list'>
                    <u>Platforms</u>: {platforms(element)}
                  </p>
              </div>
                <div className='review-functions'>
                  <div className='rev-butt-cont'>
                    <button id = "access-reviews" onClick={() => {navReviews(element)}} 
                    className='access-rev-button'>Reviews</button>
                    <button id = "access-my-reviews" onClick={() => {displayEdit(element)}} 
                    className='access-rev-button'><FaBars style={{ verticalAlign: "middle" }}/></button>
                  </div>
                </div>
            </div>
          </div>
        ))}
        <div className='pagination'>
          <FaArrowLeft id = 'previous' onClick={prevPage}/>
          <span className='page-number'>{number}</span>
          <FaArrowRight id = 'next' onClick={nextPage}/>
        </div>
        <div className={`entry-backdrop ${show? 'scale-in-center' : 'scale-out-center'}`} style={{display: props.edit && 'block'}}>
            <div className='edit-entry'>
              <p className='edit-title-text'>Add to List?</p>
              <div className='list-info'>
                <div className='list-game'>
                  <p className='list-p' >Game Title:</p>
                  <p className = "list-game-title">{data.name}</p>
                </div>
                <div className='list-details'>
                  <p className='list-p'>Status:</p>
                  <select className='edit-status' onChange={(event) => {changeSelected(event.target.value)}}>
                    <option selected = {data.status} disabled>--Status--</option>
                    <option value = 'completed'>completed</option>
                    <option value = 'playing'>playing</option>
                    <option value = 'plan to play'>plan to play</option>
                    <option value = 'dropped'>dropped</option>
                  </select>
                </div>
                <button className='list-save' onClick={()=> saveToList(updated, data)}><FaPlus className='plusicon' id = 'add-lis-cat'/></button>
                {/* <button className='list-save'>...</button> */}
              </div>
            </div>
              <FaTimesCircle className='exit-list' onClick={()=> {setShow(false); setTimeout(()=> {props.setEdit(false)}, 500)}}/>
        </div>
        <div className={`entry-backdrop ${added? 'scale-in-center' : 'scale-out-center'}`} style={{display: close && 'block'}}>
          <div className='edit-entry'>
            {/* <p className='edit-title-text' id = "del-header">Delete From List?</p>
            <div className='list-info' id = "del-verif">
              <button className='list-save' id = "del-verif-butt" onClick={()=> deleteList(data._id)}>Delete</button>
              <button className='list-save' id = "del-verif-butt" onClick={()=> {setShow(false); setTimeout(()=> {props.setDel(false)}, 500)}}>Cancel</button>
            </div> */}
            <p className='already-list'>This Game is already in your list!</p>
            <button className='list-save' id = "del-verif-butt" onClick={()=> {setAdded(false); setTimeout(()=> {setClose(false)}, 500)}}
              style={{width: '30%', height: '20%'}}>Cancel</button>
            </div>
        </div>
        <div className='opac-wrap' style={{display: props.edit  && 'block'}}></div>
        <div className='opac-wrap' style={{display: close  && 'block'}}></div>
      </div>
    )
  
        }
    if (!count) {
      return(
      <div className='no-results'>
        <h2 className='no-res-head'>NO RESULTS FOUND...</h2>
        <FaHeartBroken className='heart-crack'/>
        </div>
    )}
}