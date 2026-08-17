import { Link, useNavigate} from "react-router-dom";
import { FaBars, FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Header(props) {
  const { user, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = async () => {
    await logout();
    navigate("/mygaminglist/login");
  }

  
  return(
    <span className="top">
        <h2 className="title">
        <Link to = "/mygaminglist/" className="home" onClick={() => props.handleClick()}>MyGamingList</Link>
        <span className='acc-methods'>
          {!isLoggedIn ? (
            <>
              <Link to = "/mygaminglist/list" id = "list"><FaBars className='list-icon'/></Link>
              <Link to="/mygaminglist/login" className="headerbutt" id="Login">
                Login
              </Link>
              <Link to="/mygaminglist/signup" className="headerbutt" id="Signup">
                Signup
              </Link>
            </>) : (
            <>
            <Link id = 'profile-name' to = {`/mygaminglist/profile/${user.username}`} style={{display: "flex", flexDirection: 'row'}}>
              <FaUser style={{marginRight: '10px'}}></FaUser>{user.username}</Link>
            <Link to = "/mygaminglist/list" id = "list"><FaBars className='list-icon'/></Link>
            <button
              className="headerbutt"
              id="Logout"
              style={{backgroundColor: 'white', color: 'hsl(0, 96%, 29%)', 
                fontFamily: 'VT323, monospace', fontSize: '25px'}}
              onClick={handleLogout}>
                Logout
            </button>
            </>
          )}
        </span>
        </h2>
    </span>
  )
}