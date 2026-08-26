import { useEffect, useState, useRef } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Navigate} from 'react-router-dom'
import './App.css'
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Loader from './components/Loader';
import Introbar from './components/Introbar';
import Footer from './components/Footer';
import ProtectedRoute from "./components/ProtectedRoute";
import Homepage from './pages/Homepage';
import Games from './pages/Games';
import Info from './pages/Info'; 
import Images from './pages/Images';
import Newreview from './pages/NewReview';
import MyReviews from './pages/MyReviews';
import Reviews from './pages/Reviews';
import AllReviews from './pages/AllReviews';
import List from './pages/List';
import PublicList from './pages/PublicList';
import Login from './pages/Login'
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import FreeGames from './pages/Free';
import { AuthProvider } from "./context/AuthContext";
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';



const App = () => {
  const [pageIndex, setPageindex] = useState(1)
  const [selected, setSelected] = useState('')
  const [reset, setReset] = useState(false)
  const [list, setList] = useState([])
  const [intro, setIntro] = useState('')
  const [filter, setFilter] = useState(() => {
    try{
      const storedFilter = window.localStorage.getItem('FILTER')
      return storedFilter !== null
        ? JSON.parse(storedFilter)
        : ''
    } 
    catch (error){
      console.error('Could not restore filter:', error)
      window.localStorage.removeItem('FILTER')
      return ''
    }
  })
  const [search, setSearch] = useState(() => {
    try {
      const storedQuery = window.localStorage.getItem('QUERY')
      return storedQuery != null
        ? JSON.parse(storedQuery)
        : ''
    }
    catch (error) {
      console.error('Could not restore query:', error)
      window.localStorage.removeItem('QUERY')
      return ''
    }
  })
  const [queried, setQueried] = useState(() => {
  try {
    const storedQuery = localStorage.getItem('QUERY')

    return storedQuery !== null
      ? JSON.parse(storedQuery)
      : ''
  } catch {
    return ''
  }
  })

  useEffect(() => {
    const selected = localStorage.getItem('SELECTED')
    if (selected){
      setSelected(JSON.parse(selected))
    }
  }, [])

  useEffect(() => {
    if (selected) {
      localStorage.setItem(
        'SELECTED',
        JSON.stringify(selected)
      )
    }
  }, [selected])

  useEffect(() => {
    if (filter) {
      localStorage.setItem(
        'FILTER',
        JSON.stringify(filter)
      )
    } else {
      localStorage.removeItem('FILTER')
    }
  }, [filter])

  const handleSearch = (event) => {
    setQueried(event.target.value)
  }

  const handleHome = () => {
    setSearch('')
    setFilter(' ')
    setQueried('')
    setPageindex(1)
    setReset(true)
    localStorage.removeItem('QUERY')
    localStorage.removeItem('FILTER')
    localStorage.removeItem('NUMBER')
  }

  return(
    <AuthProvider>
      <Router>
        <div className='wrapper' >
          <div className='stick'>
            <Header handleClick = {handleHome}/>
            <div className='container2'>
              <Navbar queried = {queried} search = {search} handleSearch = {handleSearch} setSearch = {setSearch} handleClick = {handleHome} 
              filter = {filter} setFilter = {setFilter} />
              <Introbar filter = {filter} selected = {selected} pageIndex = {pageIndex} intro = {intro}/>
            </div>
          </div>
          <div className='content'>
            <Routes>
              <Route path="/" element={<Navigate to="/mygaminglist/" replace />}/>
              <Route path = "/mygaminglist/" element = {<Homepage handleClick = {handleHome} reset = {reset} setReset = {setReset} setIntro = {setIntro}/>}>
              </Route>
              <Route path = "/mygaminglist/games/page/:number" element = {<Games search = {search} reset = {reset}
                setReset = {setReset} filter = {filter} setFilter = {setFilter} setSelected = {setSelected} setIntro = {setIntro}/>}>
              </Route>
              <Route path = "/mygaminglist/game/:gameID" element = {<Info setIntro = {setIntro} />}>
              </Route>
              <Route path = "/mygaminglist/game/:gameID/images" element = {<Images selected = {selected} setIntro = {setIntro}/>}>
              </Route>
              <Route path = "/mygaminglist/login" element = {<Login/>}>
              </Route>
              <Route path = "/mygaminglist/signup" element = {<Signup/>}>
              </Route>
              <Route path = "/mygaminglist/newreview/:gameID" element = {<ProtectedRoute><Newreview  selected = {selected} setIntro = {setIntro}/></ProtectedRoute>}>
              </Route>
              <Route path = "/mygaminglist/myreviews/:gameID" element = {<ProtectedRoute><MyReviews  selected = {selected} setIntro = {setIntro} /></ProtectedRoute>}></Route>
              <Route path = "/mygaminglist/myreviews" element = {<ProtectedRoute><AllReviews selected = {selected} setIntro = {setIntro} /></ProtectedRoute>}></Route>
              <Route path = "/mygaminglist/reviews/:gameID" element = {<Reviews selected = {selected} setIntro = {setIntro} />}></Route>
              <Route path = "/loader" element = {<Loader/>}>
              </Route>
              <Route path = "/mygaminglist/list" element = {<ProtectedRoute><List setIntro = {setIntro} setSelected = {setSelected} /></ProtectedRoute>} ></Route>
              <Route path = "/mygaminglist/profile/:username/list" element = {<PublicList setIntro = {setIntro} setSelected = {setSelected} />} ></Route>
              <Route path = '/mygaminglist/profile/:username' element = {<Profile setIntro = {setIntro} setSelected = {setSelected}/>}></Route>
              <Route path="/mygaminglist/free" element={<FreeGames setIntro={setIntro} />}/>
            </Routes> 
          </div>
          <Footer/>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App



