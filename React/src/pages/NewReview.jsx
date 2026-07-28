import { useState, useEffect } from "react";
import { Link, useParams, useNavigate} from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import StarRatingInput from "../components/StarRating";

export default function Newreview (props) {
  const { user, isLoggedIn, login, logout } = useAuth();
  const navigate = useNavigate()
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState('5')
  let {gameID} = useParams()
  useEffect(()=> {
    props.setIntro(`${props.selected} - New Review`)
  },[])


  
  const saveReviews = async() => {

      if(rating !== 'Select' && reviewText !== '' || null){
        try{
          await api.post(`/reviews/new`, { review: reviewText.trim(), gameId: gameID, gameTitle: props.selected, rating: Number(rating) })
          navigate(`/mygaminglist/reviews/${gameID}`);
          // console.log(response)
        }
        catch(error){
          alert(error)
        }
        // finally{
        //   location.reload()
        // }
    }
    else{
      alert('Review cannot be empty')
    }
  }

  
  return(
    <div className='review-background'>
      <ul className='list-categories' id = 'review-categories'>
         <Link to = {`/mygaminglist/myreviews/${gameID}`} style = {{textDecoration: 'none', color: 'hsl(0, 96%, 29%)', fontSize: '80%'}}>
          <li>My Reviews</li></Link>
        <Link to = {`/mygaminglist/reviews/${gameID}`} style = {{textDecoration: 'none', color: 'hsl(0, 96%, 29%)', fontSize: '80%'}}>
          <li>Reviews</li></Link>
        <li style = {{textDecoration: 'underline', fontSize: '90%'}}>New Review</li>
      </ul>
      <div id = 'new_review_id'>
        <div id = "review-content">
          <p className='review-game'><u>{props.selected}</u></p>
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