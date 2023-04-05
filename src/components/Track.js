import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { useSpotify } from "../utils/useSpotify";
import Loader from "./Loader";
import { convertTime } from "../utils/index";
import "../styles/Track.css";
import Error from "./Error";

const Discover = () => {
  const {
    fetchUserTopItems,
    fetchTrack,
    fetchTrackInfo,
    fetchAudioFeatures,
    fetchAudioAnalysis,
    getRecommendations,
    token,
  } = useSpotify();
  const { trackId } = useParams();
  const navigate = useNavigate();

  const GET_TRACK_INFO = gql`
  query TrackInfo {
    getTrackData(id: "${trackId}", token: "${token}") {
      info,
      name,
      id,
      duration_ms,
      album {
        name
        id
        albumImageUrl
        release_date
        total_tracks
      }
      artists {
        name
        id
      }
      features {
        mode
        key
        tempo
        time_signature
      }
      popularity,
      trackImageUrl,
      spotifyUrl
      saved
      topListeners {
        id
        name
        userImageUrl
      }
    }
  }
  `;
  const { loading, error, data } = useQuery(GET_TRACK_INFO);
  const track_data = data && data.getTrackData;

  const [track, setTrack] = useState(null);
  const [trackInfo, setTrackInfo] = useState(null);
  const [features, setFeatures] = useState({});
  const [readMore, setReadMore] = useState("Read more");

  const artistList =
    (track_data && track_data.artists.map((artist) => artist.name)) || "";

  const keys = {
    0: "C",
    1: "C♯",
    2: "D",
    3: "D♯",
    4: "E",
    5: "F",
    6: "F♯",
    7: "G",
    8: "G♯",
    9: "A",
    10: "A♯",
    11: "B",
  };

  const modes = {
    0: "Minor",
    1: "Major",
  };

  useEffect(() => {
    // const getTrackInfo = async () => {
    //   const data = await fetchTrack(trackId);
    //   setTrack(data)
    //   const info = await fetchTrackInfo(data.artists[0].name, data.name)
    //   // fetchTrackInfo('Harry Styles', 'As it was')
    //   // setArtistInfo(info.artist.bio.summary)
    // }
    // getTrackInfo()
    // fetchTrack(trackId).then(data => {
    //   setTrack(data)
    //   // fetchTrackInfo(data.artists[0].name, data.name).then(data => { if (data.track.wiki) setTrackInfo(data.track.wiki.content.split('<a')[0])})
    // })
    // fetchAudioFeatures(trackId).then(data => setFeatures(data))
    // fetchAudioFeatures('2Qn6WHJrY5Im82Jux8FboH')
    // fetchAudioFeatures('3Fj47GNK2kUF0uaEDgXLaD')
    // fetchAudioFeatures('1abwytAhbWeHrbsA9eODOy')
    // fetchAudioFeatures('2InH5NvwoEymOEeUhpUq48')
    // fetchAudioFeatures('6DeeLMOEWJntSLgK1uFfSc')
    // fetchAudioFeatures('5XeFesFbtLpXzIVDNQP22n')
    // fetchAudioFeatures('0RjsxgVkmjWhxYYH7SZITk')
    // fetchAudioFeatures('4tAroWdVxOsx5teIaZqEHm')
    // fetchAudioFeatures('2MOoIbJWIYikwIXjBDe26i')
    // fetchAudioFeatures('1MprIFeBCp6gqiexinWCjZ')
    // fetchAudioFeatures('3Mmt4wAMtWRmObAxbejpPe')
    // fetchAudioFeatures('1pVvfmQB9OB8FqCbp2UGA8')
    // getRecommendations("","",'0rKtyWc8bvkriBthvHKY8d')
    // fetchAudioAnalysis(trackId)
  }, []);

  useEffect(() => {
    // if (track_data && track_data.info) {
    //   document.getElementById('artist-info').classList.add('add-line-clamp')
    // }
  }, [track_data]);

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
            src={track_data.trackImageUrl}
            alt=""
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://w7.pngwing.com/pngs/190/777/png-transparent-music-musical-note-computer-icons-musical-note-text-logo-musician.png";
            }}
          />
        </div>
        <div className="artist-name-header">
          <div className="page">Track</div>
          <a
            className="header-title"
            href={track_data.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {track_data.name}
          </a>
          <div className="artist-name-list">
            {track_data.artists &&
              track_data.artists.map((artist, i) => {
                return (
                  <span
                    key={i}
                    className="artist-name-list-item"
                    onClick={() => {
                      navigate(`/artist/${artist.id}`);
                    }}
                  >
                    {artist.name}
                    {track_data.artists.length > 0 &&
                    i === track_data.artists.length - 1
                      ? ""
                      : " /"}
                    &nbsp;
                  </span>
                );
              })}
          </div>
          <div>
            <a
              href={track_data.spotifyUrl}
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
      <div className="list-wrapper track-details-grid-wrapper">
        <div className="track-details-grid">
          <div className="track-details">
            <div className="track-detail-value">
              {convertTime(track_data.duration_ms)}
            </div>
            <div className="track-detail-label">Duration</div>
          </div>
          <div className="track-details">
            <div className="track-detail-value">
              {" "}
              {track_data.features && keys[track_data.features.key]}
            </div>
            <div className="track-detail-label">Key</div>
          </div>
          <div className="track-details">
            <div className="track-detail-value">
              {" "}
              {track_data.features && modes[track_data.features.mode]}
            </div>
            <div className="track-detail-label">Mode</div>
          </div>
          <div className="track-details">
            <div className="track-detail-value">
              {" "}
              {track_data.features && track_data.features.time_signature}/4
            </div>
            <div className="track-detail-label">Time Signature</div>
          </div>
          <div className="track-details">
            <div className="track-detail-value">
              {" "}
              {track_data.features && Math.round(track_data.features.tempo)}
            </div>
            <div className="track-detail-label">Tempo (BPM)</div>
          </div>
        </div>
      </div>
      <div className="list-wrapper track-details-grid-wrapper">
        <div
          className={"round-button"}
          onClick={() => {
            navigate(`/recommendations/${trackId}`, {
              state: {
                imageUrl: track_data.trackImageUrl,
                trackName: track_data.name,
                artistName: artistList.join(", "),
              },
            });
          }}
        >
          Create Similar Tracks Playlist
        </div>
      </div>
      <div className="list-wrapper">
        {track_data.info && (
          <div id="artist-info" className="artist-info">
            {track_data.info}
          </div>
        )}
        {/* {track_data.info && <div className='read-more' onClick={handleReadMore}>{readMore}</div>} */}
      </div>
      <div className="list-wrapper">
        <div className="list-header">
          <h2>Album</h2>
        </div>
        <div
          className="track-album-wrapper"
          onClick={() => {
            navigate(`/album/${track_data.album.id}`);
          }}
        >
          <div className="track-album-image">
            <img
              src={track_data.album.albumImageUrl || ""}
              alt=""
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://w7.pngwing.com/pngs/190/777/png-transparent-music-musical-note-computer-icons-musical-note-text-logo-musician.png";
              }}
            />
          </div>
          <div className="track-album-info">
            <div className="track-album-info-name">{track_data.album.name}</div>
            <div className="track-album-info-year">
              {track_data.album.release_date.substring(0, 4)}
            </div>
          </div>
        </div>
      </div>
      {track_data &&
        track_data.topListeners &&
        track_data.topListeners.length > 0 && (
          <div className="list-wrapper">
            <div className="list-header">
              <h2>Top Listeners</h2>
            </div>
            <div className="list-grid">
              {track_data.topListeners &&
                track_data.topListeners.map((user) => {
                  return (
                    <div
                      className="top-listener"
                      // onClick={() =>
                      //   {navigate(`/user/${user.id}`)}}
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

export default Discover;
