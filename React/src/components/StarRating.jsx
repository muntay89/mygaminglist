import { useState } from "react";
import {FaStar, FaStarHalfAlt, FaRegStar,} from "react-icons/fa";
import List from "../pages/List";

export default function StarRatingInput(props) {
    const [hoverValue, setHoverValue] = useState(null);
    let disabled = false
    
    const displayedValue =
        hoverValue !== null ? hoverValue : Number(props.rating) || 0;

    const getStarIcon = (starNumber) => {
        if (displayedValue >= starNumber) {
            return <FaStar aria-hidden="true" />;
        }

        if (displayedValue >= starNumber - 0.5) {
        return <FaStarHalfAlt aria-hidden="true" />
        }

        return <FaRegStar aria-hidden="true" />
    }

    const selectRating = (rating) => {
        if (!disabled) {
            props.setRating(rating);
        }
    }

    return (
        <div className="star-rating-input" style={{margin: props.list && '0 0 0 auto' }} role="radiogroup" onMouseLeave={() => setHoverValue(null)}>
            {[1, 2, 3, 4, 5].map((starNumber) => (
            <div className="interactive-star" key={starNumber}>
                <span className="star-visual">
                    {getStarIcon(starNumber)}
                </span>
                <button type="button" className="star-half star-half-left" role="radio" aria-label={`${starNumber - 0.5} out of 5 stars`}
                aria-checked={Number(props.rating) === starNumber - 0.5} disabled={disabled} onMouseEnter={() =>setHoverValue(starNumber - 0.5)}
                onFocus={() => setHoverValue(starNumber - 0.5)} onBlur={() => setHoverValue(null)} onClick={() => selectRating(starNumber - 0.5)}/>
                <button type="button" className="star-half star-half-right" role="radio"aria-label={`${starNumber} out of 5 stars`} 
                aria-checked={Number(props.rating) === starNumber} disabled={disabled} onMouseEnter={() => setHoverValue(starNumber)} 
                onFocus={() => setHoverValue(starNumber) } onBlur={() => setHoverValue(null)} onClick={() => selectRating(starNumber)}/>
            </div>))}
            {/* <span className="rating-number" aria-live="polite">
                {displayedValue > 0
                ? `${displayedValue}/5`
                : "Not rated"}
            </span> */}
        </div>
    );
    }