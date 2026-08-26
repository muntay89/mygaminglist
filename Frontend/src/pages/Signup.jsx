import { useState, useEffect } from 'react'
import Loader from '../components/Loader';
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";



export const Signup = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { signup, loading, isLoggedIn } = useAuth()

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
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
        e.preventDefault();          
        setError("")
        if (password !== confirm) {
            setError("Passwords do not match.")
            return
        }
        if (!username.trim()) {
            return setError("Please enter a username.")
        }
        if (password.length < 10){
            return setError("Password must be at least 10 characters.");
        }
        try{
            setSubmitting(true)
            await signup(username.trim(), password)
            const back = location.state?.from ?? '/mygaminglist/'
            navigate(back, {replace: true})
        }catch(error){
            setError(error.response?.data?.error || "Signup failed.")
        }finally{
            setSubmitting(false)
        }
    }
    if (loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "50vh" }}>
        <Loader />
      </div>
    );
  }
    return(
        <div className='auth-container'>
            <form className = "auth-form" onSubmit={handleSubmit}>
                <h2 className = 'auth-banner'>Signup</h2>
                <div className = 'auth-username'>
                    <span className = "form-names">Username</span>
                    <input className = "forms" name = 'username' type = "text" value ={username} 
                    onChange={(e) => setUsername(e.target.value)} autoComplete='username' required/>
                </div>
                <div className = 'auth-passw'>
                    <span className = "form-names">Password</span>
                    <span className = "show-p">Show password</span>
                    <input type = "checkbox" id = "show-p-box" checked ={showPass}
                    onChange={(e) => setShowPass(e.target.checked)}/>
                    <input className = "forms" name = 'password' type = {showPass ? "text" : "password"} id = "passW" value = {password}
                    onChange={(e) => setPassword(e.target.value)} autoComplete='current-password' required/>
                    <span className = "form-names" >Confirm Password</span>
                    <input className = "forms" name = 'password' type = {showPass ? "text" : "password"} id = "confirm-passW" value = {confirm}
                    onChange={(e) => setConfirm(e.target.value)} autoComplete='new-password' required></input>
                    {error && <p className="auth-error">{error}</p>}
                </div>
                <button id = "form-login" type="submit" disabled={submitting}><b>Signup</b></button>
            </form>
        </div>
    )
}


export default Signup