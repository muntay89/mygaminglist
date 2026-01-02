import { useState } from 'react'
import PacmanLoader from 'react-spinners/PacmanLoader'



export const Login = () => {

    return(
        <div id = "query-replace">
                <div id = "log-container">
                    <div id = "log-box">
                        <h2 id = "other">Login with</h2>
                        <div id = "login-buttons">
                            {/* <button id = "apple2"><i className
                            ="fa-brands fa-apple fa-lg" style="color: #ffffff;"></i>Apple</button>
                            <button id = "google2"><i className
                            ="fa-brands fa-google fa-lg" style="color: #000000;"></i>Google</button>
                            <button id = "facebook2"><i className
                            ="fa-brands fa-facebook fa-lg" style="color: #1e3050;"></i>Facebook</button>
                            <button id = "twitter2"><i className
                            ="fa-brands fa-twitter fa-lg" style="color: #ffffff;"></i>Twitter</button> */}
                        </div>
                        <h2 id = "lineborder">Or</h2>
                        <div id = "log-form">
                            <span id = "user" className
                             = "form-names">Username</span>
                            <input className
                             = "forms" type = "text" />
                            <span id = "pass" className
                             = "form-names">
                                Password
                                <span className
                                 = "tester">Show password</span>
                                <span>
                                    <input type = "checkbox" id = "show-p" />
                                </span>
                            </span>
                            <input className
                             = "forms" type = "password" id = "passW"/>
                            <span className = "bottom-text">
                                By logging in and using this website you agree to 
                                <span>
                                    <p className
                                    = "bottom-text">our</p>
                                    <a href = "" >Terms of Service</a>
                                    <br/>
                                    <button id = "form-login"><b>Login</b></button>
                                    <br/>
                                    <a href = "" className
                                    = "forgot-prompt">Forgot Username?</a>
                                    <a href = "" className
                                    = "forgot-prompt">Forgot Password?</a>
                                </span>
                            </span>
                        </div>
                    </div>
            </div>
        </div>
    )
}


export default Login