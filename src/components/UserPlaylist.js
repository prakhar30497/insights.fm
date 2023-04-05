import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { v4 as uuid } from 'uuid';
import { useSpotify } from '../utils/useSpotify'
import { convertTime } from '../utils/index'
import Loader from './Loader'

const UserPlaylist = () => {
    const { fetchPlaylist } = useSpotify();
    const { playlistId } = useParams();

    const [playlist, setPlaylist] = useState(null)

    useEffect(() => {
      fetchPlaylist(playlistId).then(data => setPlaylist(data))
      // getRecommendations("", "", trackId)
    }, [])

    return !playlist ? <Loader /> : (
      <div className='wrapper'>
        <div className='artist-header'>
          <div className='artist-image'>
            <img src={(playlist.images[0] && playlist.images[0].url) || ''} alt='' onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://www.afrocharts.com/images/song_cover-500x500.png";
                      }}/>
          </div>
          <div className='artist-name-header'>
            <div className='page'>Playlist</div>
            <a className='header-title' href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">{playlist.name}</a>
            {/* <div>By {playlist.owner.display_name}</div> */}
            <div>
              <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                <div className={'primary-background-color follow-button'}>Open in Spotify</div>
              </a>
            </div>
          </div>
        </div>
        <div className='list-wrapper' style={{ marginTop: 0, marginBottom: 0 }}>
          <div className='list-header'>
            <h2>Tracks</h2>
          </div>
          <ul className='list-content'>
            {playlist.tracks && playlist.tracks.items && playlist.tracks.items.length ? playlist.tracks.items.map((item) => {
              const artistList = item.track && item.track.artists && item.track.artists.map((artist) => artist.name)
              return item.track && (
                <li key={item.track.id+"playlist"} className='list-content-item'>
                  <Link to={`/track/${item.track.id}`}>
                    <div className='item-image'>
                      <img src={item.track.album.images[0].url} alt=''/>
                    </div>
                    <span className='item-name'>{item.track.name}</span>
                    <span className='item-name-sec'>{artistList.join(", ")}</span>
                    <span className='item-name-sec'>|</span>
                    <span className='item-name-sec'>{item.track.album.name}</span>
                    <span className='align-item-right item-name-sec'>{convertTime(item.track.duration_ms)}</span>
                  </Link>
                </li>)
            }) : 'No Data'} 
          </ul>
        </div>
      </div>
  )
}

export default UserPlaylist;