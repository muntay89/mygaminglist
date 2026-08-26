import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import { FaSearch } from "react-icons/fa";

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
    changePage(1)
  }
  const navigate = useNavigate()
  function changePage(number){
    navigate(`/mygaminglist/games/page/${number}`)
  }

  return(
    <form role="search" id="form" onSubmit={handleForm}>
      <Dropdown filter = {props.filter} setFilter={props.setFilter}></Dropdown>
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
