import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from '../components/Loader';
import StarRatingInput from "../components/StarRating";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { FaStar, FaPencilAlt, FaTrashAlt, FaHeartBroken, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function MyReviews (props) {
  const { user, isLoggedIn, login, logout } = useAuth()
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [editReviewText, setEditReviewText] = useState("")
  const [editRating, setEditRating] = useState(0)
  const [saving, setSaving] = useState(false)
  const [editID, setEditID] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [data, setData] = useState([])
  let {gameID} = useParams()

  useEffect(()=> {
    props.setIntro(`${props.selected} - Reviews`)
    console.log('reviews', reviews.length)
  }, [props.selected])

  useEffect(() => {
      const fetch = async() => {
        try{
          setReviewsLoading(true)
          // console.log(props.myAPI(gameID))
          const response = await api.get(`/reviews/my/game/`)
          setReviews(response.data)
          console.log('reviewsContent', reviews, user.id)
        }catch(error){
          alert(error?.response?.data?.error ?? `Failed: ${error?.response?.status ?? error.message}`);
          setReviewsLoading(false)
        }finally{
          setReviewsLoading(false)
          // setTest(false)
        }
        }
      fetch()
    }, [])


  const editReviews = (review) => {
    setEditID(review._id)
    setEditReviewText(review.review)
    setEditRating(Number(review.rating))
  }

  const saveReviews = async(id) => {
    const review = editReviewText.trim()
    if (!id) return
    if (!review) {
      alert("Review cannot be empty.");
      return;
    }

    if (!editRating) {
      alert("Please select a rating.");
      return;
    }

    try{
      setSaving(true)
      await api.put(`/reviews/${id}`, {
      review,
      rating: Number(editRating),})
      setReviews((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, review, rating: Number(editRating) } : r
        ))
      setEditID("")
      setEditReviewText("");
      setEditRating(0);
    }
      catch(error){
        alert(error)
      }
      finally{
        setSaving(false)
      }
  
  }

  const deleteReviews = async(id) => {
    // const myAPI = (revID) => `http://localhost:8000/api/v1/reviews/${revID}`
    
    // const fetch = async() => {
      try{
        // const response = await axios.delete(myAPI(id))
        await api.delete(`/reviews/${id}`);
        setReviews((prev) => prev.filter((r) => r._id !== id));
        setDeleteOpen(false)
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



  const displayDel=(thing)=> {
    setDeleteOpen(true)
    setData(thing)
  }

if(reviewsLoading){
  return(
    <Loader/>
  )
}

return(
<div className='review-background'>
  <ul className='list-categories' id = 'review-categories'>
          <li style = {{textDecoration: 'underline', fontSize: '90%'}}>My Reviews</li>
          {/* <Link to = {`/mygaminglist/reviews/${gameID}`} style = {{textDecoration: 'none', color: 'hsl(0, 96%, 29%)', fontSize: '80%'}}>
            <li>Reviews</li></Link>
          <Link to = {`/mygaminglist/newreview/${gameID}`} style = {{textDecoration: 'none', color: 'hsl(0, 96%, 29%)', fontSize: '80%'}}>
            <li>New Review</li></Link> */}
  </ul>
    {reviews.length > 0 ? (reviews.map((review) => (
      <div className='review-row' key = {review._id}>
        <div className='review-header'>
          <span id = 'user'>{review.username}</span>
          {editID !== review._id && isLoggedIn  && (
          <span id = 'review-rating'>
            {[1, 2, 3, 4, 5].map((star) => {
              const rating = Number(review.rating);
              if (rating >= star) {
                return (<FaStar key={star} style={{ color: "hsl(0, 96%, 29%)" }}/>)
              }
              if (rating >= star - 0.5) {
                return (<FaStarHalfAlt key={star} style={{ color: "hsl(0, 96%, 29%)" }}/>)
              }
              return ( <FaRegStar key={star} style={{ color: "hsl(0, 96%, 29%)" }}/>)
            })}
          </span>)}
        </div>
        <div id = {review._id} className='review-content'>
          <p className='review-game' id = 'public-reviews-game'><u>{review.gameTitle}</u></p>
          {/* <p className='review-bold'>Review</p> */}
          {editID === review._id && isLoggedIn && review.userId === user.id
          ? (<><textarea id = "new_review" className='edit-input' value = {editReviewText} onChange={(e) => setReviewText(e.target.value)}></textarea>
              <div className="review-final">
                <StarRatingInput rating = {editRating} setRating = {setEditRating}></StarRatingInput>
                <div className='save-cont' style={{gap: '15px'}}>
                  <a id = "save-button" onClick={() => {setEditID(""); setEditReviewText(""); setEditRating(0);}} disabled = {saving}>Cancel</a>
                  <a id = "save-button" onClick={() => saveReviews(review._id)} disabled = {saving}>Save</a>
                </div>
              </div></>)
          : (<>
            <p className='review-text'>{review.review}</p>
            <div className='review-features'>
              {isLoggedIn && review.userId === user.id ? (
                <>
                <div className="review-features-buttons" onClick={()=> {editReviews(review)}}>
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
          </>)}
          
        </div>
        <div className='entry-backdrop' style={{display: deleteOpen && 'block'}}>
            <div className='edit-entry'>
              <p className='edit-title-text' id = "del-header">Delete Review?</p>
              <div className='list-info' id = "del-verif">
                <button className='list-save' id = "del-verif-butt" onClick={()=> deleteReviews(data._id)}>Delete</button>
                <button className='list-save' id = "del-verif-butt" onClick={()=> setDeleteOpen(false)}>Cancel</button>
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