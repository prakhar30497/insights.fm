import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSpotify } from '../utils/useSpotify'
import { convertTime } from '../utils/index'
import Loader from './Loader'

const TopArtists = () => {
  const { fetchUserTopItems } = useSpotify();

  const filters = ['ALL TIME', 'HALF YEAR', 'LAST MONTH']
  const time_range = ['long_term', 'medium_term', 'short_term']
  const [artists, setArtists] = useState(null)
  const [artistFilter, setArtistFilter] = useState(0)

  useEffect(() => {
    fetchUserTopItems('artists', 'long_term', 50).then(data => setArtists(data.items))
  }, [])

  const handleFilterClick = (type, index) => {
    setArtistFilter(index)
    fetchUserTopItems('artists', time_range[index], 50).then(data => setArtists(data.items))
  }

  return (!artists) ? <Loader /> : (
      <div className='wrapper'>
        <div className='list-wrapper'>
          <div className='list-header'>
            <h2>Top Artists</h2>
            <div className='list-filter'>
              {filters.map((filter, index) => <div key={filter+"artists"} className={index === artistFilter ? 'list-filter-selected': ''} onClick={() => handleFilterClick('artists', index)}>{filter}</div>)}
            </div>
          </div>
          <div className='list-grid'>
            {artists && artists.map((item) => {
              return (
                  <Link to={`/artist/${item.id}`}>
                    <div className='list-grid-items' >
                      <div className='list-grid-item-image'>
                        <img src={item.images[2] && item.images[2].url} alt='' onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg";
                        }}/>
                      </div>
                      <div className='list-grid-item-name'>{item.name}</div>
                    </div>
                  </Link>)
            })}
          </div>
        </div>
      </div>
  )
}

export default TopArtists;