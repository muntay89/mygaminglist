import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import SearchBar from "./SearchBar";



export default function Navbar(props) {

  return(
    <nav className="navbar">
      <div className='nav-select'>
        <ul id="navbar-main">
          <span id = "navbar-vis"><Link to = "/mygaminglist/" style={{margin: '0'}}><FaHome className='home-vis' onClick={()=> props.handleClick()}/></Link>
          <li><Link to = "/mygaminglist/" className="navbar-el" onClick={()=> props.handleClick()}>Home</Link></li></span>
          <li><Link to = "/mygaminglist/list"  className='navbar-el'>List</Link></li>
          <li className='navbar-hide'><Link to = "/mygaminglist/myreviews" className="navbar-el" >Reviews</Link></li>
          <li className='navbar-hide'><Link to = '/mygaminglist/free' className="navbar-el">Free to Play</Link></li>
        </ul>
      </div>
      <SearchBar onChange = {props.handleSearch}  search = {props.search} setSearch = {props.setSearch} queried = {props.queried} 
      filter = {props.filter} setFilter = {props.setFilter} />
    </nav>
  )

}
