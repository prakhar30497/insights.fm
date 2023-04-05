import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { useSpotify } from "../utils/useSpotify";
import Loader from "./Loader";
import {
  convertTime,
  capitalizeFirstLetter,
  convertDate,
  totalAlbumTime,
} from "../utils/index";
import "../styles/Album.css";
import Error from "./Error";

const Album = () => {
  const { fetchAlbum, fetchAlbumInfo, token } = useSpotify();
  const { albumId } = useParams();
  const navigate = useNavigate();

  const GET_ALBUM_INFO = gql`
  query AlbumInfo {
    getAlbumData(id: "${albumId}", token: "${token}") {
      info
      name
      id
      type
      artists {
        name
        id
      }
      tracks {
        id
        name
        duration_ms
      }
      popularity
      albumImageUrl
      spotifyUrl
      total_tracks
      label
      release_date
    }
  }
  `;
  const { loading, error, data } = useQuery(GET_ALBUM_INFO);
  const album_data = data && data.getAlbumData;

  const [album, setAlbum] = useState(null);
  const [readMore, setReadMore] = useState("Read more");

  useEffect(() => {
    // fetchAlbum(albumId).then(data => {
    //   setAlbum(data)
    //   fetchAlbumInfo(data.artists[0].name, data.name)
    // })
  }, []);

  const handleReadMore = () => {
    if (readMore === "Read more") {
      setReadMore("Read less");
      document.getElementById("artist-info").classList.remove("add-line-clamp");
    } else {
      setReadMore("Read more");
      document.getElementById("artist-info").classList.add("add-line-clamp");
    }
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
            src={album_data.albumImageUrl || ""}
            alt=""
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://w7.pngwing.com/pngs/190/777/png-transparent-music-musical-note-computer-icons-musical-note-text-logo-musician.png";
            }}
          />
        </div>
        <div className="artist-name-header">
          <div className="page">{capitalizeFirstLetter(album_data.type)}</div>
          <a
            className="header-title"
            href={album_data.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {album_data.name}
          </a>
          <div className="artist-name-list">
            {album_data.artists &&
              album_data.artists.map((artist, i) => {
                return (
                  <span
                    key={i}
                    className="artist-name-list-item"
                    onClick={() => {
                      navigate(`/artist/${artist.id}`);
                    }}
                  >
                    {artist.name}
                    {album_data.artists.length > 0 &&
                    i === album_data.artists.length - 1
                      ? ""
                      : " /"}
                    &nbsp;
                  </span>
                );
              })}
          </div>
          <div>
            <a
              href={album_data.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={"primary-background-color follow-button"}>
                Open in Spotify
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className="list-wrapper album-details-grid-wrapper">
        <div className="album-details-grid">
          <div className="album-details">
            <div className="album-detail-value">
              {convertDate(album_data.release_date)}
            </div>
            <div className="album-detail-label">Release Date</div>
          </div>
          <div className="album-details">
            <div className="album-detail-value">
              {album_data && album_data.total_tracks}
            </div>
            <div className="album-detail-label">Tracks</div>
          </div>
          <div className="album-details">
            <div className="album-detail-value">
              {totalAlbumTime(album_data.tracks)}
            </div>
            <div className="album-detail-label">Total Time</div>
          </div>
          <div className="album-details">
            <div className="album-detail-value">
              {(album_data && album_data.label) || "NA"}
            </div>
            <div className="album-detail-label">Label</div>
          </div>
        </div>
      </div>
      {album_data.info && (
        <div className="list-wrapper">
          <div id="artist-info" className="artist-info">
            {album_data.info}
          </div>
          {/* <div className='read-more' onClick={handleReadMore}>{readMore}</div> */}
        </div>
      )}
      <div className="list-wrapper">
        <div className="list-header">
          <h2>Tracklist</h2>
        </div>
        <ul className="list-content">
          {album_data.tracks &&
            album_data.tracks.map((item) => {
              // const artistList = item.track.artists.map((artist) => artist.name)
              return (
                <li key={item.id + "album"} className="list-content-item">
                  <Link to={`/track/${item.id}`}>
                    <div className="item-image">
                      <img
                        src={album_data.albumImageUrl || ""}
                        alt=""
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://w7.pngwing.com/pngs/190/777/png-transparent-music-musical-note-computer-icons-musical-note-text-logo-musician.png";
                        }}
                      />
                    </div>
                    <span className="item-name">{item.name}</span>
                    {/* <span className='item-name-sec'>{artistList.join(", ")}</span> */}
                    {/* <span className='item-name-sec'>|</span> */}
                    {/* <span className='item-name-sec'>{item.track.album.name}</span> */}
                    <span className="align-item-right item-name-sec">
                      {convertTime(item.duration_ms)}
                    </span>
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default Album;
