import React, { useEffect, useState, useCallback } from "react";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Link, useNavigate } from "react-router-dom";
import { useSpotify } from "../utils/useSpotify";
import { convertTime } from "../utils/index";
import Loader from "./Loader";
import "../styles/Search.css";

const Search = () => {
  const navigate = useNavigate();

  const { fetchGenres, search } = useSpotify();

  const [tracks, setTracks] = useState(null);
  const [albums, setAlbums] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [artists, setArtists] = useState(null);
  const [genres, setGenres] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [genre, setGenre] = useState(null);
  const [year, setYearValue] = React.useState([0, 73]);
  const [yearChanged, setYearChanged] = React.useState(false);

  const ariaLabel = { "aria-label": "description" };
  const marks = [
    {
      value: 0,
      label: "1950",
    },
    {
      value: 73,
      label: "2023",
    },
  ];

  useEffect(() => {
    fetchGenres().then((data) => setGenres(data.genres));
  }, []);

  // const eventFunction = useCallback((event) => {
  //   if (event.key === "Enter") {
  //     handleSearch()
  //   }
  // }, []);

  // useEffect(() => {
  //   document.addEventListener("keydown", eventFunction, false);

  //   return () => {
  //     document.removeEventListener("keydown", eventFunction, false);
  //   };
  // }, [eventFunction]);

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleYearChange = (event, newValue) => {
    setYearValue(newValue);
    setYearChanged(true);
  };

  const handleGenreChange = (event, newValue) => {
    setGenre(newValue);
  };

  const handleSearch = (event) => {
    let query = searchQuery;
    query = genre ? query.concat(` genre:${genre}`) : query;
    query =
      year.length === 2 && yearChanged
        ? query.concat(` year:${year[0] + 1950}-${year[1] + 1950}`)
        : query;
    search(query).then((data) => {
      setTracks(data.tracks.items);
      setAlbums(data.albums.items);
      setArtists(data.artists.items);
      setPlaylists(data.playlists.items);
    });
  };

  const valuetext = (value) => {
    return `${value + 1950}`;
  };

  const valueLabelFormat = (value) => {
    return `${value + 1950}`;
  };

  return (
    <div className="wrapper">
      {/* <div className='search'>
        <input className='search-input' type="text" placeholder='Search' onChange={handleChange}/>
        <div>
          <img src="../search.png" alt=''/>
        </div>
      </div> */}
      <div className="list-wrapper">
        <div className="list-header">
          <h2>Find Music</h2>
        </div>
        <div className="genre-filter">
          <div className="genre-filter">
            <div className="filter-name">Search</div>
            <Input
              className="genre-select"
              type="text"
              onChange={handleChange}
              inputProps={ariaLabel}
            />
          </div>
          <div className="genre-filter">
            <div className="filter-name">Genre</div>
            <Autocomplete
              className="genre-select"
              disablePortal
              id="genre-filter"
              size="small"
              options={genres}
              sx={{ width: 200 }}
              renderInput={(params) => <TextField {...params} />}
              onChange={handleGenreChange}
            />
          </div>
          <div className="year-filter">
            <div className="filter-name">Year Range</div>
            <Box sx={{ width: 200 }}>
              <Slider
                color="primary"
                getAriaLabel={() => "Year range"}
                value={year}
                onChange={handleYearChange}
                valueLabelDisplay="on"
                getAriaValueText={valuetext}
                valueLabelFormat={valueLabelFormat}
                min={0}
                max={73}
              />
            </Box>
          </div>
          <div
            className={"search-button primary-background-color follow-button"}
            style={{ marginTop: 0 }}
            onClick={handleSearch}
          >
            {"Search"}
          </div>
        </div>
      </div>
      {tracks && tracks.length > 0 && (
        <div className="list-wrapper">
          <div className="list-header">
            <h2>Tracks</h2>
          </div>
          <ul className="list-content">
            {tracks.map((item) => {
              const artistList = item.artists.map((artist) => artist.name);
              return (
                <li key={item.id + "profile"} className="list-content-item">
                  <Link to={`/track/${item.id}`}>
                    <div className="item-image">
                      <img
                        src={item.album.images[2].url}
                        alt=""
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://w7.pngwing.com/pngs/190/777/png-transparent-music-musical-note-computer-icons-musical-note-text-logo-musician.png";
                        }}
                      />
                    </div>
                    <span className="item-name">{item.name}</span>
                    <span className="item-name-sec">
                      {artistList.join(", ")}
                    </span>
                    <span className="item-name-sec">|</span>
                    <span className="item-name-sec">{item.album.name}</span>
                    <span className="align-item-right item-name-sec">
                      {convertTime(item.duration_ms)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {artists && artists.length > 0 && (
        <div className="list-wrapper">
          <div className="list-header">
            <h2>Artists</h2>
          </div>
          <div className="list-grid">
            {artists.map((item) => {
              return (
                <div
                  className="list-grid-items"
                  onClick={() => {
                    navigate(`/artist/${item.id}`);
                  }}
                >
                  <div className="list-grid-item-image">
                    <img
                      src={item.images[0] && item.images[0].url}
                      alt=""
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg";
                      }}
                    />
                  </div>
                  <div className="list-grid-item-name">{item.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {albums && albums.length > 0 && (
        <div className="list-wrapper">
          <div className="list-header">
            <h2>Albums</h2>
          </div>
          <div className="list-grid">
            {albums.map((album) => {
              return (
                <div
                  className="list-grid-items"
                  onClick={() => {
                    navigate(`/album/${album.id}`);
                  }}
                >
                  <div className="list-grid-item-image">
                    <img
                      src={album.images[0] && album.images[0].url}
                      alt=""
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg";
                      }}
                    />
                  </div>
                  <div className="list-grid-item-name">{album.name}</div>
                  <div className="list-grid-item-info">
                    {album.total_tracks} tracks •{" "}
                    {album.release_date.substring(0, 4)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {playlists && playlists.length > 0 && (
        <div className="list-wrapper">
          <div className="list-header">
            <h2>Playlists</h2>
          </div>
          <div className="list-grid">
            {playlists.map((item) => {
              return (
                <div
                  className="list-grid-items"
                  onClick={() => {
                    navigate(`/playlist/${item.id}`);
                  }}
                >
                  <div className="list-grid-item-image">
                    <img
                      src={item.images[0] && item.images[0].url}
                      alt=""
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://www.afrocharts.com/images/song_cover-500x500.png";
                      }}
                    />
                  </div>
                  <div className="list-grid-item-name">{item.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
