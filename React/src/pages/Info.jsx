import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Loader from '../components/Loader';
import { api } from "../api/client";
import { rawgScreenshotsUrl } from "../api/rawg";


import { FaPlus, FaCheck, FaPencilAlt, FaImage, FaStar, FaTimesCircle } from "react-icons/fa";

export default function Info (props) {
  let {gameID} = useParams()
  const { user, isLoggedIn, login, logout } = useAuth();
  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [added, setAdded] = useState(false)
  const [rendered, setRendered] = useState(false)
  const [ssindex, setssindex] = useState(1)
  const [data, setData] = useState([])
  const [updated, setUpdated] = useState('completed')
  const navigate = useNavigate()
  const genScreenshots = (gameID) => rawgScreenshotsUrl(gameID)
  const checkForEntry = (gameID) => api.get(`/list/${gameID}`)


  useEffect(()=> {
    props.setIntro(`${props.selected} - Info and Details`)
  })

  useEffect(() => {
    if(!rendered && gameID){
    const fetch = async() => {
      if (isLoggedIn){
          const check = await checkForEntry(gameID)
          console.log(check.data)
        if(check.data.length !== 0){
          console.log('doin it')
          setAdded(true)
        }
        else{
          setAdded(false)
        }
    }
      try{
        const response = await axios.get(`${props.genInfo(gameID)}`)
        const images = await axios.get(`${genScreenshots(gameID)}`)
        props.updateSearchResults(response.data)
        props.setScreenshots(images.data.results)
        console.log(props.screenshots)
    } catch(error) {
      alert('error')
    } finally {
      setLoading(false)
    }
    }
    fetch()
  }
  else{
    setRendered(false)
  }

  }, [gameID])


  const results = props.searchResults

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
        gameId: gameID,
        userId: "dev-user-123", // temporary bridge until auth
        status,
        name: results.name,
        card: results.background_image,
      })
      setShow(false)
      setShow(false);
      setTimeout(() => props.setEdit(false), 200);
      setAdded(true);
      // setClose(true);
    }
    catch (error){
      alert(error)
    }
  }


  const genres = (game) => {
    const genreNames = []
    if (game.genres){
      for (let i = 0; i < game.genres.length; i++){
        genreNames.push(game.genres[i].name)
      }
      return genreNames.join(', ')
    }
    else{
      genreNames.push('None Listed')
      return genreNames
    }
  }
  const publishers = (game) => {
    const pubNames = []
    if (game.publishers){
      for (let i = 0; i < game.publishers.length; i++){
        pubNames.push(game.publishers[i].name)
      }
      return pubNames.join(', ')
    }
    else{
      pubNames.push('None Listed')
      return pubNames
    }
  }
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
 
  const repl = (descr) => {
    let newText = descr.replace(/###/g, '\n')
    return newText
  }

  const displayEdit=(thing)=> {
    props.setEdit(true)
    setShow(true)
    setData(thing)
  }

  const changeSelected = (event) => {
    setUpdated(event)
    // setChanged(true)
  }

  const showSS = (game) => {
    let i = (ssindex - 1)
    return game[i].image
  }

  const navReview = (game) => {
      // props.setSelected(game.name)
      navigate(`/mygaminglist/newreview/${game.id}`)
  }
  const navSS = (game) => {
    navigate(`/mygaminglist/game/${game.id}/images`)
  }

  if (loading){
    return (
      <Loader/>
    )
  }


  if (results){
  return(
    <div className='main-container'>
      <div id = "center">
        <div className='img-container'>
          {/* <div className='game-info'><b>Information</b></div> */}
          <img id = "background-cover" className='thumbnail' src = {results.background_image}></img>
          {props.screenshots &&
          <span className='misc-images'>
            <img src = {props.screenshots[0].image} onClick={() => {navSS(results)}}></img>
            {props.screenshots[1] &&<img src = {props.screenshots[1].image} onClick={() => {navSS(results)}}></img>}
            {props.screenshots[2] &&<img src = {props.screenshots[2].image} onClick={() => {navSS(results)}}></img>}
            <FaImage size = {40} className='icon-overlay' onClick={() => {navSS(results)}}/>
          </span>
          }
        </div>
        <div className='details'>
            <div className='details-container'>
              <div id = "game-genres">
                <span id = "genre-title"><b>Genres: </b>{genres(results)} </span>
              </div>
              <div id = "release-date">
                <span id = "release-title"><b>Release Date: </b>{results.released}</span>
              </div>
              <div id = "publisher">
                <span id = 'publisher-title'><b>Publisher(s): </b>{publishers(results)}</span>
              </div>
              <div id = "esrb">
                <span id = 'esrb-title'><b>ESRB Rating: </b>{results.esrb_rating?.name || "No Rating Listed"}</span>
              </div>
              <div id = "platfrms">
                <span id = 'platfrm-ttle'><b>Platforms: </b>{platforms(results)}</span>
              </div>
              <div id = "butt-cont">
                {isLoggedIn ? (
                <>
                {!added
                ?<button id = "list-add" className='game-buttons' onClick={()=>{displayEdit(results)}}><FaPlus className='plusicon'/>Add to List</button>
                :<button id = "list-added" className='game-buttons'><FaCheck className='plusicon'/>Added to List</button>}
                <button id = "review-add" className='game-buttons' onClick={()=>{navReview(results)}}><FaPencilAlt className='pencicon'/>Write a Review</button>
                </>
                ) : (
                  <button id="login-required" className="game-buttons" onClick={() => navigate("/mygaminglist/login")}>Login to use these features</button>
                )}
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
                      <button className='list-save' onClick={()=> saveToList(updated)}><FaPlus className='plusicon' id = 'add-lis-cat'/></button>
                      {/* <button className='list-save'>...</button> */}
                    </div>
                  </div>
                    <FaTimesCircle className='exit-list' onClick={()=> {setShow(false); setTimeout(()=> {props.setEdit(false)}, 500)}}/>
              </div>
            
            </div>
        </div>
      </div>
      <div id = "info-container">
        <div id='info-stick'>
          <div id = "info-title"><b>{results.name}</b></div>
          <div id = "under-header">
            <span className='info-rating-cont'>
              <FaStar id = "game-rating"/>
                <span id = "rating-text">{results.rating}/5</span>
            </span>
            <span id = "game-developer">
              <span id = "dev-title">Developer: </span>
              {results.developers?.[0]?.name || "Unknown Developer"}
            </span>
          </div>
        </div>
        <div id = "descr-title"> 
        {repl(results.description_raw)}</div>
      </div>
      <div className='opac-wrap' style={{display: props.edit && 'block'}}></div>
    </div>
  )
  }
}