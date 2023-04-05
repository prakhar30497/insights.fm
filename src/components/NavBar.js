import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.svg'
import '../styles/NavBar.css'
import { logout } from '../utils/index'

let activeClassName = "active";

const NavBar = () => {
    const navigate = useNavigate();
    return (
        <nav className='nav'>
            <div style={{ display: 'flex', justifyContent: 'center'}}>
                {/* <Link to='/'>
                    <img src={Logo} className="App-logo" alt="logo" />
                </Link> */}
                <div className='app-name' onClick={() => 
                  {navigate(`/`)}}>Insights.fm</div>
            </div>
            {/* <div className='nav-list'>
                <div className='nav-list-item'>
                    <NavLink to='/' >
                        {({ isActive }) => (
                            <span
                                className={
                                isActive ? activeClassName : undefined
                                }
                            >
                                Profile
                            </span>
                        )}
                    </NavLink>
                </div>
                <div className='nav-list-item'>
                    <NavLink to='/search'>
                        {({ isActive }) => (
                            <span
                                className={
                                isActive ? activeClassName : undefined
                                }
                            >
                                Search
                            </span>
                        )}
                    </NavLink>
                </div>
                <div className='nav-list-item'>
                    <NavLink to='/discover'>
                        {({ isActive }) => (
                            <span
                                className={
                                isActive ? activeClassName : undefined
                                }
                            >
                                Discover
                            </span>
                        )}
                    </NavLink>
                </div>
            </div> */}
            <div className='nav-list'>
                <div className='nav-list-item'>
                    <NavLink to='/' >
                        {({ isActive }) => (
                            <span
                                className={
                                isActive ? activeClassName : undefined
                                }
                            >
                                Profile
                            </span>
                        )}
                    </NavLink>
                </div>
                <div className='nav-list-item'>
                    <NavLink to='/search'>
                        {({ isActive }) => (
                            <span
                                className={
                                isActive ? activeClassName : undefined
                                }
                            >
                                Search
                            </span>
                        )}
                    </NavLink>
                </div>
                {/* <div className='nav-list-item'>
                    <NavLink to='/favorites'>
                        {({ isActive }) => (
                            <span
                                className={
                                isActive ? activeClassName : undefined
                                }
                            >
                                Favorites
                            </span>
                        )}
                    </NavLink>
                </div> */}
                {/* <div className='nav-list-item'>
                    <NavLink to='/albums'>
                        {({ isActive }) => (
                            <span
                                className={
                                isActive ? activeClassName : undefined
                                }
                            >
                                Albums
                            </span>
                        )}
                    </NavLink>
                </div> */}
                <div className='nav-list-item'>
                    <NavLink to='/top-tracks'>
                        {({ isActive }) => (
                            <span
                                className={
                                isActive ? activeClassName : undefined
                                }
                            >
                                Top Tracks
                            </span>
                        )}
                    </NavLink>
                </div>
                <div className='nav-list-item'>
                    <NavLink to='/top-artists'>
                        {({ isActive }) => (
                            <span
                                className={
                                isActive ? activeClassName : undefined
                                }
                            >
                                Top Artists
                            </span>
                        )}
                    </NavLink>
                </div>
                <div className='nav-list-item'>
                    <NavLink to='/recent'>
                        {({ isActive }) => (
                            <span
                                className={
                                isActive ? activeClassName : undefined
                                }
                            >
                                Recent
                            </span>
                        )}
                    </NavLink>
                </div>
                <div className='nav-list-item'>
                    <NavLink to='/playlists'>
                        {({ isActive }) => (
                            <span
                                className={
                                isActive ? activeClassName : undefined
                                }
                            >
                                Playlists
                            </span>
                        )}
                    </NavLink>
                </div>
            </div>
            <div className='logout'>
                <div className={'logout-button'} onClick={logout}>{'Logout'}</div>
            </div>
        </nav>
    )
}

export default NavBar;