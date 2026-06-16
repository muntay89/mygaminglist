import { Link , useNavigate} from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Header({ handleClick }) {
  const { user, isLoggedIn, logout, loading } = useAuth();
  const navigate = useNavigate();
  console.log(`funky, ${isLoggedIn}`)
  const handleLogout = async () => {
    await logout();
    navigate("/mygaminglist/login");
  }
  if (loading) return null

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
            <h2 style={{color: 'hsl(0, 96%, 29%)', fontSize: '30px',
              marginRight: '25px'
            }}>{user.username}</h2>
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