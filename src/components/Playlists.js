import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSpotify } from '../utils/useSpotify'
import { convertTime } from '../utils/index'
import Loader from './Loader'
import '../styles/Profile.css'

const Playlists = () => {
  const { fetchCurrentUserPlaylists, fetchPlaylist } = useSpotify();

  const [playlists, setPlaylists] = useState(null)

  useEffect(() => {
    fetchCurrentUserPlaylists().then(data => {
      setPlaylists(data.items)
      // data.items.forEach(item => fetchPlaylist(item.id))
    })
  }, [])

  return (!playlists) ? <Loader /> : (
      <div className='wrapper'>
        <div className='list-wrapper'>
          <div className='list-header'>
            <h2>Your Playlists</h2>
          </div>
          <div className='list-grid'>
            {playlists && playlists.map((playlist) => {
              return (
                <Link to={`/playlist/${playlist.id}`}>
                  <div className='list-grid-items'>
                    <div className='list-grid-item-image'>
                      <img src={(playlist.images[0] && playlist.images[0].url) || ''} alt='' onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://www.afrocharts.com/images/song_cover-500x500.png";
                      }}/>
                    </div>
                    <div className='list-grid-item-name'>{playlist.name}</div>
                    {/* <div className='list-grid-item-info'>{playlist.tracks.total} tracks</div> */}
                  </div>
                </Link>
                
              )
            })}
          </div>
        </div>
      </div>
  )
}

export default Playlists;