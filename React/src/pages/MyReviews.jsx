import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from '../components/Loader';
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { FaStar, FaPencilAlt, FaTrashAlt, FaHeartBroken } from "react-icons/fa";

export default function MyReviews (props) {
  const { user, isLoggedIn, login, logout } = useAuth();
  const [rendered, setRendered] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editID, setEditID] = useState('')
  const [data, setData] = useState([])
  let {gameID} = useParams()

  useEffect(()=> {
    props.setIntro(`${props.selected} - Reviews`)
    console.log('reviews', reviews.length)
  }, [props.selected])

  useEffect(() => {
      const fetch = async() => {
        try{
          props.setLoading(true)
          // console.log(props.myAPI(gameID))
          const response = await api.get(`/reviews/my/game/${gameID}`)
          props.setReviews(response.data)
          console.log('reviewsContent', reviews, user.id)
        }catch(error){
          alert(error?.response?.data?.error ?? `Failed: ${error?.response?.status ?? error.message}`);
          props.handleLoading()
        }finally{
          props.handleLoading()
          // setTest(false)
        }
        }
      fetch()
    }, [])

  const reviews = props.reviews

  const editReviews = (id) => {
    setEditID(id)
  }

  const saveReviews = async(reviewInputId, newRating, id = "") => {
    const review = document.getElementById(reviewInputId).value;
    // const saveReview = (id) => `http://localhost:8000/api/v1/reviews/${id}`
    // const user = document.getElementById(userInputId);
    const rating = document.getElementById(newRating).value;

    console.log(review, rating)
    console.log(reviewInputId)
  
    if (!id) return

    if (id) {
      // const fetch = async() => {
        if(rating !== "Select" ){
        try{
          await api.put(`/reviews/${id}`, {
          //userId: "dev-user-123",        bridge until auth
          // OR if you want to keep your existing field until backend changes:
          review,
          rating,})
          // console.log(response)
          props.setReviews((prev) =>
          prev.map((r) =>
            r._id === id ? { ...r, review, rating } : r
          ))
          setEditID("");
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
  }

  const deleteReviews = async(id) => {
    // const myAPI = (revID) => `http://localhost:8000/api/v1/reviews/${revID}`
    
    // const fetch = async() => {
      try{
        // const response = await axios.delete(myAPI(id))
        await api.delete(`/reviews/${id}`);
        props.setReviews((prev) => prev.filter((r) => r._id !== id));
        props.setDel(false)
      }catch(error){
        alert(error)
      }
      // finally{
      //   location.reload()
      // }
  }

  const editBox = (review) => (<textarea className='edit-input' id = {'review' + review._id}>
      {review.review}
    </textarea>)

  const ratingSelect = (review) => (<select className = 'review-select' id = {'rating' + review._id}>
      <option selected = "selected" value = "Select" >-Select-</option>
      <option value = "5">5</option>
      <option value = "4">4</option>
      <option value = "3">3</option>
      <option value = "2">2</option>
      <option value = "1">1</option>
    </select>)

  const saveButt = (reviewInputId, ratingId, id) => (
    <a id = "save-button" onClick={() => {saveReviews(reviewInputId, ratingId, id)}}>Save</a>
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
          <li style = {{textDecoration: 'underline', fontSize: '90%'}}>My Reviews</li>
          <Link to = {`/mygaminglist/reviews/${gameID}`} style = {{textDecoration: 'none', color: 'hsl(0, 96%, 29%)', fontSize: '80%'}}>
            <li>Reviews</li></Link>
          <Link to = {`/mygaminglist/newreview/${gameID}`} style = {{textDecoration: 'none', color: 'hsl(0, 96%, 29%)', fontSize: '80%'}}>
            <li>New Review</li></Link>
  </ul>
    {reviews.length > 0 ? (reviews.map((review) => (
      <div className='review-row' key = {review._id}>
        <div className='review-header'>
          <span id = 'user'>{review.username}</span>
          <span id = 'review-rating'>
            <FaStar className='rating-star'/>
            {review.rating}
          </span>
        </div>
        <div id = {review._id} className='review-content'>
          <p className='review-game'><u>{props.selected}</u></p>
          {/* <p className='review-bold'>Review</p> */}
          {editID === review._id && isLoggedIn && review.userId === user.id
          ? ratingSelect(review)
          : null}
          {editID === review._id && isLoggedIn && review.userId === user.id
          ?editBox(review)
          :<p className='review-text'>{review.review}</p>}
          {editID === review._id && isLoggedIn && review.userId === user.id
          ?(<div className='review-features'>
              {saveButt('review' + review._id, 'rating' + review._id, review._id )}
          </div>
          ) : (
          <div className='review-features'>
            {isLoggedIn && review.userId === user.id ? (
              <>
              <div className="review-features-buttons" onClick={()=> {editReviews(review._id, review.review, review.user, review.rating)}}>
                <FaPencilAlt id = "edit-butt"/>
                <span style={{fontFamily: 'VT323, monospace', marginLeft: '10px', fontSize: '20px',
                  color: 'hsl(0, 96%, 29%)', cursor:'pointer', textAlign: 'center'}}>Edit</span>
              </div>
              <div className="review-features-buttons" style={{marginLeft: 'auto'}} onClick={()=> {displayDel(review)}}>
                <FaTrashAlt id = "delete-butt" />
                  <span style={{fontFamily: 'VT323, monospace', marginLeft: '10px', fontSize: '20px',
                    color: 'hsl(0, 96%, 29%)', cursor:'pointer' }}>Delete</span>
              </div>
              </>
            ) : null}
          </div>
          )}
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