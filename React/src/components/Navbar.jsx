import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import Dropdown from "./Dropdown";
import SearchBar from "./SearchBar";
import { useAuth } from "../context/AuthContext";



export default function Navbar(props) {

  const [dropdown, setDropdown] = useState(false)
  const { user, isLoggedIn, logout } = useAuth();

  
  const onMouseEnter = () => {
    setDropdown(true)
  }
  const onMouseLeave = () => {
    setDropdown(false)
  }

  return(
    <nav className="navbar">
      <div className='nav-select'>
        <ul id="navbar-main">
          <span id = "navbar-vis"><Link to = "/mygaminglist/" style={{margin: '0'}}><FaHome className='home-vis' onClick={()=> props.handleClick()}/></Link>
          <li><Link to = "/mygaminglist/" className="navbar-el" onClick={()=> props.handleClick()}>Home</Link></li></span>
          <li className='navbar-hide'>
            <a href="#" id="games-drop" className="navbar-el"
             onMouseEnter = {onMouseEnter} onMouseLeave = {onMouseLeave}>
              Games
            </a>
            <Dropdown visible = {dropdown} onMouseEnter = {onMouseEnter} onMouseLeave = {onMouseLeave}
          setLoading = {props.setLoading} genAPI = {props.genAPI} setAPI = {props.setAPI} setTest = {props.setTest}
          search = {props.search} filter = {props.filter} setFilter = {props.setFilter}/>
          </li>
          {/* <Dropdown visible = {dropdown} onMouseEnter = {onMouseEnter} onMouseLeave = {onMouseLeave}
          setLoading = {props.setLoading} genAPI = {props.genAPI} setAPI = {props.setAPI} setTest = {props.setTest}
          search = {props.search} filter = {props.filter} setFilter = {props.setFilter}/> */}
          <li className='navbar-hide'><a href="" className="navbar-el">Reviews</a></li>
          {/* <li className='navbar-hide'><a href="" className="navbar-el">Play</a></li>
          <li className='navbar-hide'><a href="" className="navbar-el">Help</a></li> */}
        </ul>
      </div>
      <SearchBar onChange = {props.handleSearch} Api = {props.Api} search = {props.search} setSearch = {props.setSearch}
      onSubmit = {props.handleSubmission} offSubmit = {props.resetSubmission} sub = {props.submitted} queried = {props.queried}
      updateSearchResults={props.updateSearchResults} pageIndex = {props.pageIndex} genAPI = {props.genAPI}
      setLoading = {props.setLoading} setTest = {props.setTest} filter = {props.filter} setFilter = {props.setFilter} reset = {props.reset} />
    </nav>
  )

}
