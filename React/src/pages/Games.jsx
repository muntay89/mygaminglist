import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from '../components/Loader';
import StarRatingInput from "../components/StarRating";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";


import { FaArrowLeft, FaArrowRight, FaPlus, FaTimesCircle, FaHeartBroken, FaBars } from "react-icons/fa";

export default function Games (props){
  let {number} = useParams()
  const { user, isLoggedIn, login, logout } = useAuth()
  const [searchResults, setSearchResults] = useState([])
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hasFetched, setHasFetched] = useState(false)
  const [edit, setEdit] = useState(false)
  const [data, setData] = useState([])
  const [added, setAdded] = useState(false)
  const [close, setClose] = useState(false)
  const [hasNext, setHasNext] = useState(false)
  const [updated, setUpdated] = useState('completed')
  const [rating, setRating] = useState('')
  const page = Math.max(1, Number.parseInt(number, 10) || 1)
  const checkForEntry = (gameID) => api.get(`/list/${gameID}`);
  const generateAPI = (pageIndex, search, filter) => `/igdb/games?page=${pageIndex}&search=${encodeURIComponent(search)}${filter}`
  const navigate = useNavigate()
  const results = searchResults?.results ?? []

  useEffect(()=> {
    props.setIntro(`Game Search`)
  }, [])

  useEffect(() => {
      const fetch = async() => {
        try{
          setLoading(true)
          setHasFetched(false)
          const response = await api.get(generateAPI(page, props.search, props.filter))
          console.log(response.data.results)
          setSearchResults(response.data)
          setHasNext(Boolean(response.data.next))
          
        }
      catch(error){
          console.error(error)
          setSearchResults({
          count: 0,
          results: [],
        })
        setHasNext(false)
        }finally{
          setLoading(false)
          setHasFetched(true)
          
        }
      }
      fetch()

  }, [page, props.search, props.filter])

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
  
  const textSlice = (text, limit) => {
    const maxLimit = limit || 150;
    const isTooLong = text.length > maxLimit;
    const displayedText = isTooLong ? text.slice(0, maxLimit) + '...' : text;

    return (
      <p>{displayedText}</p>
    )
  }
  const changeSelected = (event) => {
    setUpdated(event)
    console.log('updated', updated)

    if (event !== "completed") {
      setRating("")
    }
  }
  const changeRating = (event) => {
    setRating(event)
    // setChanged(true)
  }
  const navInfo = (element) => {
    props.setSelected(element.name)
    navigate(`/mygaminglist/game/${element.id}`)
  }

  const navReviews = (game) => {
    props.setSelected(game.name)
    navigate(`/mygaminglist/reviews/${game.id}`)
  }

  const displayEdit=async(thing)=> {
    if (isLoggedIn){
      const check = await checkForEntry(thing.id)
      if(check.data.length !== 0){
        setClose(true)
        setAdded(true)
      }
      else{
        setData(thing)
        setUpdated(thing.status)
        setRating(thing.rating ?? '')
        setEdit(true)
        setShow(true)
      }
  }
  else {
    navigate('/mygaminglist/login')
  }
    // props.setEdit(true)
    // setShow(true)
    // setData(thing)
  }

  const saveToList = async(status, data, gameRating) => {
    if (status === "completed" && (gameRating === "" || gameRating === "Select")) {
      alert("Please select a rating.");
      return;
    }
    try{
      await api.post('/list/new', {
        gameId: data.id,
        userId: "dev-user-123", // temporary bridge until auth
        status,
        name: data.name,
        rating: status === "completed" ? gameRating : null,
        card: data.background_image,
      })
      setShow(false)
      setTimeout(() => setEdit(false), 200);
      setAdded(true);
      setClose(true);
    }
    catch (error){
      alert(error)
    }
  }

  // const results = props.searchResults?.results || [];
  // const count = results.count

  if (loading || !hasFetched) {
    return (
      <Loader/>
    )
  }

  if (results.length === 0) {
      return(
      <div className='no-results'>
        <h2 className='no-res-head'>NO RESULTS FOUND...</h2>
        <FaHeartBroken className='heart-crack'/>
        </div>
    )}

  return(
    <div>
      <div className='pagination' style = {{borderBottom: '1px solid', color: 'hsl(0, 1%, 79%)'}}>
        <button id="previous" type="button" disabled={page <= 1} onClick={() => navigate(`/mygaminglist/games/page/${page - 1}`)}
          style = {{}}>
        <FaArrowLeft aria-hidden="true" /> 
        </button>
        <span className='page-number'>{page}</span>
        <button id="next" type="button" disabled={!hasNext} onClick={() => navigate(`/mygaminglist/games/page/${page + 1}`)}>
        <FaArrowRight aria-hidden="true" /> 
        </button>
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
                {element.name}
              </p>
                <p className='platform-list'>
                  <u>Platforms</u>: {platforms(element)}
                </p>
                <p style={{fontFamily: 'VT323, monospace'}}>{textSlice(element.description_raw)}</p>
                <div className='review-functions'>
                  <div className='rev-butt-cont'>
                    <button id = "access-reviews" onClick={() => {navReviews(element)}} 
                    className='access-rev-button' style={{marginRight: 'auto'}}>Reviews</button>
                    <button id = "access-my-reviews" onClick={() => {displayEdit(element)}} 
                    className='access-rev-button'><FaPlus style={{ verticalAlign: "middle", margin: ' 0 auto' }}/></button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className='pagination'>
        <button id="previous" type="button" disabled={page <= 1} onClick={() => navigate(`/mygaminglist/games/page/${page - 1}`)}>
        <FaArrowLeft aria-hidden="true" /> 
        </button>
        <span className='page-number'>{page}</span>
        <button id="next" type="button" disabled={!hasNext} onClick={() => navigate(`/mygaminglist/games/page/${page + 1}`)}>
        <FaArrowRight aria-hidden="true" /> 
        </button>
      </div>
      <div className={`entry-backdrop ${show? 'scale-in-center' : 'scale-out-center'}`} style={{display: edit && 'block'}}>
          <div className='edit-entry'>
            <p className='edit-title-text'>Add to List?</p>
            <div className='list-info'>
              <div className='list-game'>
                <p className='list-p' >Game Title:</p>
                <p className = "list-game-title">{data.name}</p>
              </div>
              <div className='list-details'>
                  <p className='list-p'>Status:</p>
                  <div className="edit-status">
                    <div style= {{backgroundColor: updated === 'completed' ? 'hsl(0, 96%, 29%)' : 'white', color: updated === 'completed' 
                      ? 'white': 'hsl(0, 96%, 29%)', }} value = 'completed' onClick={(event) => changeSelected('completed')}>completed</div>
                    <div style= {{backgroundColor: updated === 'playing' ? 'hsl(0, 96%, 29%)' : 'white', color: updated === 'playing' 
                      ? 'white': 'hsl(0, 96%, 29%)', }} value = 'playing' onClick={(event) => changeSelected('playing')}>playing</div>
                    <div style= {{backgroundColor: updated === 'plan to play' ? 'hsl(0, 96%, 29%)' : 'white', color: updated === 'plan to play' 
                      ? 'white': 'hsl(0, 96%, 29%)', }} value = 'plan to play' onClick={(event) => changeSelected('plan to play' )}>plan to play</div>
                    <div style= {{backgroundColor: updated === 'dropped' ? 'hsl(0, 96%, 29%)' : 'white', color: updated === 'dropped' 
                      ? 'white': 'hsl(0, 96%, 29%)', }} value = 'dropped' onClick={(event) => changeSelected('dropped')}>dropped</div>
                  </div>
                </div>
              {updated === 'completed' && (
              <div className = 'list-rating'>
                <p>Rating:</p>
                <StarRatingInput list = {true} rating = {rating} setRating = {setRating}></StarRatingInput>
              </div>)}
              <button className='list-save' onClick={()=> saveToList(updated, data, rating)}><FaPlus className='plusicon' id = 'add-lis-cat'/></button>
              {/* <button className='list-save'>...</button> */}
            </div>
          </div>
            <FaTimesCircle className='exit-list' onClick={()=> {setShow(false); setTimeout(()=> {setEdit(false)}, 500)}}/>
      </div>
      <div className={`entry-backdrop ${added? 'scale-in-center' : 'scale-out-center'}`} style={{display: close && 'block'}}>
        <div className='edit-entry'>
          <p className='already-list'>This Game is already in your list!</p>
          <button className='list-save' id = "del-verif-butt" onClick={()=> {setAdded(false); setTimeout(()=> {setClose(false)}, 500)}}
            style={{width: '30%', height: '20%'}}>Cancel</button>
          </div>
      </div>
      <div className='opac-wrap' style={{display: edit ? 'block' : 'none'}}></div>
      <div className='opac-wrap' style={{display: close  && 'block'}}></div>
    </div>
  )
  
        
}