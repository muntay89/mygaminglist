import { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from '../components/Loader';
import { api } from "../api/client";

export default function Profile (props) {
    const { user, isLoggedIn, login, logout } = useAuth();
    let {username} = useParams()
    const [profile, setProfile] = useState(null)


    useEffect(() => {
        api.get(`/profiles/${username}/profile`)
        .then(res => {
            setProfile(res.data)
            props.setIntro(`${res.data.username}'s profile`)
        })
        .catch(err => {
            console.log(err)
        })
    }, [username])

        // }, [username]);

    if (!profile) {
    return <Loader></Loader>
    }
    
    return (
        <div className = 'profile-content'>
            <div class = 'profile-container'>
                <h1 className = 'profile-user'>{profile.username}</h1>
                <p className="profile-joined">
                    <b style={{color: 'hsl(0, 96%, 29%)', marginRight: '10px'}}>Joined:</b>
                    {new Date(profile.joined).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    })}
                </p>
                <h2 class= 'profile-header'>Favorites</h2>
                <div className="profile-favorites">
                    {profile.favorites.map(game => (
                    <Link className='favorite-card' key={game.gameId} to={`/mygaminglist/game/${game.gameId}`}
                    onClick={()=>props.setSelected(game.name)}>
                        <img  src={game.card} />
                        <div className="favorite-title">
                            {game.name}
                        </div>
                    </Link>
                    ))}
                </div>
                <h2 class= 'profile-header'>Stats</h2>
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
            {/* {profile.favorites.map(game => (
            <Link key={game.gameId} to={`/mygaminglist/game/${game.gameId}`}>
                <img src={game.card} />
                <p>{game.name}</p>
            </Link>
            ))}
            <p>{profile.joined}</p> */}
        </div>
    )
}