import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from '../components/Loader';
import { api } from "../api/client";


import { FaTrashAlt, FaCaretDown, FaTimesCircle } from "react-icons/fa";

export default function List (props) {
  const { user, isLoggedIn, login, logout } = useAuth();
  const [selected, setSelected] = useState("playing")
  const [updated, setUpdated] = useState('')
  const [show, setShow] = useState(false)
  const [changed, setChanged] = useState(true)
  // let myUrl = `http://localhost:8000/api/v1/list/status/${selected}`
  const categories = ['completed', 'playing', 'plan to play', 'dropped']
  // const [edit, setEdit] = useState(false)
  const [data, setData] = useState([])

  useEffect(()=> {
    props.setIntro('My List')
  }, [])

  useEffect(() => {
    const fetch = async() => {
      try{
        props.setLoading(true)
        // console.log(props.myAPI(gameID))
        const response = await api.get(`/list/status/${selected}`);
        console.log(response.data)
        props.setList(response.data)
      }catch(error){
        alert(error)
        props.handleLoading()
      }finally{
        props.handleLoading()
        // setTest(false)
      }
      }
    fetch()
  }, [selected])

  const updateStatus = async() => {
    // const fetch = async() => {
      try{
        if(updated!== ''){
        // const response = await axios.put(`http://localhost:8000/api/v1/list/${data._id}`, {listId: data._id, user: data.user, status: updated, name: data.name, card: data.card})
          await api.put(`/list/${data._id}`, {
          listId: data._id,
          userId: data.user, // bridge if old data exists
          status: updated,
          name: data.name,
          card: data.card,
          })
          // console.log(response.data)
          props.setList((prev) =>{
            if (updated !== selected) {
              return prev.filter((e) => e._id !== data._id)
            }

            // If updated status is still the same category, just update the item.
            return prev.map((e) => (e._id === data._id ? { ...e, status: updated } : e))
          })
          setShow(false);
          setTimeout(() => props.setEdit(false), 200);
        }
      }
      catch(error){
        alert(error)
      }
      // finally{
      //   location.reload()
      // }
  }

  const deleteList = async(id) => {
    // const myAPI = (lisID) => `http://localhost:8000/api/v1/list/${lisID}`
    
    // const fetch = async() => {
      try{
        await api.delete(`/list/${id}`)
        props.setList((prev) => prev.filter((e) => e._id !== id))
        setShow(false)
        setTimeout(() => props.setDel(false), 200)
      }catch(error){
        alert(error)
      }
      // finally{
      //   location.reload()
      // }
    
  }

  const displayEdit=(thing)=> {
    props.setEdit(true)
    setShow(true)
    setData(thing)
  }

  const displayDel=(thing)=> {
    props.setDel(true)
    setShow(true)
    setData(thing)
  }

  const changeCategory = (categ) => {
    setSelected(categ)
  }

  const changeSelected = (event) => {
    setUpdated(event)
    setChanged(true)
  }

  const list = props.list


  if(props.loading){
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
      {list.map((entry)=> (
        <div className='list-row' id = {entry._id} key = {entry.id}>
          <img className = 'thumbnail' id = "list-thumb" src = {entry.card}></img>
          <Link to = {`/mygaminglist/game/${entry.gameId}`} 
          className='entry-name' onClick={()=>props.setSelected(entry.name)}>{entry.name}</Link>
          {/* <Link to = {`/reviews/${gameID}`} style = {{textDecoration: 'none', color: 'hsl(0, 96%, 29%)'}}> */}
          <div className='list-butts-cont'>
            <button className='list-butts' id = "delete-list" onClick={()=>displayDel(entry)}><FaTrashAlt/></button>
            <button className='list-butts' id = "edit-list" onClick={()=>displayEdit(entry)}>Edit<FaCaretDown/></button>
          </div>
          <div className={`entry-backdrop ${show? 'scale-in-center' : 'scale-out-center'}`} style={{display: props.edit && 'block'}}>
            <div className='edit-entry'>
              <p className='edit-title-text'>Edit List</p>
              <div className='list-info'>
                <div className='list-game'>
                  <p className='list-p' >Game Title:</p>
                  <p className = "list-game-title">{data.name}</p>
                </div>
                <div className='list-details'>
                  <p className='list-p'>Status:</p>
                  <select className='edit-status' onChange={(event) => {changeSelected(event.target.value)}}>
                    <option selected = {data.status} disabled>--Status--</option>
                    <option value = 'completed'>completed</option>
                    <option value = 'playing'>playing</option>
                    <option value = 'plan to play'>plan to play</option>
                    <option value = 'dropped'>dropped</option>
                  </select>
                </div>
                <button className='list-save' onClick={()=> updateStatus()}>Submit</button>
                {/* <button className='list-save'>...</button> */}
              </div>
              </div>
              <FaTimesCircle className='exit-list' onClick={()=> {setShow(false); setTimeout(()=> {props.setEdit(false)}, 500)}}/>
        </div>
        <div className={`entry-backdrop ${show? 'scale-in-center' : 'scale-out-center'}`} style={{display: props.del && 'block'}}>
          <div className='edit-entry'>
            <p className='edit-title-text' id = "del-header">Delete From List?</p>
            <div className='list-info' id = "del-verif">
              <button className='list-save' id = "del-verif-butt" onClick={()=> deleteList(data._id)}>Delete</button>
              <button className='list-save' id = "del-verif-butt" onClick={()=> {setShow(false); setTimeout(()=> {props.setDel(false)}, 500)}}>Cancel</button>
            </div>
            </div>
        </div>
        </div>
      ))}
      <div className='opac-wrap' style={{display: (props.edit || props.del) ? 'block' : 'none'}}>
      </div>
      
    </div>
  )
}