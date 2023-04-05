import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSpotify } from "../utils/useSpotify";
import { useQuery, gql } from "@apollo/client";
import Loader from "./Loader";
import { convertTime } from "../utils/index";
import "../styles/Artist.css";
import Error from "./Error";

const Artist = (props) => {
  const {
    fetchArtistData,
    fetchArtistAlbums,
    fetchArtistTopTracks,
    fetchRelatedArtists,
    fetchArtistInfo,
    checkFollowed,
    followArtist,
    fetchAlbum,
    fetchTrackInfo,
    token,
    search,
  } = useSpotify();
  const { artistId } = useParams();
  const navigate = useNavigate();

  const GET_ARTIST_INFO = gql`
  query ArtistInfo {
    getArtistData(id: "${artistId}", token: "${token}") {
      info,
      name,
      id,
      followers,
      popularity,
      artistImageUrl,
      spotifyUrl
      tracks {
        name
        id
        trackImageUrl
        duration_ms
        artists {
          name
        }
        album {
          name
        }
      },
      albums {
        name
        id
        popularity
        albumImageUrl
        total_tracks
        release_date
      }
      mostPopularAlbums {
        name
        id
        popularity
        albumImageUrl
        total_tracks
        release_date
      }
      topListeners {
        id
        name
        userImageUrl
      }
    }
  }
`;
  const { loading, error, data } = useQuery(GET_ARTIST_INFO);
  let artist_data = data && data.getArtistData;

  const [artist, setArtist] = useState({});
  const [artistInfo, setArtistInfo] = useState("");
  const [tracks, setTracks] = useState([]);
  const [following, setFollowing] = useState(false);
  const [genres, setGenres] = useState([]);
  const [albums, setAlbums] = useState(
    (artist_data && artist_data.mostPopularAlbums) || []
  );
  const [relatedArtists, setRelatedArtists] = useState();
  const [numAlbums, setNumAlbums] = useState("NA");
  const [readMore, setReadMore] = useState("Read more");
  const artistImageUrl = artist.images ? artist.images[0].url : "";
  const artistBackgroundUrl = artist.images ? artist.images[0].url : "";

  const filters = ["MOST POPULAR", "RECENT"];
  const time_range = ["long_term", "medium_term", "short_term"];
  const [albumFilter, setAlbumFilter] = useState(0);

  const backgroundStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
url(${artistBackgroundUrl})`,

    backgroundSize: "cover",
    width: "100%",
  };

  useEffect(() => {
    // fetchArtistData(artistId).then(data => {
    //   setArtist(data)
    //   fetchArtistInfo(data.name.replace(/ /g,"_"))
    // }).then(data => {
    //   setArtistInfo(data.extract)}
    //   )
    // fetchArtistAlbums(artistId).then(data => {
    //   setNumAlbums(data.total)
    //   data.items.forEach((item)=>{
    //     fetchAlbum(item.id)
    //   })
    // })
    // fetchArtistTopTracks(artistId).then(data => setTracks(data.tracks))
    fetchRelatedArtists(artistId).then((data) =>
      setRelatedArtists(data.artists)
    );
    checkFollowed("artist", artistId).then((data) => setFollowing(data[0]));
    // const getArtistInfo = async () => {
    //   const data = await fetchArtistData(artistId);
    //   setArtist(data)
    //   const info = await fetchArtistInfo(data.name
    //     // .replace(/ /g,"_")
    //     )
    //   setArtistInfo(info.artist.bio.content.split('<a')[0])
    //   document.getElementById('artist-info').classList.add('add-line-clamp')
    // }

    // getArtistInfo()
  }, [artistId]);

  useEffect(() => {
    // let albums = artist_data && [...artist_data.albums]
    // let sortedAlbums = []
    // if(albums) albums.sort((a, b) => b.popularity - a.popularity);
    // setAlbums(sortedAlbums)
    // console.log(sortedAlbums)
    if (artist_data) {
      setAlbums(artist_data.mostPopularAlbums);
      setAlbumFilter(0);
    }
  }, [artist_data]);

  useEffect(() => {
    if (artist_data && artist_data.info) {
      document.getElementById("artist-info").classList.add("add-line-clamp");
    }
  }, [artist_data]);

  const handleFollowButtonClick = () => {
    const method = !following ? "PUT" : "DELETE";
    followArtist(artistId, method);
    setFollowing(!following);
  };

  const handleFilterClick = (index) => {
    setAlbumFilter(index);
    if (index === 1) {
      setAlbums(artist_data.albums);
    } else {
      setAlbums(artist_data.mostPopularAlbums);
    }
    // fetchUserTopItems('tracks', time_range[index], 10).then(data => setTracks(data.items))
  };

  const handleReadMore = () => {
    if (readMore === "Read more") {
      setReadMore("Read less");
      document.getElementById("artist-info").classList.remove("add-line-clamp");
    } else {
      setReadMore("Read more");
      document.getElementById("artist-info").classList.add("add-line-clamp");
    }
  };

  const openSpotify = () => {
    window.open(artist_data.spotifyUrl, "mywindow");
  };

  if (error) {
    return <Error />;
  }

  return loading ? (
    <Loader />
  ) : (
    <div className="wrapper">
      <div className="artist-header">
        <div className="artist-image">
          <img
            src={artist_data.artistImageUrl || ""}
            alt=""
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg";
            }}
          />
        </div>
        <div className="artist-name-header">
          <div className="page">Artist</div>
          <a
            className="header-title"
            href={artist_data.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {artist_data.name}
          </a>
          <div>
            <a
              href={artist_data.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={"primary-background-color follow-button"}>
                Open in Spotify
              </div>
            </a>
          </div>
          {/* <div className={following ? 'primary-background-color follow-button' : 'follow-button'} onClick={handleFollowButtonClick}>{following ? 'Following' : 'Follow'}</div> */}
        </div>
        <div className="artist-stats">
          <div className="stat">
            <div>{artist_data.followers}</div>
            <div className="gray">FOLLOWERS</div>
          </div>
          <div className="stat">
            <div>{artist_data.popularity}%</div>
            <div className="gray">POPULARITY</div>
          </div>
        </div>
      </div>
      <div className="list-wrapper" style={{ marginTop: 0, marginBottom: 0 }}>
        {artist_data.info && (
          <div id="artist-info" className="artist-info">
            {artist_data.info}
          </div>
        )}
        {artist_data.info && (
          <div className="read-more" onClick={handleReadMore}>
            {readMore}
          </div>
        )}
        <div
          className="list-content-genre"
          direction="row"
          spacing={1}
          style={{ marginBottom: 0 }}
        >
          {artist.genres &&
            artist.genres.map((genre) => (
              <div
                key={genre}
                className="list-content-genre-item"
                label={genre}
              >
                {genre}
              </div>
            ))}
        </div>
      </div>
      <div
        className="artist-content list-wrapper"
        style={{ marginTop: 0, marginBottom: 0 }}
      >
        <div className="artist-content-section1">
          <div className="list-header">
            <h2>Popular Songs</h2>
          </div>
          <ul className="list-content">
            {artist_data &&
              artist_data.tracks.map((item) => {
                const artistList = item.artists.map((artist) => artist.name);
                return (
                  <li key={item.id + "artist"} className="list-content-item">
                    <Link to={`/track/${item.id}`}>
                      <div className="item-image">
                        <img
                          src={item.trackImageUrl || ""}
                          alt=""
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://w7.pngwing.com/pngs/190/777/png-transparent-music-musical-note-computer-icons-musical-note-text-logo-musician.png";
                          }}
                        />
                      </div>
                      <span className="item-name">{item.name}</span>
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
        {/* <div className='artist-content-section2'>
            
              <div className='list-header'>
                <h2>Overview</h2>
              </div>
              <div className='info-content'>
                {artistInfo}
              </div>
          </div> */}
      </div>
      {albums && albums.length > 0 && (
        <div className="list-wrapper">
          <div className="list-header">
            <h2>Albums</h2>
            <div className="album-list-filter">
              {filters.map((filter, index) => (
                <div
                  key={filter + "artists"}
                  className={
                    index === albumFilter ? "list-filter-selected" : ""
                  }
                  onClick={() => handleFilterClick(index)}
                >
                  {filter}
                </div>
              ))}
            </div>
          </div>
          <div className="list-grid">
            {albums &&
              albums.slice(0, 10).map((album) => {
                return (
                  <div
                    className="list-grid-items"
                    onClick={() => {
                      navigate(`/album/${album.id}`, { state: { album } });
                    }}
                  >
                    <div className="list-grid-item-image">
                      <img
                        src={album.albumImageUrl}
                        alt=""
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://w7.pngwing.com/pngs/190/777/png-transparent-music-musical-note-computer-icons-musical-note-text-logo-musician.png";
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
            {/* <div className='list-grid-items'>
              <div className='view-all list-grid-item-image'>
                View All ⮞
              </div>
            </div> */}
          </div>
        </div>
      )}
      {relatedArtists && relatedArtists.length > 0 && (
        <div className="list-wrapper">
          <div className="list-header">
            <h2>Related Artists</h2>
          </div>
          <div className="list-grid">
            {relatedArtists &&
              relatedArtists.slice(0, 10).map((artist) => {
                return (
                  <div
                    className="list-grid-items"
                    onClick={() => {
                      navigate(`/artist/${artist.id}`);
                    }}
                  >
                    <div className="list-grid-item-image">
                      <img
                        src={
                          (artist.images &&
                            artist.images.length > 0 &&
                            artist.images[0].url) ||
                          ""
                        }
                        alt=""
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg";
                        }}
                      />
                    </div>
                    <div className="list-grid-item-name">{artist.name}</div>
                  </div>
                );
              })}
            {/* <div className='list-grid-items'>
              <div className='view-all list-grid-item-image'>
                View All ⮞
              </div>
            </div> */}
          </div>
        </div>
      )}
      {artist_data &&
        artist_data.topListeners &&
        artist_data.topListeners.length > 0 && (
          <div className="list-wrapper">
            <div className="list-header">
              <h2>Top Listeners</h2>
            </div>
            <div className="list-grid">
              {artist_data.topListeners &&
                artist_data.topListeners.map((user) => {
                  return (
                    <div
                      className="top-listener"
                      // onClick={() =>
                      //   {navigate(`/artist/${user.id}`)}}
                    >
                      <div className="top-listener-image">
                        <img
                          src={user.userImageUrl || ""}
                          alt=""
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg";
                          }}
                        />
                      </div>
                      <div className="top-listener-name">{user.name}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
    </div>
  );
};

export default Artist;
