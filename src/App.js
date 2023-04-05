import React from 'react';
import Login from './components/Login';
import Home from './components/Home';
import { useSpotify } from './utils/useSpotify'
import './styles/index.css'

const App = () => {

  const { token, loggedIn } = useSpotify();

  return (
    <div className='container'>
      {loggedIn ? <Home /> : <Login />}
    </div>
  );
}

export default App;