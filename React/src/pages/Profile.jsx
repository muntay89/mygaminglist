import { useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from '../components/Loader';
import ListStatusChart from "../components/PieChart";
import RatingDistributionChart from "../components/BarChart";
import { FaHeartBroken, FaBars} from "react-icons/fa";
import { api } from "../api/client";

export default function Profile (props) {
    const { user } = useAuth();
    let {username} = useParams()
    const [profile, setProfile] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        api.get(`/profiles/${username}/profile`)
        .then(res => {
            setProfile(res.data)
            props.setIntro(`${res.data.username}'s profile`)
            console.log('profile', profile)
        })
        .catch(err => {
            console.log(err)
        })
    }, [username])


    if (!profile) {
    return <Loader></Loader>
    }

    const isOwnProfile = user?.username === profile.username
    
    return (
        <>
        <div className = 'profile-content'>
            <div className = 'profile-container'>
                <span className="profile-top">
                    <Link to = {`/mygaminglist/profile/${profile.username}/list?status=playing`}>
                    <FaBars className="list-icon" style={{position: 'absolute', left: '2%', top: '15%', fontSize: '40px'}}/></Link>
                    <h1 className = 'profile-user'>{profile.username}</h1>
                </span>
                <p className="profile-joined">
                    <b style={{color: 'hsl(0, 96%, 29%)', marginRight: '10px'}}>Joined:</b>
                    {new Date(profile.joined).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    })}
                </p>
                <h2 className = 'profile-header'>Favorites</h2>
                <div className="profile-favorites">
                    {profile.favorites ? profile.favorites.map(game => (
                    <Link className='favorite-card' key={game.gameId} to={`/mygaminglist/game/${game.gameId}`}
                    onClick={()=>props.setSelected(game.name)}>
                        <img  src={game.card} />
                        <div className="favorite-title">
                            {game.name}
                        </div>
                    </Link>
                    )) : (<div>No favorites found<FaHeartBroken style={{verticalAlign: 'middle', 
                    marginLeft: '10px', color: 'hsl(0, 96%, 29%)'}}/></div>)}
                </div>
                <h2 className = 'profile-header'>Stats</h2>
                <div className="profile-stats">
                    <div className="profile-status">
                        <p style={{color: 'hsl(0, 96%, 29%)'}}>Playing</p>
                        <p style={{fontFamily: 'Cambria'}}>{profile.stats.playing}</p>
                    </div>
                    <div className="profile-status">
                        <p style={{color: 'hsl(0, 96%, 29%)'}}>Completed</p>
                        <p style={{fontFamily: 'Cambria'}}>{profile.stats.completed}</p>
                    </div>
                    <div className="profile-status">
                        <p style={{color: 'hsl(0, 96%, 29%)'}}>Dropped</p>
                        <p style={{fontFamily: 'Cambria'}}>{profile.stats.dropped}</p>
                    </div>
                    <div className="profile-status">
                        <p style={{color: 'hsl(0, 96%, 29%)'}}>Plan to Play</p>
                        <p style={{fontFamily: 'Cambria'}}>{profile.stats['plan to play']}</p>
                    </div>
                </div>
                <div className="profile-status" style={{marginBottom: '40px'}}>
                    <p style={{color: 'hsl(0, 96%, 29%)'}}>Total Entries</p>
                    <p style={{fontFamily: 'Cambria'}}>{profile.total}</p>
                </div>
            </div>
            <div className="profile-charts">
                <RatingDistributionChart className = 'profile-bar' ratings={profile.ratingDistribution} />
                <ListStatusChart className = 'profile-pie' stats = {profile.stats} onStatusSelect = {isOwnProfile ? (status) =>
                    navigate(`/mygaminglist/list?status=${encodeURIComponent(status)}`) : (status) => 
                    navigate(`/mygaminglist/profile/${profile.username}/list?status=${encodeURIComponent(status)}`)
                }></ListStatusChart>
            </div>
        </div>
        </>
    )
}