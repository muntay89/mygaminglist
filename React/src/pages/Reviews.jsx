import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { api } from "../api/client";
import { FaStar, FaHeartBroken } from "react-icons/fa";

export default function Reviews(props) {
  const { gameID } = useParams();
  const reviews = props.reviews;

  useEffect(() => {
    props.setIntro(`${props.selected} - Reviews`);
  }, [props.selected]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        props.setLoading(true);
        const response = await api.get(`/reviews/game/${gameID}`);
        props.setReviews(response.data);
      } catch (error) {
        alert(
          error?.response?.data?.error ??
            `Failed: ${error?.response?.status ?? error.message}`
        );
      } finally {
        props.handleLoading();
      }
    };

    fetchReviews();
  }, [gameID]);

  if (props.loading) {
    return <Loader />;
  }

  return (
    <div className="review-background">
      <ul className="list-categories" id="review-categories">
        <Link
          to={`/mygaminglist/myreviews/${gameID}`}
          style={{ textDecoration: "none", color: "hsl(0, 96%, 29%)", fontSize: '80%'}}
        >
          <li>My Reviews</li>
        </Link>
        <li style={{ textDecoration: "underline", fontSize: '90%' }}>
          Reviews
        </li>
        <Link
          to={`/mygaminglist/newreview/${gameID}`}
          style={{ textDecoration: "none", color: "hsl(0, 96%, 29%)", fontSize: '80%'}}
        >
          <li>New Review</li>
        </Link>
      </ul>

      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div className="review-row" key={review._id}>
            <div className="review-header">
              <span id="user">{review.username}</span>
              <span id="review-rating">
                <FaStar className="rating-star" />
                {review.rating}
              </span>
            </div>

            <div id={review._id} className="review-content">
              <p className="review-game">
                <u>{props.selected}</u>
              </p>
              {/* <p className="review-bold">Review</p> */}
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