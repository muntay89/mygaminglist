import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Loader from '../components/Loader';
import { api } from "../api/client";


import { FaStar, FaStarHalfAlt, FaRegStar, FaHeartBroken } from "react-icons/fa";

export default function PublicList (props) {
  const categories = ['completed', 'playing', 'plan to play', 'dropped']
  const [searchParams] = useSearchParams()
  const {username} = useParams()
  const navigate = useNavigate()
  const requestedStatus = searchParams.get('status')
  const selected = categories.includes(requestedStatus)?requestedStatus:'playing'
  const [list, setList] = useState([])
  const [listLoading, setListLoading] = useState(true);

  useEffect(()=> {
    props.setIntro(`${username}'s List`)
  }, [username, props.setIntro])

  useEffect(() => {
    const fetch = async() => {
      try{
        setListLoading(true)
        const response = await api.get(`/profiles/${encodeURIComponent(username)}/list/${encodeURIComponent(selected)}`);
        console.log(response.data)
        setList(response.data)
      }catch(error){
        alert(error)
        setListLoading(false)
      }finally{
        setListLoading(false)
      }
      }
    fetch()
  }, [username, selected])

  const changeCategory = (category) => {
    if (category === selected){
      return
    }
    navigate(`/mygaminglist/profile/${username}/list?status=${encodeURIComponent(category)}`)
  }

  if(listLoading){
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
      {list.length > 0 ? (list.map((entry)=> (
        <div className='list-row' key = {entry.gameId}>
          <img className = 'thumbnail' id = "list-thumb" src = {entry.card} style={{marginRight: '0'}}></img>
          <div className="list-item-container">
            <div className="entry-name-cont">
              <div className="entry-name">
                <Link to = {`/mygaminglist/game/${entry.gameId}`}  
                onClick={()=>props.setSelected(entry.name)}>{entry.name}</Link>

              </div>
              </div>
              {selected === 'completed' && (
                <div id = 'completed-rating'>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const rating = Number(entry.rating);
                    if (rating >= star) {
                      return (<FaStar key={star} style={{ color: "hsl(0, 96%, 29%)" }}/>)
                    }
                    if (rating >= star - 0.5) {
                      return (<FaStarHalfAlt key={star} style={{ color: "hsl(0, 96%, 29%)" }}/>)
                    }
                    return ( <FaRegStar key={star} style={{ color: "hsl(0, 96%, 29%)" }}/>)
                  })}
                </div>
              )}
          </div> 
        </div>
      ))) : (
        <div className="no-results" style={{ backgroundColor: "hsl(0, 1%, 90%)" }}>
          <h2 className="no-res-head">NO ENTRIES YET...</h2>
          <FaHeartBroken className="heart-crack" />
        </div>
      )}
    </div>
  )
}