import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from '../components/Loader';
import StarRatingInput from "../components/StarRating";
import { api } from "../api/client";


import { FaTrashAlt, FaTimesCircle, FaPlus, FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaRegHeart, FaPencilAlt, FaHeartBroken } from "react-icons/fa";

export default function List (props) {
  const { user, isLoggedIn, login, logout } = useAuth();
  const categories = ['completed', 'playing', 'plan to play', 'dropped']
  const [searchParams] = useSearchParams()
  const requestedStatus = searchParams.get('status')
  const [selected, setSelected] = useState(categories.includes(requestedStatus)?requestedStatus:'playing')
  const [updated, setUpdated] = useState('')
  const [rating, setRating] = useState('')
  const [show, setShow] = useState(false)
  const [list, setList] = useState([])
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [listLoading, setListLoading] = useState(true);
  const [animatedFavoriteId, setAnimatedFavoriteId] = useState(null)
  const [data, setData] = useState([])

  useEffect(()=> {
    props.setIntro('My List')
  }, [])

  useEffect(() => {
    const fetch = async() => {
      try{
        setListLoading(true)
        const response = await api.get(`/list/status/${selected}`);
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
  }, [selected])

  const updateStatus = async (gameRating, entry) => {
    if (updated === "") return;

    const rating =
      updated === "completed"
        ? gameRating
        : null

    if (updated === "completed" && (rating === "" || rating == '--Rating--' )) {
      alert("Please select a rating.")
      return
    }
    try {
      await api.put(`/list/${data._id}`, {
        status: updated,
        rating: updated === "completed" ? Number(rating) : null,
      });

      setList((prev) => {
        if (updated !== selected) {
          return prev.filter((e) => e._id !== data._id);
        }

        return prev.map((e) =>
          e._id === data._id
            ? { ...e, status: updated, rating: updated === "completed" ? rating : null }
            : e
        );
      });
      console.log('TESTRATING', rating)
      setShow(false);
      setTimeout(() => setEditOpen(false), 200);
    } catch (error) {
      alert(error);
    }
  }
  const deleteList = async(id) => {
      try{
        await api.delete(`/list/${id}`)
        setList((prev) => prev.filter((e) => e._id !== id))
        setShow(false)
        setTimeout(() => setDeleteOpen(false), 200)
      }catch(error){
        alert(error)
      }
    
  }

  const saveToFavorites = async(entry) => {

    const favoriteValue = !entry.favorite
    try{
      await api.put(`/list/${entry._id}`, {
        favorite: favoriteValue,
      })
      setList((prev) => prev.map((e) => e._id === entry._id
      ? {...e, favorite: favoriteValue } : e) )
      if (favoriteValue) {
        triggerFavoriteAnimation(entry._id)
      }
    }
    catch (error){
      alert(error)
    }
  }
  const triggerFavoriteAnimation = (entryId) => {
    setAnimatedFavoriteId(null)

    requestAnimationFrame(() => {
      setAnimatedFavoriteId(entryId)
    })

    setTimeout(() => {
      setAnimatedFavoriteId(null)
    }, 350)
  }
  const displayEdit=(thing)=> {
    setData(thing)
    setUpdated(thing.status)
    setRating(thing.rating ?? '')
    setEditOpen(true)
    setShow(true)
  }

  const displayDel=(thing)=> {
    setDeleteOpen(true)
    setEditOpen(false)
    setData(thing)
  }

  const changeCategory = (categ) => {
    if (categ === selected){
      return
    }
    setListLoading(true)
    setList([])
    setSelected(categ)
  }

  const changeSelected = (event) => {
    setUpdated(event)
    console.log('updated', updated)

    if (event !== "completed") {
      setRating("")
    }
  }
  const changeRating = (event) => {
    setRating(event)
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
        <div className='list-row' id = {entry._id} key = {entry._id}>
          <img className = 'thumbnail' id = "list-thumb" src = {entry.card} style={{marginRight: '0'}}></img>
          <div className="list-item-container">
            <div className="entry-name-cont">
              <div className="entry-name">
                <Link to = {`/mygaminglist/game/${entry.gameId}`}  
                onClick={()=>props.setSelected(entry.name)}>{entry.name}</Link>
                <span className={`favorite-wrapper-list ${animatedFavoriteId === entry._id ? "favorite-active" : ""}`}
                    onClick={() => saveToFavorites(entry)}>
                      {entry.favorite ? (
                    <FaHeart className="list-favorite" />
                    ) : (
                    <FaRegHeart className="list-favorite" />
                    )}
                    <span className="pixel pixel1"></span>
                    <span className="pixel pixel2"></span>
                    <span className="pixel pixel3"></span>
                    <span className="pixel pixel4"></span>
                </span>
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
              <div className='list-butts-cont'>
                <div className='review-features-buttons' id = 'edit-butt' onClick={()=>displayEdit(entry)} style={{padding: '5px', marginTop: '25px'}}>
                  <FaPencilAlt id = "edit-butt"/>
                  <span style={{fontFamily: 'VT323, monospace', marginLeft: '10px', fontSize: '15px',
                    color: 'hsl(0, 96%, 29%)', cursor:'pointer', textAlign: 'center'}}>Edit</span>
                </div>
              </div>
          </div> 
          <div className={`entry-backdrop ${show? 'scale-in-center' : 'scale-out-center'}`} style={{display: editOpen || deleteOpen ? 'block' : 'none'}}>
            <div className='edit-entry'>
              {editOpen && !deleteOpen && (<>
              <p className='edit-title-text'>Edit List</p>
              <div className='list-info'>
                <div className='list-game'>
                  <p className='list-p' >Game Title:</p>
                  <p className = "list-game-title">{data.name}</p>
                </div>
                <div className='list-details'>
                  <p className='list-p'>Status:</p>
                  <div className="edit-status">
                    <div style= {{backgroundColor: updated === 'completed' ? 'hsl(0, 96%, 29%)' : 'white', color: updated === 'completed' 
                      ? 'white': 'hsl(0, 96%, 29%)', }} value = 'completed' onClick={(event) => changeSelected('completed')}>completed</div>
                    <div style= {{backgroundColor: updated === 'playing' ? 'hsl(0, 96%, 29%)' : 'white', color: updated === 'playing' 
                      ? 'white': 'hsl(0, 96%, 29%)', }} value = 'playing' onClick={(event) => changeSelected('playing')}>playing</div>
                    <div style= {{backgroundColor: updated === 'plan to play' ? 'hsl(0, 96%, 29%)' : 'white', color: updated === 'plan to play' 
                      ? 'white': 'hsl(0, 96%, 29%)', }} value = 'plan to play' onClick={(event) => changeSelected('plan to play' )}>plan to play</div>
                    <div style= {{backgroundColor: updated === 'dropped' ? 'hsl(0, 96%, 29%)' : 'white', color: updated === 'dropped' 
                      ? 'white': 'hsl(0, 96%, 29%)', }} value = 'dropped' onClick={(event) => changeSelected('dropped')}>dropped</div>
                  </div>
                </div>
                {updated === 'completed' && (
                    <div className = 'list-rating'>
                      <p>Rating:</p>
                      <StarRatingInput list = {true} rating = {rating} setRating = {setRating}></StarRatingInput>
                  </div>)}
                <div style={{display: 'flex', flexDirection: 'row', gap: '25px'}}>
                  <button style={{marginRight: '0'}}className='list-save' onClick={()=> updateStatus(rating, entry)}><FaPlus/></button>
                  <button style={{marginLeft: '0'}} className='list-save' onClick={()=> displayDel(data)}><FaTrashAlt/></button>
                </div>
              </div>
              </>)}
              {!editOpen && deleteOpen && (<>
                <p className='edit-title-text' id = "del-header">Delete From List?</p>
                <div className='list-info' id = "del-verif">
                  <button className = "del-verif-butt" onClick={()=> deleteList(data._id)}>Confirm</button>
                  <button className = "del-verif-butt" onClick={()=> {setEditOpen(true); setDeleteOpen(false)}}>Cancel</button>
                </div>
                  </>)}
            </div>
              <FaTimesCircle className='exit-list' onClick={()=> {setShow(false); setTimeout(()=> {setEditOpen(false); setDeleteOpen(false)}, 500)}}/>
        </div>
        </div>
        ))): 
        (<div className="no-results" style={{ backgroundColor: "hsl(0, 1%, 90%)" }}>
            <h2 className="no-res-head">NO ENTRIES YET...</h2>
            <FaHeartBroken className="heart-crack" />
          </div>)}
      <div className='opac-wrap' style={{display: (editOpen || deleteOpen) ? 'block' : 'none'}}>
      </div>
      
    </div>
  )
}