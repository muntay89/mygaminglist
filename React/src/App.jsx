import { useEffect, useState, useRef } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, } from 'react-router-dom'
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
import List from './pages/List';
import Login from './pages/Login'
import Signup from './pages/Signup';
import { AuthProvider } from "./context/AuthContext";



import axios, { AxiosError } from 'axios'
import { api } from "./api/client";
import { RAWG_KEY } from "./api/rawg";

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';



const App = () => {
  const [pageIndex, setPageindex] = useState(1)
  const [submitted, setSubmission] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [test, setTest] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState(false)
  const [selected, setSelected] = useState('')
  const [screenshots, setScreenshots] = useState('')
  const [reset, setReset] = useState(false)
  const [filter, setFilter] = useState('')
  const [reviews, setReviews] = useState([])
  const [list, setList] = useState([])
  const [queried, setQueried] = useState('')
  const [intro, setIntro] = useState('')
  const [edit, setEdit] = useState(false)
  const [del, setDel] = useState(false)

  const generateAPI = (pageIndex, search, filter) => `https://api.rawg.io/api/games?key=${RAWG_KEY}&page=${pageIndex}&search=${search}${filter}`
  const generateInfo = (gameID) => `https://api.rawg.io/api/games/${gameID}?key=${RAWG_KEY}`

  const [API, setAPI] = useState(generateAPI(pageIndex, search, filter))
  const [rendered, setRendered] = useState(false)

  useEffect(()=>{
    if (test){
      console.log('tested', test)
    }
  }, [test])

  useEffect(()=> {
      console.log('load modified!', loading)
  }, [loading])

  useEffect(() => {
      if(!rendered && test){
        console.log('test')
        console.log(pageIndex)
        const fetch = async() => {
          try{
            setLoading(true)
            console.log('search', search, 'index', pageIndex)
            const response = await axios.get(generateAPI(pageIndex, queried, filter))
            console.log('response', response)
            setSearchResults(response.data)
          }catch(error){
            // alert('Page does not Exist!')
            handleLoading()
          }finally{
            handleLoading()
            setTest(false)
            console.log('complete')
          }
        }
      fetch()
      }
  
    }, [rendered, test])

    
  useEffect(()=>{
    const data = window.localStorage.getItem('SEARCH_RESULTS')
    const query = window.localStorage.getItem('QUERY')
    const selected = window.localStorage.getItem('SELECTED')
    const images = window.localStorage.getItem('SCREENSHOTS')
    console.log('localimages', images)
    if (data){
      setSearchResults(JSON.parse(data))
    }
    if (query && query.length > 3){
      console.log('length', query.length)
      setQueried(JSON.parse(query))
    }
    if(selected){
    setSelected(JSON.parse(selected))
    }
    // if(images){
    //   console.log('localimages', images)
    //   setScreenshots(JSON.parse(images))
    // }
  }, [])

  useEffect(() => {
    // if (screenshots){
    //   window.localStorage.setItem('SCREENSHOTS', JSON.stringify(screenshots))
    // }
    if (searchResults){
    window.localStorage.setItem('SEARCH_RESULTS', JSON.stringify(searchResults))
    }
    if (search) {
      window.localStorage.setItem('QUERY', JSON.stringify(search))
    }
    if (selected){
    window.localStorage.setItem('SELECTED', JSON.stringify(selected))
    }
  }, [searchResults, search , API, selected, screenshots])

  const handleSearch = (event) => {
    console.log('search', event.target.value)
    setQueried(event.target.value)
  }


  const handleHome = () => {
    setSearch('')
    setFilter(' ')
    setQueried('')
    window.localStorage.setItem('FILTER', ' ')
    document.querySelector('.fillin').value = " "
    window.localStorage.setItem('QUERY', '')
    setPageindex(1)
    setReset(true)
  }
  const handleLoading = () => {
    setLoading(false)
  }
  const handleAPI = (num) => {
    setAPI(num)
  }

  const handleTest = (bool) => {
    setTest(bool)
  }

  const updateSearchResults = (results) => {
    setSearchResults(results)
  }
  const handleSubmission = () => {
    setSubmission(true)
  }
  const resetSubmission = () => {
    setSubmission(false)
  } 
  const handleIndex = (index) => {
    setPageindex(index)
  }
  const handleInfo = () => {
    setInfo(false)
  }

  

  return(
    <AuthProvider>
      <Router>
        <div className='wrapper' >
          <div className='stick'>
            <Header handleClick = {handleHome}/>
            <div className='container2'>
              <Navbar updateSearchResults = {updateSearchResults} Api = {API} setAPI = {setAPI} submitted = {submitted}
              handleSubmission = {handleSubmission} resetSubmission = {resetSubmission} pageIndex = {pageIndex} queried = {queried}
              search = {search} handleSearch = {handleSearch} setSearch = {setSearch} handleClick = {handleHome} genAPI = {generateAPI}
              setLoading = {setLoading} setTest = {handleTest} filter = {filter} setFilter = {setFilter} reset = {reset}/>
              <Introbar filter = {filter} selected = {selected} pageIndex = {pageIndex} reset = {reset} intro = {intro}/>
            </div>
          </div>
          <div className='content'>
            <Routes>
              <Route path = "/mygaminglist/" element = {<Homepage reset = {reset} setReset = {setReset} setIntro = {setIntro}/>}>
              </Route>
              <Route path = "/mygaminglist/games/page/:number" element = {<Games searchResults = {searchResults} 
                          pageIndex = {pageIndex} handleIndex = {handleIndex}  genAPI = {generateAPI} 
                          handleSubmission = {handleSubmission} sub = {submitted} API = {API} setAPI = {handleAPI}
                          setTest = {handleTest} handleInfo = {handleInfo} test = {test} search = {search} reset = {reset}
                          setReset = {setReset} loading = {loading} setLoading = {setLoading} filter = {filter} 
                          setFilter = {setFilter} setSelected = {setSelected} setIntro = {setIntro} edit = {edit} setEdit = {setEdit}/>}>
              </Route>
              <Route path = "/mygaminglist/game/:gameID" element = {<Info searchResults = {searchResults} API = {API} updateSearchResults = {updateSearchResults}
                          info = {info} handleInfo = {handleInfo} genInfo = {generateInfo} screenshots = {screenshots} setScreenshots = {setScreenshots} 
                          setSelected = {setSelected} setIntro = {setIntro} selected = {selected} edit = {edit} setEdit = {setEdit}/>}>
              </Route>
              <Route path = "/mygaminglist/game/:gameID/images" element = {<Images screenshots = {screenshots} setScreenshots = {setScreenshots} searchResults = {searchResults}/>}>
              </Route>
              <Route path = "/mygaminglist/login" element = {<Login/>}>
              </Route>
              <Route path = "/mygaminglist/signup" element = {<Signup/>}>
              </Route>
              <Route path = "/mygaminglist/newreview/:gameID" element = {<Newreview genInfo = {generateInfo} searchResults = {searchResults} selected = {selected}
                          setIntro = {setIntro}
                />}>
              </Route>
              <Route path = "/mygaminglist/myreviews/:gameID" element = {<ProtectedRoute><MyReviews setReviews = {setReviews} reviews = {reviews} setLoading = {setLoading}
              handleLoading = {handleLoading} loading = {loading} selected = {selected} setIntro = {setIntro} del = {del} setDel = {setDel}/></ProtectedRoute>}></Route>

              <Route path = "/mygaminglist/reviews/:gameID" element = {<Reviews setReviews = {setReviews} reviews = {reviews} setLoading = {setLoading}
              handleLoading = {handleLoading} loading = {loading} selected = {selected} setIntro = {setIntro} del = {del} setDel = {setDel}/>}></Route>
              <Route path = "/loader" element = {<Loader/>}>
              </Route>
              <Route path = "/mygaminglist/list" element = {<ProtectedRoute><List  loading = {loading} setLoading = {setLoading} handleLoading = {handleLoading} 
              setList = {setList} list = {list} setIntro = {setIntro} setSelected = {setSelected} edit = {edit} setEdit = {setEdit} del = {del} setDel = {setDel}/></ProtectedRoute>} ></Route>
            </Routes> 
          </div>
          <Footer/>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App



