import { useEffect } from "react";
import { Link, useParams, useNavigate} from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Newreview (props) {
  const { user, isLoggedIn, login, logout } = useAuth();
  const results = props.searchResults
  const navigate = useNavigate()
  // const newreview = document.getElementById('new_review')
  // const user = document.getElementById('user')
  // const [reviewgameID, setReviewID] = useState(1)
  // const ratingOptions = document.getElementById('rating-options')
  let {gameID} = useParams()
  useEffect(()=> {
    props.setIntro(`${props.selected} - New Review`)
  },[])


  
  const saveReviews = async(reviewInputId, newRating) => {
    const review = document.getElementById(reviewInputId).value;
    const rating = document.getElementById(newRating).value;

    console.log(JSON.stringify(review), JSON.stringify(rating), parseFloat(gameID))

      if(rating !== 'Select'){
      try{
        await api.post(`/reviews/new`, { review, gameId: gameID, rating })
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
      alert('Please select a rating!')
    }
  }

  if(results){
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
          <select className="review-select" id = "rating-options">
          <FaStar className='rating-star'/>
            <option selected ="selected" value = "Select" disabled>--Select a Rating--</option>
            <option value = "5">5</option>
            <option value = "4">4</option>
            <option value = "3">3</option>
            <option value = "2">2</option>
            <option value = "1">1</option>
          </select>
          <p className='review-bold'>Review</p>
          <textarea id = "new_review" className='edit-input'></textarea>
          <div className='save-cont'>
            <a id = "save-button" onClick={() => saveReviews("new_review", "rating-options")}>Save</a>
          </div>
        </div>
      </div>
    </div>
  )
  }
}