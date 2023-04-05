import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import NavBar from './NavBar.js'
import Discover from './Discover';
import Profile from './Profile';
import Dashboard from './Dashboard';
import Search from './Search.js'
import Track from './Track';
import Artist from './Artist.js';
import Playlist from './Playlist.js'
import Recent from './Recent.js'
import Favorites from './Favorites.js'
import Playlists from './Playlists.js'
import UserPlaylist from './UserPlaylist.js'
import Album from './Album.js'
import TopTracks from './TopTracks.js'
import TopArtists from './TopArtists.js'
import User from './User.js'

// const store = configureStore(initialState, history);

const Home = () => {
    return (
      <div>
          <NavBar />
          <Routes>
            <Route path="/" exact element={<Profile/>} />
            <Route path="/discover" exact element={<Discover/>}/>
            <Route path="/search" end exact element={<Search/>}/>
            <Route path="/profile" exact element={<Profile/>}/>
            <Route path="/recent" exact element={<Recent/>}/>
            <Route path="/favorites" exact element={<Favorites/>}/>
            <Route path="/playlists" exact element={<Playlists/>}/>
            <Route path='*' render={() => (<>404</>)} />
            <Route path="/track/:trackId" element={<Track/>}/>
            <Route path="/artist/:artistId" element={<Artist/>}/>
            <Route path="/user/:userId" element={<User/>} />
            <Route path="/recommendations/:trackId" element={<Playlist/>}/>
            <Route path="/playlist/:playlistId" element={<UserPlaylist/>}/>
            <Route path="/album/:albumId" element={<Album/>}/>
            <Route path="/top-tracks" element={<TopTracks/>}/>
            <Route path="/top-artists" element={<TopArtists/>}/>
          </Routes>
      </div>
      
    );
}

export default Home;