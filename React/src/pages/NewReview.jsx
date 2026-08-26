import { useState, useEffect } from "react";
import { Link, useParams, useNavigate} from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Loader from "../components/Loader";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import StarRatingInput from "../components/StarRating";

export default function Newreview (props) {
  const { user, isLoggedIn, login, logout } = useAuth();
  const navigate = useNavigate()
  const [reviewText, setReviewText] = useState('')
  const [game, setGame] = useState(null)
  const [rating, setRating] = useState('5')
  let {gameID} = useParams()
  useEffect(()=> {
    const loadData = async () => {
      try{
        const gameResponse = await api.get(`/igdb/games/${gameID}`)
        const reviewResponse = await api.get(`/reviews/my/game/${gameID}`)
        setGame(gameResponse.data)
        if(reviewResponse.data?.length > 0) {
          navigate(`/mygaminglist/myreviews/${gameID}`)
          return 
        }
        props.setIntro(`${game.name} - New Review`)
      }
      catch(error) {
        console.error('Unable to load game:', error)
      }
    }

    loadData()
  },[])


  
  const saveReviews = async() => {

      if(rating !== 'Select' && reviewText.trim() != ''){
        try{
          if (!game) {
            alert('Game data is still loading')
            return
          }
          await api.post(`/reviews/new`, { review: reviewText.trim(), gameId: gameID, 
            gameTitle: game.name, gameImage: game.background_image, rating: Number(rating) })
          navigate(`/mygaminglist/reviews/${gameID}`)
        }
        catch(error){
          alert(error)
        }
    }
    else{
      alert('Review cannot be empty')
    }
  }

  if(!game) {
    return (<Loader/>)
  }
  
  return(
    <div className='review-background'>
      <ul className='list-categories' id = 'review-categories'>
        <Link to = {`/mygaminglist/reviews/${gameID}`} style = {{textDecoration: 'none', color: 'hsl(0, 96%, 29%)', fontSize: '80%'}}>
          <li>Reviews</li></Link>
        <li style = {{textDecoration: 'underline', fontSize: '90%'}}>New Review</li>
      </ul>
      <div id = 'new_review_id'>
        <div id = "review-content">
          <div className="new_review_header">
            <p className='review-game'><u>{game ? game.name : 'Loading'}</u></p>
            {game && (<img src = {game.background_image} className="review-card" ></img>)}
          </div>
          <p className='review-bold'>Review</p>
          <textarea id = "new_review" className='edit-input' value = {reviewText} onChange={(e) => setReviewText(e.target.value)}></textarea>
          <div className="review-final">
            <StarRatingInput rating = {rating} setRating = {setRating}></StarRatingInput>
            <div className='save-cont'>
              <a id = "save-button" onClick={() => saveReviews()}>Publish</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}