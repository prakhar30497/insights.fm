import React from "react";
import { loginUrl, useSpotify } from '../utils/useSpotify';
import '../styles/Login.css'

const Dashboard = () => {
  const { user } = useSpotify();

  return user && (
    <div className='login'>
      <h1>{`Welcome, ${user.display_name}`}</h1>
      <a className='loginButton' href={loginUrl}>Visit Profile</a>
    </div>
  )
}

export default Dashboard;