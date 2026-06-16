import { useState, useEffect } from 'react'
import Loader from '../components/Loader';
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";



export const Login = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const { login, loading, isLoggedIn } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState(""); // not used yet (no backend), but captured
    const [showPass, setShowPass] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("")

    useEffect(() => {
        if (!loading && isLoggedIn){
            const back = location.state?.from ?? '/mygaminglist/'
            navigate(back, {replace: true})
        }
    }, [loading, isLoggedIn, location.state, navigate])

    const handleSubmit = async(e) => {
        e.preventDefault();          // ✅ prevents page refresh
        setError("")

        // super basic validation
        if (!username.trim()) {
            return setError("Please enter a username.")
        }
        if (!password) {
            return setError("Please enter a password.")
        }
        try{
            setSubmitting(true)
            await login(username.trim(), password)
            const back = location.state?.from ?? '/mygaminglist/'
            navigate(back, {replace: true})
        }catch(error){
            setError('Login failed. Please try again')
        }finally{
            setSubmitting(false)
        }
    }
    if (loading) {
    return
        <Loader />
    }
    return(
        <div className='auth-container'>
            <form class = "auth-form" onSubmit={handleSubmit}>
                <h2 class = 'auth-banner'>Login</h2>
                <div class = 'auth-username'>
                    <span className = "form-names">Username</span>
                    <input className = "forms" type = "text" value ={username} 
                    onChange={(e) => setUsername(e.target.value)} autoComplete='username'/>
                </div>
                <div class = 'auth-passw'>
                    <span className = "form-names">Password</span>
                    <span className = "show-p">Show password</span>
                    <input type = "checkbox" id = "show-p-box" checked ={showPass}
                    onChange={(e) => setShowPass(e.target.checked)}/>
                    <input className = "forms" type = {showPass ? "text" : "password"} id = "passW" value = {password}
                    onChange={(e) => setPassword(e.target.value)} autoComplete='current-password'/>
                </div>
                <button id = "form-login" type="submit" disabled={submitting}><b>Login</b></button>
            </form>
        </div>
    )
}


export default Login
