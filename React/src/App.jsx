import { useEffect, useState, useRef } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useNavigate, useParams
} from 'react-router-dom'
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom';
import './App.css'
import {Login} from './Content'
import axios, { AxiosError } from 'axios'
import PacmanLoader from 'react-spinners/PacmanLoader'
import { FaArrowLeft, FaArrowRight, FaStar, FaPlus, FaPencilAlt, FaSearch, FaWindowClose, 
  FaTrashAlt, FaBars, FaCheck, FaCaretDown, FaGamepad, FaPeopleArrows,
  FaHome, FaImage,
  FaTimes,
  FaTimesCircle,
  FaHeartBroken} from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import {Swiper, SwiperSlide} from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import {EffectCoverflow, Pagination, Navigation} from 'swiper/modules';




const Header = (props) => {

  return(
    <span className="top">
        <h2 className="title">
        <Link to = "/mygaminglist/" className="home" onClick={() => props.handleClick()}>MyGamingList</Link>
        <Link to = "/mygaminglist/list" id = "list"><FaBars className='list-icon'/></Link>
        <span className='acc-methods'>
          <Link to = "/login" className="headerbutt" id = 'Login' >
                Login
          </Link>
          <Link to = "/signup" className="headerbutt" id="Signup">Signup</Link>
        </span>
        </h2>
    </span>
  )
}

const Navbar = (props) => {

  const [dropdown, setDropdown] = useState(false)
  
  const onMouseEnter = () => {
    setDropdown(true)
  }
  const onMouseLeave = () => {
    setDropdown(false)
  }

  return(
    <nav className="navbar">
      <div className='nav-select'>
        <ul id="navbar-main">
          <span id = "navbar-vis"><Link to = "/mygaminglist/" style={{margin: '0'}}><FaHome className='home-vis' onClick={()=> props.handleClick()}/></Link>
          <li><Link to = "/mygaminglist/" className="navbar-el" onClick={()=> props.handleClick()}>Home</Link></li></span>
          <li className='navbar-hide'>
            <a href="#" id="games-drop" className="navbar-el"
             onMouseEnter = {onMouseEnter} onMouseLeave = {onMouseLeave}>
              Games
            </a>
            <Dropdown visible = {dropdown} onMouseEnter = {onMouseEnter} onMouseLeave = {onMouseLeave}
          setLoading = {props.setLoading} genAPI = {props.genAPI} setAPI = {props.setAPI} setTest = {props.setTest}
          search = {props.search} filter = {props.filter} setFilter = {props.setFilter}/>
          </li>
          {/* <Dropdown visible = {dropdown} onMouseEnter = {onMouseEnter} onMouseLeave = {onMouseLeave}
          setLoading = {props.setLoading} genAPI = {props.genAPI} setAPI = {props.setAPI} setTest = {props.setTest}
          search = {props.search} filter = {props.filter} setFilter = {props.setFilter}/> */}
          <li className='navbar-hide'><a href="" className="navbar-el">Reviews</a></li>
          {/* <li className='navbar-hide'><a href="" className="navbar-el">Play</a></li>
          <li className='navbar-hide'><a href="" className="navbar-el">Help</a></li> */}
        </ul>
      </div>
      <SearchBar onChange = {props.handleSearch} Api = {props.Api} search = {props.search} setSearch = {props.setSearch}
      onSubmit = {props.handleSubmission} offSubmit = {props.resetSubmission} sub = {props.submitted} queried = {props.queried}
      updateSearchResults={props.updateSearchResults} pageIndex = {props.pageIndex} genAPI = {props.genAPI}
      setLoading = {props.setLoading} setTest = {props.setTest} filter = {props.filter} setFilter = {props.setFilter} reset = {props.reset} />
    </nav>
  )

}

const Loader = () => {
  return(
    <div className='loader'>
      <PacmanLoader color="rgba(145, 3, 3, 1)" />
    </div>
  )
}
const Dropdown = (props) => {
  
  const navigate = useNavigate()
  
  function changePage(number, platform){
    const fetch = async() => {
      try{
        props.setLoading(true)
        props.setFilter(platform)
        const newAPI = props.genAPI(number, props.search, props.filter)
        props.setAPI(newAPI)
        console.log('platform', platform)
      }
      catch{
        alert('error')
      }
      finally{
        navigate(`/mygaminglist/games/page/${number}`)
        props.setTest(true)
      }
    }
    fetch()
  }

  return(
    <ul id="dropdown" style={{display: props.visible ? 'flex': 'none',
    flexDirection: props.visible ? 'column' : 'row' }}
    onMouseEnter = {props.onMouseEnter} onMouseLeave = {props.onMouseLeave}>
            <li onClick={()=> changePage(1, '&platforms=186')}>
              <a href="#" className="consoles" id="xbox"> Xbox Series X/S </a>
            </li>
            <li onClick={()=> changePage(1, '&platforms=187')}>
              <a href="#" className="consoles" id="ps">PlayStation 5</a>
            </li>
            <li onClick={()=> changePage(1, '&platforms=7')}>
              <a href="#" className="consoles" id="nintendo">Nintendo Switch</a>
            </li>
            <li onClick={()=> changePage(1, '&platforms=4')}>
              <a href="#" className="consoles" id="pc">PC</a>
              </li>
            <li>
              <a href="#" className="consoles" id="other">More...</a>
              </li>
          </ul>
  )
}
const SearchBar = (props) => {
  const handleForm = (e) => {
    e.preventDefault()
    props.setSearch(props.queried)
    props.onSubmit(e)
    
  }
  const [rendered, setRendered] = useState(false)
  const [selected, setSelected] = useState('All')
  const navigate = useNavigate()
  function changePage(number){
    navigate(`/mygaminglist/games/page/${number}`)
  }

  function filterQuery(platform){
    props.setFilter(platform)
  }

  useEffect(() => {
    if(!rendered && props.sub){
      const fetch = async() => {
        try{
        props.setLoading(true)
        props.offSubmit()
        }catch(error){
          alert('error')
        } finally {
          changePage(props.pageIndex)
          props.setTest(true)
        }
      }
      fetch()
    }
    else{
      setRendered(false)
    }
  }, [rendered, props.sub])
  

  return(
    <form role="search" id="form" onSubmit={handleForm}>
          <select className='fillin' name = "type" onChange={(e) => filterQuery(e.target.value)} >
            <option value = " ">All</option>
            <option value = "&platforms=14,1,186" >Xbox</option>
            <option value = "&platforms=18,16,19,187">Playstation</option>
            <option value = "&platforms=5,6,4">PC</option>
            <option value = "&platforms=7,8,9,10,11,83,43,105,24">Nintendo</option>
          </select>
          <input type="search" name="q" placeholder="Search Games" id="query" onChange={props.onChange}
          autoComplete='off' value = {props.queried}/>
          <div className='fillout'>
            <FaSearch className='searchicon'/>
          </div>
    </form>
  )
}

const Introbar = (props) => {

  let {gameID} = useParams()
  const path = window.location.pathname
  const [route, setRoute] = useState('')
  const [intro, setIntro] = useState('')
  console.log('path', path)

  console.log('id', gameID)

  // useEffect(()=> {
  //   setRoute(path)
  // }, [])

  // useEffect(() => {
  //   if(path.includes('newreview/')){
  //     setIntro('New Review')
  //   }
  
  //   if(path.includes('game/')){
  //     setIntro(`${props.selected} - Info and Details`)
  //   }
  //   if(path === `/games/page/${props.pageIndex}`){
  //     setIntro('Game Search')
  //   }
  //   if(path === '/' || props.reset){
  //     setIntro('Welcome to MyGamingList')
  //   }
  //   if(path === '/list'){
  //     setIntro('My List')
  //   }
  // }, [path])
  
  return(
    <div className="introbar">
            <p id="intro">{props.intro}</p>
    </div>
  )
}

const Homepage = ({reset, setReset, setIntro}) => {
  // if (props.reset === true){
  //   console.log('reset')
  //   window.localStorage.setItem('NUMBER', JSON.stringify(1))
  //   props.setReset(false)
  // }
  if (reset === true){
    console.log('reset')
    window.localStorage.setItem('NUMBER', JSON.stringify(1))
  }

  useEffect(()=> {
    setIntro('Welcome to my GamingList!')
  },[])


  return(
    <div className='homepage'>
      <div className='homepage-img-cont'>
        <p className='homepage-title' >MyGamingList<FaGamepad className='gamepad' 
        style={{filter: 'drop-shadow(3px 2px 1px grey)'}}/></p>
      </div>
      <div className='homepage-features'>
        <div className='homepage-feature'>
          <p className='feature-text'>Search<FaSearch className='feature-icon'/></p>
          <p className='feature-side'>search and gain info on thousands of games.</p>
        </div>
        <div className='homepage-feature'>
          <p className='feature-text'>Review<FaPencilAlt className='feature-icon'/></p>
          <p className='feature-side'>write reviews and share opinions.</p>
        </div>
        <div className='homepage-feature'>
          <p className='feature-text'>Keep Track<FaPlus className='feature-icon'/></p>
          <p className='feature-side'>list and categorize your games.</p>
        </div>
        <div className='homepage-feature'>
          <p className='feature-text'>Connect<FaPeopleArrows className='feature-icon'/></p>
          <p className='feature-side'>Coming soon...</p>
        </div>
      </div>
    </div>
  )
    
}

const Games = (props) => {
  let {number} = useParams()
  const [rendered, setRendered] = useState(false)
  const [show, setShow] = useState(false)
  const [data, setData] = useState([])
  const [added, setAdded] = useState(false)
  const [close, setClose] = useState(false)
  const [updated, setUpdated] = useState('completed')
  const checkForEntry = (gameID) =>`http://localhost:8000/api/v1/list/${gameID}`
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
    const newAPI = `https://api.rawg.io/api/games/${number}?key=b5aedefac9b64ffaae235769e69a62ee`
    props.setAPI(newAPI)
    props.setSelected(element.name)
    props.handleInfo(true)
    navigate(`/mygaminglist/game/${number}`)
  }

  const navReviews = (game) => {
    props.setSelected(game.name)
    navigate(`/mygaminglist/reviews/${game.id}`)
  }

  const displayEdit=async(thing)=> {
    const check = await axios.get(checkForEntry(thing.id))
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

  const saveToList = (status, data) => {
    const url = "http://localhost:8000/api/v1/list/new"

    const fetch = async() => {
      try{
        const response = await axios.post(url, {gameId: data.id, user: 'user', status: status, name: data.name, card: data.background_image })
        window.location.reload()
      }
      catch(error){
        alert(error)
      }
    }
    fetch()
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
                    Platforms: {platforms(element)}
                  </p>
              </div>
                <div className='review-functions'>
                  <div className='rev-butt-cont'>
                    <button id = "access-reviews" onClick={() => {navReviews(element)}} 
                    className='access-rev-button'>Reviews</button>
                    <button id = "access-my-reviews" onClick={() => {displayEdit(element)}} 
                    className='access-rev-button'>List</button>
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

const Info = (props) => {
  let {gameID} = useParams()
  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [added, setAdded] = useState(false)
  const [rendered, setRendered] = useState(false)
  const [ssindex, setssindex] = useState(1)
  const [data, setData] = useState([])
  const [updated, setUpdated] = useState('completed')
  const navigate = useNavigate()
  const genScreenshots = (gameID) => `https://api.rawg.io/api/games/${gameID}/screenshots?key=b5aedefac9b64ffaae235769e69a62ee`
  const checkForEntry = (gameID) =>`http://localhost:8000/api/v1/list/${gameID}`

  useEffect(()=> {
    props.setIntro(`${props.selected} - Info and Details`)
  })

  useEffect(() => {
    if(!rendered && gameID){
    const fetch = async() => {
      const check = await axios.get(checkForEntry(gameID))
      console.log(check.data)
      if(check.data.length !== 0){
        console.log('doin it')
        setAdded(true)
      }
      else{
        setAdded(false)
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

  const saveToList = (status) => {
    const url = "http://localhost:8000/api/v1/list/new"

    const fetch = async() => {
      try{
        const response = await axios.post(url, {gameId: gameID, user: 'user', status: status, name: results.name, card: results.background_image })
        window.location.reload()
      }
      catch(error){
        alert(error)
      }
    }
    fetch()
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
                {!added
                ?<button id = "list-add" className='game-buttons' onClick={()=>{displayEdit(results)}}><FaPlus className='plusicon'/>Add to List</button>
                :<button id = "list-added" className='game-buttons'><FaCheck className='plusicon'/>Added to List</button>}
                <button id = "review-add" className='game-buttons' onClick={()=>{navReview(results)}}><FaPencilAlt className='pencicon'/>Write a Review</button>
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
const Images = (props) => {
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
const Newreview = (props) => {
  
  const results = props.searchResults
  // const newreview = document.getElementById('new_review')
  // const user = document.getElementById('user')
  // const [reviewgameID, setReviewID] = useState(1)
  // const ratingOptions = document.getElementById('rating-options')
  let {gameID} = useParams()
  useEffect(()=> {
    props.setIntro(`${props.selected} - New Review`)
  },[])


  
  const saveReviews = async(reviewInputId, userInputId, newRating, id = "") => {
    const review = document.getElementById(reviewInputId).value;
    const saveReview = (id) => `http://localhost:8000/api/v1/reviews/${id}`
    const user = document.getElementById(userInputId).value;
    const rating = document.getElementById(newRating).value;

    console.log(JSON.stringify(review), JSON.stringify(rating), parseFloat(gameID))

    if(!id){
    const fetch = async() => {
      if(rating !== 'Select'){
      try{
        const response = await axios.post(saveReview('new'), {user: user, review: review, gameId: gameID, rating: rating})
        console.log(response)
      }
      catch(error){
        alert(error)
      }
      finally{
        location.reload()
      }
    }
    else{
      alert('Please select a rating!')
    }
  }
    fetch()
    }
  }

  if(results){
  return(
    <div className='review-background'>
      <ul className='list-categories' id = 'review-categories'>
        <Link to = {`/mygaminglist/reviews/${gameID}`} style = {{textDecoration: 'none', color: 'hsl(0, 96%, 29%)'}}>
          <li>My Reviews</li></Link>
        <li style = {{textDecoration: 'underline', fontSize: '25px'}}>New Review</li>
      </ul>
      <div id = 'new_review_id'>
        <div id = "review-header">
          <span id = "user"></span>
        </div>
        <div id = "review-content">
          <p className='review-game'><u>{props.selected}</u></p>
          <select id = "rating-options">
          <FaStar className='rating-star'/>
            <option selected ="selected" value = "Select" disabled>--Select a Rating--</option>
            <option value = "5">5</option>
            <option value = "4">4</option>
            <option value = "3">3</option>
            <option value = "2">2</option>
            <option value = "1">1</option>
          </select>
          <p className='review-bold'><b>Review</b></p>
          <textarea id = "new_review" className='edit-input'></textarea>
          <div className='save-cont'>
            <a id = "save-button" onClick={()=> saveReviews(document.getElementById('new_review').id, document.getElementById('user').id, 
            document.getElementById('rating-options').id)}>Save</a>
          </div>
        </div>
      </div>
    </div>
  )
  }
}
const Reviews = (props) => {
  const [rendered, setRendered] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editID, setEditID] = useState('')
  const [data, setData] = useState([])
  let {gameID} = useParams()

  useEffect(()=> {
    props.setIntro(`${props.selected} - Reviews`)
    console.log('reviews', reviews.length)
  })

  useEffect(() => {
      const fetch = async() => {
        try{
          props.setLoading(true)
          console.log(props.myAPI(gameID))
          const response = await axios.get(props.myAPI(gameID))
          props.setReviews(response.data)
        }catch(error){
          alert('Page does not Exist!')
          props.handleLoading()
        }finally{
          props.handleLoading()
          // setTest(false)
        }
        }
      fetch()
    }, [rendered])

  const reviews = props.reviews

  const editReviews = (id) => {
    setEditID(id)
  }

  const saveReviews = async(reviewInputId, userInputId, newRating, id = "") => {
    const review = document.getElementById(reviewInputId).value;
    const saveReview = (id) => `http://localhost:8000/api/v1/reviews/${id}`
    const user = document.getElementById(userInputId);
    const rating = document.getElementById(newRating).value;

    console.log(review, rating)
    console.log(reviewInputId)
  
      if (id) {
        const fetch = async() => {
          if(rating !== "Select" ){
          try{
            const response = await axios.put(saveReview(id), {user: user, review: review, rating: rating})
            console.log(response)
          }
          catch(error){
            alert(error)
          }
          finally{
            location.reload()
          }
        }
        else{
          alert('Please select a rating!')
        }
      }
        fetch()
      }
  }

  const deleteReviews = async(id) => {
    const myAPI = (revID) => `http://localhost:8000/api/v1/reviews/${revID}`
    
    const fetch = async() => {
      try{
        const response = await axios.delete(myAPI(id))
      }catch(error){
        alert(error)
      }
      finally{
        location.reload()
      }
    }
    fetch()
  }

  const editBox = (review) => (<textarea className='edit-input' id = {'review' + review._id}>
      {review.review}
    </textarea>)

  const ratingSelect = (review) => (<select className = 'review-select' id = {'rating' + review._id}>
      <option selected = "selected" value = "Select" >--Select--</option>
      <option value = "5">5</option>
      <option value = "4">4</option>
      <option value = "3">3</option>
      <option value = "2">2</option>
      <option value = "1">1</option>
    </select>)

  const saveButt = (reviewInputId, userInputId, ratingId, id) => (
    <a id = "save-button" onClick={() => {saveReviews(reviewInputId, userInputId, ratingId, id)}}>Save</a>
  )

  const displayDel=(thing)=> {
    props.setDel(true)
    setData(thing)
  }

if(props.loading){
  return(
    <Loader/>
  )
}

return(
<div className='review-background'>
  <ul className='list-categories' id = 'review-categories'>
          <li style = {{textDecoration: 'underline', fontSize: '25px'}}>My Reviews</li>
          <Link to = {`/mygaminglist/newreview/${gameID}`} style = {{textDecoration: 'none', color: 'hsl(0, 96%, 29%)'}}>
            <li>New Review</li></Link>
  </ul>
    {reviews.length > 0 ? (reviews.map((review) => (
      <div className='review-row' key = {review._id}>
        <div className='review-header'>
          <span id = 'user'>User</span>
          <span id = 'review-rating'>
            <FaStar className='rating-star'/>
            {review.rating}
          </span>
        </div>
        <div id = {review._id} className='review-content'>
          <p className='review-game'><u>{props.selected}</u></p>
          <b className='review-bold'>Review</b>
          {editID === review._id
          ? ratingSelect(review)
          : null}
          {editID === review._id
          ?editBox(review)
          :<p className='review-text'>{review.review}</p>}
          {editID === review._id
          ?<div className='review-features'>
              {saveButt('review' + review._id, 'user' + review._id, 'rating' + review._id, review._id )}
          </div>
          :
          <div className='review-features'>
            <FaPencilAlt id = "edit-butt" onClick={()=> {editReviews(review._id, review.review, review.user, review.rating)}}/>
            <FaTrashAlt id = "delete-butt" onClick={()=> {displayDel(review)}}/>
          </div>
          }
        </div>
        <div className='entry-backdrop' style={{display: props.del && 'block'}}>
            <div className='edit-entry'>
              <p className='edit-title-text' id = "del-header">Delete Review?</p>
              <div className='list-info' id = "del-verif">
                <button className='list-save' id = "del-verif-butt" onClick={()=> deleteReviews(data._id)}>Delete</button>
                <button className='list-save' id = "del-verif-butt" onClick={()=> props.setDel(false)}>Cancel</button>
              </div>
              </div>
          </div>
        <div className='opac-wrap' style={{display: (props.edit || props.del) ? 'block' : 'none'}}>
        </div>
      </div>
    ))):
    (<div className='no-results' style = {{backgroundColor: 'hsl(0, 1%, 90%)'}}>
        <h2 className='no-res-head'>NO REVIEWS FOUND...</h2>
        <FaHeartBroken className='heart-crack'/>
      </div>)
  }
  </div>
  )
// if (reviews.length == 0) {
//   return(
//   <div className='no-results'>
//     <h2 className='no-res-head'>NO REVIEWS FOUND...</h2>
//     <FaHeartBroken className='heart-crack'/>
//     </div>
// )}
}
const List = (props)=> {
  const [selected, setSelected] = useState("playing")
  const [updated, setUpdated] = useState('')
  const [show, setShow] = useState(false)
  const [changed, setChanged] = useState(true)
  let myUrl = `http://localhost:8000/api/v1/list/status/${selected}`
  const categories = ['completed', 'playing', 'plan to play', 'dropped']
  // const [edit, setEdit] = useState(false)
  const [data, setData] = useState([])

  useEffect(()=> {
    props.setIntro('My List')
  }, [])

  useEffect(() => {
    const fetch = async() => {
      try{
        props.setLoading(true)
        // console.log(props.myAPI(gameID))
        const response = await axios.get(myUrl)
        console.log(response.data)
        props.setList(response.data)
      }catch(error){
        alert(error)
        props.handleLoading()
      }finally{
        props.handleLoading()
        // setTest(false)
      }
      }
    fetch()
  }, [selected])

  // useEffect(()=> {
  //   const updateStatus = async() => {
  //     const fetch = async() => {
  //       try{
  //         if(updated!== ''){
  //         const response = await axios.put(`http://localhost:8000/api/v1/list/${data._id}`, {listId: data._id, user: data.user, status: updated, name: data.name, card: data.card})
  //         console.log(response.data)
  //         }
  //       }
  //       catch(error){
  //         alert(error)
  //       }
  //       finally{
  //         // location.reload()
  //       }
  //     }
  //     fetch()
  //   }
  //   updateStatus()
  // }, [updated])

  const updateStatus = async() => {
    const fetch = async() => {
      try{
        if(updated!== ''){
        const response = await axios.put(`http://localhost:8000/api/v1/list/${data._id}`, {listId: data._id, user: data.user, status: updated, name: data.name, card: data.card})
        console.log(response.data)
        }
      }
      catch(error){
        alert(error)
      }
      finally{
        location.reload()
      }
    }
    fetch()
  }

  const deleteList = async(id) => {
    const myAPI = (lisID) => `http://localhost:8000/api/v1/list/${lisID}`
    
    const fetch = async() => {
      try{
        const response = await axios.delete(myAPI(id))
      }catch(error){
        alert(error)
      }
      finally{
        location.reload()
      }
    }
    fetch()
  }

  const displayEdit=(thing)=> {
    props.setEdit(true)
    setShow(true)
    setData(thing)
  }

  const displayDel=(thing)=> {
    props.setDel(true)
    setShow(true)
    setData(thing)
  }

  const changeCategory = (categ) => {
    setSelected(categ)
  }

  const changeSelected = (event) => {
    setUpdated(event)
    setChanged(true)
  }

  const list = props.list


  if(props.loading){
    return(
      <Loader/>
    )
  }

  return (
    <div className='list-content'>
      <div className='list-cat-cont'>
        <ul className='list-categories'>
          {categories.map((category)=> (
            <li key = {category} onClick={()=>changeCategory(category)}
            style={{fontSize:selected===category ? '90%': '80%',
                    textDecoration: selected===category ? 'underline': 'none',}}>{category}</li>
          ))}
        </ul>
      </div>
      {list.map((entry)=> (
        <div className='list-row' id = {entry._id} key = {entry.id}>
          <img className = 'thumbnail' id = "list-thumb" src = {entry.card}></img>
          <Link to = {`/mygaminglist/game/${entry.gameId}`} 
          className='entry-name' onClick={()=>props.setSelected(entry.name)}>{entry.name}</Link>
          {/* <Link to = {`/reviews/${gameID}`} style = {{textDecoration: 'none', color: 'hsl(0, 96%, 29%)'}}> */}
          <div className='list-butts-cont'>
            <button className='list-butts' id = "delete-list" onClick={()=>displayDel(entry)}><FaTrashAlt/></button>
            <button className='list-butts' id = "edit-list" onClick={()=>displayEdit(entry)}>Edit<FaCaretDown/></button>
          </div>
          <div className={`entry-backdrop ${show? 'scale-in-center' : 'scale-out-center'}`} style={{display: props.edit && 'block'}}>
            <div className='edit-entry'>
              <p className='edit-title-text'>Edit List</p>
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
                <button className='list-save' onClick={()=> updateStatus()}>Submit</button>
                {/* <button className='list-save'>...</button> */}
              </div>
              </div>
              <FaTimesCircle className='exit-list' onClick={()=> {setShow(false); setTimeout(()=> {props.setEdit(false)}, 500)}}/>
        </div>
        <div className={`entry-backdrop ${show? 'scale-in-center' : 'scale-out-center'}`} style={{display: props.del && 'block'}}>
          <div className='edit-entry'>
            <p className='edit-title-text' id = "del-header">Delete From List?</p>
            <div className='list-info' id = "del-verif">
              <button className='list-save' id = "del-verif-butt" onClick={()=> deleteList(data._id)}>Delete</button>
              <button className='list-save' id = "del-verif-butt" onClick={()=> {setShow(false); setTimeout(()=> {props.setDel(false)}, 500)}}>Cancel</button>
            </div>
            </div>
        </div>
        </div>
      ))}
      <div className='opac-wrap' style={{display: (props.edit || props.del) ? 'block' : 'none'}}>
      </div>
      
    </div>
  )
}
const Footer = () => {

  return(
    <footer id="footer">
        <span id="copyright">© 2023</span>
        <span id="foottitle">MyVideoGameList</span>
        <span id="icons">
          {/* <i className="fa-brands fa-apple fa-lg" style="color: #ffffff"></i>
          <i className="fa-brands fa-google fa-lg" style="color: #000000"></i>
          <i className="fa-brands fa-facebook fa-lg" style="color: #1e3050"></i>
          <i className="fa-brands fa-twitter fa-lg" style="color: #ffffff"></i> */}
        </span>
        <nav id="footernav">
          <ul>
            <li><a href="">About</a></li>
            <li><a href="">Support</a></li>
            <li><a href="">Upgrade</a></li>
            <li><a href="">Terms of Service</a></li>
            <li><a href="">Privacy Policy</a></li>
          </ul>
        </nav>
      </footer>
  )
}
const App = () => {
  const [content, setContent] = useState('home')
  const [pageIndex, setPageindex] = useState(1)
  const [submitted, setSubmission] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [test, setTest] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState(false)
  const [selected, setSelected] = useState('')
  const [screenshots, setScreenshots] = useState('')
  const [reset, setReset] = useState(false)
  const [filter, setFilter] = useState('')
  const [reviews, setReviews] = useState([])
  const [list, setList] = useState([])
  const [queried, setQueried] = useState('')
  const [intro, setIntro] = useState('')
  const [edit, setEdit] = useState(false)
  const [del, setDel] = useState(false)

  const generateAPI = (pageIndex, search, filter) => `https://api.rawg.io/api/games?key=b5aedefac9b64ffaae235769e69a62ee&page=${pageIndex}&search=${search}${filter}`
  const generateInfo = (gameID) => `https://api.rawg.io/api/games/${gameID}?key=b5aedefac9b64ffaae235769e69a62ee`
  const myAPI = (gameID) => `http://localhost:8000/api/v1/reviews/game/${gameID}`

  const [API, setAPI] = useState(generateAPI(pageIndex, search, filter))
  const [rendered, setRendered] = useState(false)

  useEffect(()=>{
    if (test){
      console.log('tested', test)
    }
  }, [test])

  useEffect(()=> {
      console.log('load modified!', loading)
  }, [loading])

  useEffect(() => {
      if(!rendered && test){
        console.log('test')
        console.log(pageIndex)
        const fetch = async() => {
          try{
            setLoading(true)
            console.log('search', search, 'index', pageIndex)
            const response = await axios.get(generateAPI(pageIndex, queried, filter))
            console.log('response', response)
            setSearchResults(response.data)
          }catch(error){
            // alert('Page does not Exist!')
            handleLoading()
          }finally{
            handleLoading()
            setTest(false)
            console.log('complete')
          }
        }
      fetch()
      }
  
    }, [rendered, test])

    
  useEffect(()=>{
    const data = window.localStorage.getItem('SEARCH_RESULTS')
    const query = window.localStorage.getItem('QUERY')
    const selected = window.localStorage.getItem('SELECTED')
    const images = window.localStorage.getItem('SCREENSHOTS')
    console.log('localimages', images)
    if (data){
      setSearchResults(JSON.parse(data))
    }
    if (query && query.length > 3){
      console.log('length', query.length)
      setQueried(JSON.parse(query))
    }
    if(selected){
    setSelected(JSON.parse(selected))
    }
    // if(images){
    //   console.log('localimages', images)
    //   setScreenshots(JSON.parse(images))
    // }
  }, [])

  useEffect(() => {
    // if (screenshots){
    //   window.localStorage.setItem('SCREENSHOTS', JSON.stringify(screenshots))
    // }
    if (searchResults){
    window.localStorage.setItem('SEARCH_RESULTS', JSON.stringify(searchResults))
    }
    if (search) {
      window.localStorage.setItem('QUERY', JSON.stringify(search))
    }
    if (selected){
    window.localStorage.setItem('SELECTED', JSON.stringify(selected))
    }
  }, [searchResults, search , API, selected, screenshots])

  const handleSearch = (event) => {
    console.log('search', event.target.value)
    setQueried(event.target.value)
  }


  const handleHome = () => {
    setSearch('')
    setFilter(' ')
    setQueried('')
    window.localStorage.setItem('FILTER', ' ')
    document.querySelector('.fillin').value = " "
    window.localStorage.setItem('QUERY', '')
    setPageindex(1)
    setReset(true)
  }
  const handleLoading = () => {
    setLoading(false)
  }
  const handleAPI = (num) => {
    setAPI(num)
  }

  const handleTest = (bool) => {
    setTest(bool)
  }

  const updateSearchResults = (results) => {
    setSearchResults(results)
  }
  const handleSubmission = () => {
    setSubmission(true)
  }
  const resetSubmission = () => {
    setSubmission(false)
  } 
  const handleIndex = (index) => {
    setPageindex(index)
  }
  const handleInfo = () => {
    setInfo(false)
  }

  

  return(
    <Router>
      <div className='wrapper' >
        <div className='stick'>
          <Header handleClick = {handleHome}/>
          <div className='container2'>
            <Navbar updateSearchResults = {updateSearchResults} Api = {API} setAPI = {setAPI} submitted = {submitted}
             handleSubmission = {handleSubmission} resetSubmission = {resetSubmission} pageIndex = {pageIndex} queried = {queried}
             search = {search} handleSearch = {handleSearch} setSearch = {setSearch} handleClick = {handleHome} genAPI = {generateAPI}
             setLoading = {setLoading} setTest = {handleTest} filter = {filter} setFilter = {setFilter} reset = {reset}/>
            <Introbar filter = {filter} selected = {selected} pageIndex = {pageIndex} reset = {reset} intro = {intro}/>
          </div>
        </div>
        <div className='content'>
          <Routes>
            <Route path = "/mygaminglist/" element = {<Homepage reset = {reset} setReset = {setReset} setIntro = {setIntro}/>}>
            </Route>
            <Route path = "/mygaminglist/games/page/:number" element = {<Games searchResults = {searchResults} 
                        pageIndex = {pageIndex} handleIndex = {handleIndex}  genAPI = {generateAPI} 
                        handleSubmission = {handleSubmission} sub = {submitted} API = {API} setAPI = {handleAPI}
                        setTest = {handleTest} handleInfo = {handleInfo} test = {test} search = {search} reset = {reset}
                        setReset = {setReset} loading = {loading} setLoading = {setLoading} filter = {filter} 
                        setFilter = {setFilter} setSelected = {setSelected} setIntro = {setIntro} edit = {edit} setEdit = {setEdit}/>}>
            </Route>
            <Route path = "/mygaminglist/game/:gameID" element = {<Info searchResults = {searchResults} API = {API} updateSearchResults = {updateSearchResults}
                        info = {info} handleInfo = {handleInfo} genInfo = {generateInfo} screenshots = {screenshots} setScreenshots = {setScreenshots} 
                        setSelected = {setSelected} myAPI = {myAPI} setIntro = {setIntro} selected = {selected} edit = {edit} setEdit = {setEdit}/>}>
            </Route>
            <Route path = "/mygaminglist/game/:gameID/images" element = {<Images screenshots = {screenshots} setScreenshots = {setScreenshots} searchResults = {searchResults}/>}>
            </Route>
            <Route path = "/login" element = {<Login/>}>
            </Route>
            <Route path = "/mygaminglist/newreview/:gameID" element = {<Newreview genInfo = {generateInfo} searchResults = {searchResults} selected = {selected}
                        setIntro = {setIntro}
              />}>
            </Route>
            <Route path = "/mygaminglist/reviews/:gameID" element = {<Reviews myAPI = {myAPI} setReviews = {setReviews} reviews = {reviews} setLoading = {setLoading}
            handleLoading = {handleLoading} loading = {loading} selected = {selected} setIntro = {setIntro} del = {del} setDel = {setDel}/>}></Route>
            <Route path = "/loader" element = {<Loader/>}>
            </Route>
            <Route path = "/mygaminglist/list" element = {<List  loading = {loading} setLoading = {setLoading} handleLoading = {handleLoading} 
            setList = {setList} list = {list} setIntro = {setIntro} setSelected = {setSelected} edit = {edit} setEdit = {setEdit} del = {del} setDel = {setDel}/>} ></Route>
          </Routes> 
        </div>
        <Footer/>
      </div>
    </Router>
  )
}

export default App



