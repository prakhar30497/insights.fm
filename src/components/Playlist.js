import React, { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { v4 as uuid } from "uuid";
import { useSpotify } from "../utils/useSpotify";
import { convertTime } from "../utils/index";
import Loader from "./Loader";
import Error from "./Error";

const Playlist = () => {
  const { createPlaylist, addPlaylistItems, token } = useSpotify();
  const { trackId } = useParams();
  const location = useLocation();
  const { trackName, artistName } = location.state;
  const GET_PLAYLIST = gql`
      query Playlist {
        getPlaylist(id: "${trackId}", token: "${token}") {
          name
          id
          trackList {
            id
            name
            trackImageUrl
            duration_ms
            artists {
              id
              name
            }
          }
        }
      }
    `;

  const [playlist, setPlaylist] = useState([]);
  const { loading, error, data } = useQuery(GET_PLAYLIST);
  const playlistData = data && data.getPlaylist;

  // useEffect(() => {
  //   getRecommendations("", "", trackId)
  // }, [])

  const onCreatePlaylist = () => {
    createPlaylist(
      playlistData.name,
      `Tracks that sound like ${trackName} by ${artistName}`
    ).then((data) => {
      const tracks =
        playlistData &&
        playlistData.trackList.map((track) => "spotify:track:" + track.id);
      if (tracks && tracks.length > 0) {
        addPlaylistItems(data.id, { uris: tracks }).then((resp) =>
          window.open(data.external_urls.spotify, "_blank").focus()
        );
      }
    });
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
            src={location.state.imageUrl || ""}
            alt=""
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://www.afrocharts.com/images/song_cover-500x500.png";
            }}
          />
        </div>
        <div className="artist-name-header">
          <div className="page">Playlist</div>
          <div className="header-title">{playlistData.name}</div>
          <div
            className={"primary-background-color follow-button"}
            onClick={onCreatePlaylist}
          >
            Add to Spotify
          </div>
        </div>
      </div>
      <div className="list-wrapper" style={{ marginTop: 0, marginBottom: 0 }}>
        <div
          id="artist-info"
          className="artist-info"
        >{`Tracks that sound like ${trackName} by ${artistName}`}</div>
      </div>
      <div className="list-wrapper">
        <ul className="list-content">
          {playlistData &&
            playlistData.trackList.map((item) => {
              const artistList = item.artists.map((artist) => artist.name);
              return (
                <li key={item.id + "playlist"} className="list-content-item">
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
                    <span className="item-name-sec">
                      {artistList.join(", ")}
                    </span>
                    <span className="align-item-right item-name-sec">
                      {convertTime(item.duration_ms)}
                    </span>
                    {/* <span className='item-name-sec'>|</span>
                      <span className='item-name-sec'>{item.album.name}</span> */}
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default Playlist;
