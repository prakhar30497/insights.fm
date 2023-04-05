import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSpotify } from '../utils/useSpotify'
import { convertTime } from '../utils/index'
import Loader from './Loader'

const TopTracks = () => {
  const { fetchUserTopItems } = useSpotify();

  const filters = ['ALL TIME', 'HALF YEAR', 'LAST MONTH']
  const time_range = ['long_term', 'medium_term', 'short_term']
  const [tracks, setTracks] = useState(null)
  const [trackFilter, setTrackFilter] = useState(0)

  useEffect(() => {
    fetchUserTopItems('tracks', 'long_term', 50).then(data => setTracks(data.items))
  }, [])

  const handleFilterClick = (type, index) => {
      setTrackFilter(index)
      fetchUserTopItems('tracks', time_range[index], 50).then(data => setTracks(data.items))
  }

  return (!tracks) ? <Loader /> : (
      <div className='wrapper'>
        <div className='list-wrapper'>
          <div className='list-header'>
            <h2>Top Tracks</h2>
            <div className='list-filter'>
              {filters.map((filter, index) => <div key={filter+"tracks"} className={index === trackFilter ? 'list-filter-selected': ''} onClick={() => handleFilterClick('tracks', index)}>{filter}</div>)}
            </div>
          </div>
          <ul className='list-content'>
            {tracks && tracks.map((item) => {
              const artistList = item.artists.map((artist) => artist.name)
              return (
                <li key={item.id} className='list-content-item'>
                  <Link to={`/track/${item.id}`}>
                    <div className='item-image'>
                      <img src={item.album.images[2] && item.album.images[2].url} alt='' onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://www.afrocharts.com/images/song_cover-500x500.png";
                      }}/>
                    </div>
                    <span className='item-name'>{item.name}</span>
                    <span className='item-name-sec'>{artistList.join(", ")}</span>
                    <span className='item-name-sec'>|</span>
                    <span className='item-name-sec'>{item.album.name}</span>
                    <span className='align-item-right item-name-sec'>{convertTime(item.duration_ms)}</span>
                  </Link>
                </li>)
            })}
          </ul>
        </div>
      </div>
  )
}

export default TopTracks;