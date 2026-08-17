import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from '../components/Loader';
import StarRatingInput from "../components/StarRating";
import { api } from "../api/client";


import { FaPlus, FaCheck, FaPencilAlt, FaImage, FaStar, FaTimesCircle, FaHeart, FaRegHeart, FaHeartBroken, FaComment } from "react-icons/fa";

export default function Info (props) {
  let {gameID} = useParams()
  const { isLoggedIn } = useAuth();
  const [game, setGame] = useState(null)
  const [screenshots, setScreenshots] = useState([])
  const [edit, setEdit] = useState(false)
  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [added, setAdded] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [data, setData] = useState([])
  const [listEntry, setListEntry] = useState(null)
  const [updated, setUpdated] = useState('playing')
  const [rating, setRating] = useState('')
  const [favoriteAnim, setFavoriteAnim] = useState(false)
  const [deals, setDeals] = useState([])
  const [dealGame, setDealGame] = useState(null)
  const [dealsLoading, setDealsLoading] = useState(false) 
  const navigate = useNavigate()
  const checkForEntry = (gameID) => api.get(`/list/${gameID}`)


  useEffect(() => {
    const fetch = async() => {
      try{
        setLoading(true)
        const response = await api.get(`/igdb/games/${gameID}`)
        const images = await api.get(`/igdb/games/${gameID}/screenshots`)
        setGame(response.data)
        setScreenshots(images.data.results  ?? [])
        if (isLoggedIn){
          const check = await checkForEntry(gameID)
          if(check.data.length !== 0){
            setAdded(true)
            setListEntry(check.data[0])
            setFavorite(check.data[0].favorite === true)
          }
          else{
            setAdded(false)
            setListEntry(null);
            setFavorite(false)
        }
        }
    } catch(error) {
      console.error('error')
    } finally {
      setLoading(false)
    }
    }
    if (gameID){
      fetch()
    }
  }, [gameID, isLoggedIn])

  useEffect(() => {
    async function getDeals() {
      if (!game?.name) return

      try {
        setDealsLoading(true)

        const response = await api.get("/deals/cheapshark/search", {
          params: {
            title: game.name
          }
        });
        setDealGame(response.data.game)
        setDeals(response.data.deals)
      } catch (error) {
        console.error("Could not load CheapShark deals:", error)
        setDeals([])
      } finally {
        setDealsLoading(false);
      }
    }

    getDeals()
}, [game?.name])

  useEffect(()=> {
    if(game) {
    props.setIntro(`${game.name} - Info and Details`)
    }
  }, [game, props.setIntro])

  const results = game

  const saveToList = async(status, gameRating) => {
    if (status === 'completed' && (gameRating === "" || gameRating == 'Select' )) {
      alert("Please select a rating.");
      return;
    }
    try{
      const response = await api.post('/list/new', {
        gameId: gameID,
        status,
        name: results.name,
        rating:  status === "completed" ? gameRating : null,
        card: results.background_image,
      })
      setShow(false)
      setListEntry(response.data.entry)
      console.log('RESPONSEE', listEntry)
      setTimeout(() => setEdit(false), 200);
      setAdded(true);
    }
    catch (error){
      alert(error)
    }
  }

  const saveToFavorites = async() => {
    if (!listEntry) {
      alert("Add this game to your list before favoriting it.")
      return
    }
    const favoriteValue = !listEntry.favorite
    try{
      await api.put(`/list/${listEntry._id}`, {
        favorite: favoriteValue,
      })
      setFavorite(favoriteValue);
      setListEntry({ ...listEntry, favorite: favoriteValue })
      triggerFavoriteAnimation()
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
 const triggerFavoriteAnimation = () => {
    setFavoriteAnim(false)

    requestAnimationFrame(() => {
      setFavoriteAnim(true)
    })

    setTimeout(() => {
      setFavoriteAnim(false);
    }, 300)
  }
  const repl = (descr) => {
    let newText = descr.replace(/###/g, '\n')
    return newText
  }

  const displayEdit=(thing)=> {
    setData(thing)
    setUpdated('playing')
    setRating('')
    setEdit(true)
    setShow(true)
  }

  const changeSelected = (event) => {
    setUpdated(event)
    console.log('updated', updated)

    if (event !== "completed") {
      setRating("")
    }
  }

  const navReview = (game) => {
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
            {screenshots.length > 1 ? (
            <span className='misc-images'>
              <img src = {screenshots[0].image} onClick={() => {navSS(results)}}></img>
              {screenshots[1] &&<img src = {screenshots[1].image} onClick={() => {navSS(results)}}></img>}
              {screenshots[2] &&<img src = {screenshots[2].image} onClick={() => {navSS(results)}}></img>}
              <FaImage size = {40} className='icon-overlay' onClick={() => {navSS(results)}}/>
            </span>) : 
            (<div className="misc-images" onClick={() => {navSS(results)}} 
            style={{color: 'hsl(0, 96%, 29%)', display: 'flex', flexDirection: 'column', cursor: 'pointer'}}>
              <FaHeartBroken className="misc-images" style={{margin: '10px auto'}}/> 
              <h4 style={{margin: '0 auto'}}>Images not Available..</h4>
            </div>)

            }
          </div>
          <div className='details'>
              <div className='details-container'>
                <div className="details-item" id = "game-genres">
                  <span id = "genre-title"><b>Genres: </b> </span>
                  <span style = {{fontFamily: 'Georgia, Times New Roman, Times, serif', fontSize: '15px'}}>{genres(results)}</span>
                </div>
                <div className="details-item" id = "release-date">
                  <span id = "release-title"><b>Release Date: </b></span>
                  <span style = {{fontFamily: 'Georgia, Times New Roman, Times, serif', fontSize: '15px'}}>{results.released}</span>
                </div>
                <div className="details-item"  id = "publisher">
                  <span id = 'publisher-title'><b>Publisher(s): </b></span>
                  <span style = {{fontFamily: 'Georgia, Times New Roman, Times, serif', fontSize: '15px'}}>{publishers(results)}</span>
                </div>
                <div className="details-item" id = "platfrms">
                  <span id = 'platfrm-ttle'><b>Platforms: </b></span>
                  <span style = {{fontFamily: 'Georgia, Times New Roman, Times, serif', fontSize: '15px'}}>{platforms(results)}</span>
                </div>
                <div id = "butt-cont">
                  {isLoggedIn ? (
                  <>
                  {!added
                  ?<button id = "list-add" className='game-buttons' onClick={()=>{displayEdit(results)}}><FaPlus className='plusicon' style={{marginRight: '5px', verticalAlign: 'center'}}/>Add to List</button>
                  :<button id = "list-added" className='game-buttons'><FaCheck style={{marginRight: '5px', verticalAlign: 'center'}}/>Added to List</button>}
                  <button id = "review-add" className='game-buttons' onClick={()=>{navReview(results)}}><FaPencilAlt style={{marginRight: '5px', verticalAlign: 'center'}}/>Write a Review</button>
                  <button className="game-buttons" style={{ backgroundColor: "white" }} onClick={saveToFavorites}>
                    <div className={`favorite-wrapper ${favoriteAnim ? "favorite-active" : ""}`}>
                      {favorite ? (<FaHeart style={{color: "hsl(0, 96%, 29%)", fontSize: "20px", verticalAlign: 'center'}}/>) : 
                      (<FaRegHeart style={{color: "hsl(0, 96%, 29%)", fontSize: "20px", verticalAlign: 'center'}}/>)}
                        <span className="pixel pixel1"></span>
                        <span className="pixel pixel2"></span>
                        <span className="pixel pixel3"></span>
                        <span className="pixel pixel4"></span>
                    </div>
                  </button>
                  <button className='game-buttons' onClick={()=> {navigate(`/mygaminglist/reviews/${results.id}`)}}><FaComment style={{marginRight: '5px', verticalAlign: 'center',}}/>Reviews</button>
                  </>
                  ) : (
                    <button className='game-buttons' onClick={()=> {navigate(`/mygaminglist/reviews/${results.id}`)}}><FaComment style={{marginRight: '5px', verticalAlign: 'center',}}/>Reviews</button>

                  )}
                </div>
                <div className={`entry-backdrop ${show? 'scale-in-center' : 'scale-out-center'}`} style={{display: edit ? 'block' : 'none'}}>
                    <div className='edit-entry'>
                      <p className='edit-title-text'>Add to List?</p>
                      <div className='list-info'>
                        <div className='list-game'>
                          <p className='list-p' >Game Title:</p>
                          <p className = "list-game-title">{data.name}</p>
                        </div>
                        <div className='list-details'>
                          <p className='list-p'>Status:</p>
                          <div className="edit-status" style={{letterSpacing: 'normal'}}>
                            <div style= {{backgroundColor: updated === 'completed' ? 'hsl(0, 96%, 29%)' : 'white', color: updated === 'completed' 
                              ? 'white': 'hsl(0, 96%, 29%)', margin: 'auto 0 0 auto' }} value = 'completed' onClick={(event) => changeSelected('completed')}>completed</div>
                            <div style= {{backgroundColor: updated === 'playing' ? 'hsl(0, 96%, 29%)' : 'white', color: updated === 'playing' 
                              ? 'white': 'hsl(0, 96%, 29%)', margin: 'auto 0 0 auto'}} value = 'playing' onClick={(event) => changeSelected('playing')}>playing</div>
                            <div style= {{backgroundColor: updated === 'plan to play' ? 'hsl(0, 96%, 29%)' : 'white', color: updated === 'plan to play' 
                              ? 'white': 'hsl(0, 96%, 29%)', margin: 'auto 0 0 auto'}} value = 'plan to play' onClick={(event) => changeSelected('plan to play' )}>plan to play</div>
                            <div style= {{backgroundColor: updated === 'dropped' ? 'hsl(0, 96%, 29%)' : 'white', color: updated === 'dropped' 
                              ? 'white': 'hsl(0, 96%, 29%)', margin: 'auto 0 0 auto'}} value = 'dropped' onClick={(event) => changeSelected('dropped')}>dropped</div>
                          </div>
                        </div>
                        {updated === 'completed' && (
                        <div className = 'list-rating'>
                          <p>Rating:</p>
                          <StarRatingInput list = {true} rating = {rating} setRating = {setRating}></StarRatingInput>
                        </div>)}
                        <button className='list-save' onClick={()=> saveToList(updated, rating)}><FaPlus className='plusicon' id = 'add-lis-cat'/></button>
                      </div>
                    </div>
                      <FaTimesCircle className='exit-list' onClick={()=> {setShow(false); setTimeout(()=> {setEdit(false)}, 500)}}/>
                </div>
              
              </div>
          </div>
        </div>
        <div id = "info-container">
          <div id='info-stick'>
            <div id = "info-title">{results.name}</div>
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
            {repl(results.description_raw)}
          </div>
          <div className="game-deals">
            <div className="deals-header">
              <p className="deals-title">Deals</p>
              {dealsLoading && <p>Loading prices...</p>}
              {dealGame?.cheapestPriceEver && (
                <p id = 'deals-lowest'>
                  Lowest recorded price: 
                  <strong style={{fontFamily: 'Cambria', fontSize: '15px'}}>  ${dealGame.cheapestPriceEver}</strong>
                </p>
              )}
            </div>
            <div className="deals-container">
              {deals.filter((deal) => Number(deal.price) < Number(deal.retailPrice)).map ((deal) =>(
                  <div key={deal.dealID} className="deal-result">
                    <p className="deal-header"><u>{deal.storeName}</u></p>
                    <div className="deal-price-cont">
                      <div >
                        <u>Deal</u>
                        <p style={{margin: '0', fontFamily: 'Cambria'}}>${deal.price}</p>
                      </div>
                      <p style={{color: 'hsl(0, 96%, 29%)'}}>{deal.savings}% off</p>
                      <div >
                        <u>Retail</u>
                        <p className="retail-price" style={{margin: '0', fontFamily: 'Cambria'}}>${deal.retailPrice}</p>
                      </div>
                    </div>
                    <a href={deal.dealURL} target="_blank" rel="noreferrer" className = 'deal-link' 
                    style={{marginBottom: '25px'}}>View Deal</a>
                  </div>
              ))}
              {!dealsLoading && deals.length === 0 && (
                <p style={{textAlign: 'center'}}>No Deals found <FaHeartBroken style={{color: 'hsl(0, 96%, 29%)'}}/></p>
              )}
            </div>
          </div>
        </div>
        <div className='opac-wrap' style={{display: edit ? 'block' : 'none'}}></div>
      </div>
    )
    }
  }