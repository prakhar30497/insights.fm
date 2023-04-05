import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpotify } from '../utils/useSpotify'

const Discover = () => {
    const { fetchNewReleases, fetchFeaturedPlaylists } = useSpotify();
    const navigate = useNavigate();

    const [newReleases, setNewReleases] = useState([])

    useEffect(() => {
        fetchNewReleases().then(data => setNewReleases(data.albums.items))
        fetchFeaturedPlaylists()
    }, [])

    return (
        <div className='wrapper'>
            {newReleases && newReleases.length > 0 && <div className='list-wrapper'>
                <div className='list-header'>
                    <h2>New Releases</h2>
                </div>
                <div className='list-grid'>
                    {newReleases && newReleases.slice(0,10).map((album) => {
                    return (
                        <div className='list-grid-items' onClick={() => 
                        {navigate(`/album/${album.id}`)}}>
                        <div className='list-grid-item-image'>
                            <img src={album.images[0].url} alt=''/>
                        </div>
                        <div className='list-grid-item-name'>{album.name}</div>
                        </div>
                    )
                    })}
                </div>
            </div>}
        </div>
    )
}

export default Discover;