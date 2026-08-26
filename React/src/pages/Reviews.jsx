import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { api } from "../api/client";
import { FaStar, FaHeartBroken, FaStarHalfAlt, FaRegStar, FaUser } from "react-icons/fa";

export default function Reviews(props) {
  const { gameID } = useParams();
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [hasReview, setHasReview] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    props.setIntro(`${props.selected} - Reviews`);
  }, [props.selected]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await api.get(`/reviews/game/${gameID}`);
        const reviewCheck = await api.get(`/reviews/my/game/${gameID}`)
        setReviews(response.data)
        setHasReview(reviewCheck.data?.length > 0)
      } catch (error) {
        alert(
          error?.response?.data?.error ??
            `Failed: ${error?.response?.status ?? error.message}`
        );
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [gameID]);

  if (reviewsLoading) {
    return <Loader />;
  }

  return (
    <div className="review-background">
      <ul className="list-categories" id="review-categories">
        {hasReview && (<Link
          to={`/mygaminglist/myreviews/${gameID}`}
          style={{ textDecoration: "none", color: "hsl(0, 96%, 29%)", fontSize: '80%'}}
        >
          <li>My Review</li>
        </Link>)}
        <li style={{ textDecoration: "underline", fontSize: '90%' }}>
          Reviews
        </li>
        {!hasReview && (<Link
          to={`/mygaminglist/newreview/${gameID}`}
          style={{ textDecoration: "none", color: "hsl(0, 96%, 29%)", fontSize: '80%'}}
        >
          <li>New Review</li>
        </Link>)}
      </ul>

      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div className="review-row" key={review._id}>
            <div className="review-header">
              <Link id="user" to = {`/mygaminglist/profile/${review.username}`}>
                <FaUser style={{marginRight: '10px'}}/>{review.username}</Link>
              <span id="review-rating">
                {[1, 2, 3, 4, 5].map((star) => {
                  const rating = Number(review.rating);
                  if (rating >= star) {
                    return (<FaStar key={star} style={{ color: "hsl(0, 96%, 29%)" }}/>)
                  }
                  if (rating >= star - 0.5) {
                    return (<FaStarHalfAlt key={star} style={{ color: "hsl(0, 96%, 29%)" }}/>)
                  }
                  return (<FaRegStar key={star} style={{ color: "hsl(0, 96%, 29%)" }}/>)
                })}
              </span>
            </div>

            <div id={review._id} className="review-content">
              <p className="review-game" id = 'public-reviews-game' onClick={() => navigate(`/mygaminglist/game/${gameID}`)}>
                <u>{props.selected}</u>
              </p>
              <p className="review-text">{review.review}</p>
            </div>
          </div>
        ))
      ) : (
        <div
          className="no-results"
          style={{ backgroundColor: "hsl(0, 1%, 90%)" }}
        >
          <h2 className="no-res-head">NO REVIEWS FOUND...</h2>
          <FaHeartBroken className="heart-crack" />
        </div>
      )}
    </div>
  );
}