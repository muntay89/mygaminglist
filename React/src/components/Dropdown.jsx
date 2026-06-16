import { useNavigate } from "react-router-dom";

export default function Dropdown(props) {
  
  const navigate = useNavigate()
  
  function changePage(number, platform){
    const fetch = async() => {
      try{
        props.setLoading(true)
        props.setFilter(platform)
        const newAPI = props.genAPI(number, props.search, props.filter)
        props.setAPI(newAPI)
        console.log('platform', platform)
      }
      catch{
        alert('error')
      }
      finally{
        navigate(`/mygaminglist/games/page/${number}`)
        props.setTest(true)
      }
    }
    fetch()
  }

  return(
    <ul id="dropdown" style={{display: props.visible ? 'flex': 'none',
    flexDirection: props.visible ? 'column' : 'row' }}
    onMouseEnter = {props.onMouseEnter} onMouseLeave = {props.onMouseLeave}>
            <li onClick={()=> changePage(1, '&platforms=186')}>
              <a href="#" className="consoles" id="xbox"> Xbox Series X/S </a>
            </li>
            <li onClick={()=> changePage(1, '&platforms=187')}>
              <a href="#" className="consoles" id="ps">PlayStation 5</a>
            </li>
            <li onClick={()=> changePage(1, '&platforms=7')}>
              <a href="#" className="consoles" id="nintendo">Nintendo Switch</a>
            </li>
            <li onClick={()=> changePage(1, '&platforms=4')}>
              <a href="#" className="consoles" id="pc">PC</a>
              </li>
            <li>
              <a href="#" className="consoles" id="other">More...</a>
              </li>
          </ul>
  )
}