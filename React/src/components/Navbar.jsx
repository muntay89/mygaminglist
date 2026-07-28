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
          <li><Link to = "/mygaminglist/list"  className='navbar-el'>List</Link></li>
          {/* <Dropdown visible = {dropdown} onMouseEnter = {onMouseEnter} onMouseLeave = {onMouseLeave}
          setLoading = {props.setLoading} genAPI = {props.genAPI} setAPI = {props.setAPI} setTest = {props.setTest}
          search = {props.search} filter = {props.filter} setFilter = {props.setFilter}/> */}
          <li className='navbar-hide'><Link to = "/mygaminglist/myreviews" className="navbar-el" >Reviews</Link></li>
          <li className='navbar-hide'><Link to = '/mygaminglist/free' className="navbar-el">Free to Play</Link></li>
          {/* <li className='navbar-hide'><a href="" className="navbar-el">Play</a></li>
          <li className='navbar-hide'><a href="" className="navbar-el">Help</a></li> */}
        </ul>
      </div>
      <SearchBar onChange = {props.handleSearch}  search = {props.search} setSearch = {props.setSearch} sub = {props.submitted} queried = {props.queried} 
      filter = {props.filter} setFilter = {props.setFilter} />
    </nav>
  )

}
