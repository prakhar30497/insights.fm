import React from "react";
import { loginUrl } from '../utils/useSpotify';
import '../styles/Login.css'

function LoginPage() {
    return (
        <div className='login'>
            <h1>Insights.fm</h1>
            <a className='loginButton' href={loginUrl}>LOGIN WITH SPOTIFY</a>
        </div>
    )
}

export default LoginPage;