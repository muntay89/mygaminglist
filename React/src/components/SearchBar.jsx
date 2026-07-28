import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import { FaSearch, FaXbox, FaPlaystation, FaWindows } from "react-icons/fa";
import { SiNintendoswitch } from "react-icons/si";

export default function SearchBar(props) {
  
  const handleForm = (e) => {
    e.preventDefault()
    const submitted = props.queried.trim()
    props.setSearch(submitted)
    if (submitted) {
      window.localStorage.setItem('QUERY', JSON.stringify(submitted))
    }
    else{
      window.localStorage.removeItem('QUERY')
    }
    // props.onSubmit(e)
    changePage(1)
  }
  const [rendered, setRendered] = useState(false)
  const [selected, setSelected] = useState('All')
  const navigate = useNavigate()
  function changePage(number){
    navigate(`/mygaminglist/games/page/${number}`)
  }

  // function filterQuery(platform){
  //   props.setFilter(platform)
  // }

  // useEffect(() => {
  //   if(!rendered && props.sub){
  //     const fetch = async() => {
  //       try{
  //       props.setLoading(true)
  //       props.offSubmit()
  //       }catch(error){
  //         alert('error')
  //       } finally {
  //         changePage(props.pageIndex)
  //         props.setTest(true)
  //       }
  //     }
  //     fetch()
  //   }
  //   else{
  //     setRendered(false)
  //   }
  // }, [rendered, props.sub])
  

  return(
    <form role="search" id="form" onSubmit={handleForm}>
      <Dropdown filter = {props.filter} setFilter={props.setFilter}></Dropdown>
          {/* <select className='fillin' name = "type" onChange={(e) => filterQuery(e.target.value)} >
            <option value = " ">All</option>
            <option value = "&platforms=14,1,186" >Xbox</option>
            <option value = "&platforms=18,16,19,187">Playstation</option>
            <option value = "&platforms=5,6,4">PC</option>
            <option value = "&platforms=7,8,9,10,11,83,43,105,24">Nintendo</option>
          </select> */}
          <input type="search" name="q" placeholder="Search Games" id="query" onChange={props.onChange}
          autoComplete='off' value = {props.queried}/>
          <div className='fillout'>
            <button type="submit" aria-label="Search games" style={{border: 'none', backgroundColor: 'hsl(0, 74%, 90%)'}}>
              <FaSearch className="searchicon" />
            </button>
          </div>
    </form>
  )
}
