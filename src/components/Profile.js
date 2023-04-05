import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { v4 as uuid } from "uuid";
import { useSpotify } from "../utils/useSpotify";
import { convertTime } from "../utils/index";
import Loader from "./Loader";
import "../styles/Profile.css";

const Profile = () => {
  const {
    fetchUserTopItems,
    fetchUserProfile,
    fetchSavedAlbums,
    fetchFollowedArtists,
    fetchSavedTracks,
    fetchCurrentUserPlaylists,
    user,
    fetchArtistData,
    fetchAudioFeatures,
    fetchAudioAnalysis,
    token,
  } = useSpotify();

  const GET_USER_PROFILE = gql`
    query UserProfile {
      getUserProfile(token: "${token}") {
        userTaste {
          key
          value
          info
        },
        name,
        id
      }
    }
  `;
  const { loading, error, data } = useQuery(GET_USER_PROFILE);
  let userProfileData = data && data.getUserProfile;

  const [artists, setArtists] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [genres, setGenres] = useState([]);
  const [followers, setFollowers] = useState("NA");
  const [following, setFollowing] = useState("NA");
  const [numPlaylists, setNumPlaylists] = useState("NA");
  const userImageUrl = user && user.images.length > 0 ? user.images[0].url : "";

  const filters = ["ALL TIME", "HALF YEAR", "LAST MONTH"];
  const time_range = ["long_term", "medium_term", "short_term"];
  const [trackFilter, setTrackFilter] = useState(0);
  const [artistFilter, setArtistFilter] = useState(0);

  const [selectedInsight, setSelectedInsight] = useState("acousticness");
  const [insight, setInsight] = useState("");

  useEffect(() => {
    fetchUserTopItems("artists", "long_term", 10).then((data) => {
      let genreList = [];
      setArtists(data.items);
      setFollowing(data.total);
      data.items.map((item) => {
        genreList = [...new Set(genreList.concat(item.genres))];
      });
      // genreList.sort()
      setGenres(genreList);
    });
    fetchUserTopItems("tracks", "long_term", 10).then((data) =>
      setTracks(data.items)
    );
    fetchCurrentUserPlaylists().then((data) => setNumPlaylists(data.total));
  }, []);

  useEffect(() => {
    setFollowers((user && user.followers && user.followers.total) || "NA");
  }, [user]);

  useEffect(() => {
    console.log(userProfileData);
    setInsight(
      userProfileData &&
        userProfileData.userTaste &&
        userProfileData.userTaste[0].info
    );
  }, [userProfileData]);

  // useEffect(() => {
  //   console.log(data)
  // }, [data])

  const handleFilterClick = (type, index) => {
    if (type === "artists") {
      setArtistFilter(index);
      fetchUserTopItems("artists", time_range[index], 10).then((data) =>
        setArtists(data.items)
      );
    } else {
      setTrackFilter(index);
      fetchUserTopItems("tracks", time_range[index], 10).then((data) =>
        setTracks(data.items)
      );
    }
  };

  const handleInsightClick = ({ key, info }) => {
    setSelectedInsight(key);
    setInsight(info);
  };

  return !tracks || !artists ? (
    <Loader />
  ) : (
    <div className="wrapper">
      <div className="user-header">
        <div className="user-profile">
          <div className="user-image">
            <img
              src={userImageUrl}
              alt=""
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg";
              }}
            />
          </div>
          <div className="name-header">
            <a
              className="user-name"
              href={user && user.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              {user && user.display_name}
            </a>
          </div>
        </div>
        <div>
          <div className="profile-open-spotify">
            <a
              href={user && user.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={"primary-background-color follow-button"}>
                Open in Spotify
              </div>
            </a>
          </div>
          <div className="user-stats">
            <div className="stat">
              <div>{followers}</div>
              <div className="gray">FOLLOWERS</div>
            </div>
            <div className="stat">
              <div>{following}</div>
              <div className="gray">FOLLOWING</div>
            </div>
            <div className="stat">
              <div>{numPlaylists}</div>
              <div className="gray">PLAYLISTS</div>
            </div>
          </div>
        </div>
      </div>
      <div className="list-wrapper">
        <div className="list-header">
          <h2>Top Tracks</h2>
          <div className="list-filter">
            {filters.map((filter, index) => (
              <div
                key={filter + "tracks"}
                className={index === trackFilter ? "list-filter-selected" : ""}
                onClick={() => handleFilterClick("tracks", index)}
              >
                {filter}
              </div>
            ))}
          </div>
        </div>
        <ul className="list-content">
          {tracks &&
            tracks.map((item) => {
              const artistList = item.artists.map((artist) => artist.name);
              return (
                <li key={item.id + "profile"} className="list-content-item">
                  <Link to={`/track/${item.id}`}>
                    <div className="item-image">
                      <img
                        src={
                          item.album &&
                          item.album.images &&
                          item.album.images.length &&
                          (item.album.images[2].url ||
                            item.album.images[0].url ||
                            "")
                        }
                        alt=""
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg";
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
          {tracks.length === 0 && (
            <li className="list-content-item">
              <span className="item-name">No Data</span>
            </li>
          )}
        </ul>
      </div>
      <div className="list-wrapper">
        <div className="list-header">
          <h2>Top Artists</h2>
          <div className="list-filter">
            {filters.map((filter, index) => (
              <div
                key={filter + "artists"}
                className={index === artistFilter ? "list-filter-selected" : ""}
                onClick={() => handleFilterClick("artists", index)}
              >
                {filter}
              </div>
            ))}
          </div>
        </div>
        <ul className="list-content">
          {artists &&
            artists.map((item) => {
              return (
                <li key={item.id + "profile"} className="list-content-item">
                  <Link to={`/artist/${item.id}`}>
                    <div className="item-image">
                      <img
                        src={
                          item.images.length > 0 && (item.images[0].url || "")
                        }
                        alt=""
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg";
                        }}
                      />
                    </div>
                    <span className="item-name">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          {artists.length === 0 && (
            <li className="list-content-item">
              <span className="item-name">No Data</span>
            </li>
          )}
        </ul>
      </div>
      <div className="list-wrapper">
        <div className="list-header">
          <h2>Top Genres</h2>
        </div>
        <div className="list-content-genre" direction="row" spacing={1}>
          {genres.map((genre) => (
            <div key={genre} className="list-content-genre-item" label={genre}>
              {genre}
            </div>
          ))}
        </div>
      </div>
      {userProfileData && userProfileData.userTaste && (
        <div className="list-wrapper">
          <div className="list-header">
            <h2>Profile Insights</h2>
          </div>
          <div className="profile-insight-grid-wrapper">
            <div className="profile-insight-grid">
              {userProfileData.userTaste.map((metadata) => {
                return (
                  <div
                    className={
                      metadata.key === selectedInsight
                        ? "profile-insight active-profile-insight-card"
                        : "profile-insight"
                    }
                    onClick={(e) => handleInsightClick(metadata)}
                  >
                    <div className="profile-insight-detail-value">
                      {metadata.value}
                    </div>
                    <div className="profile-insight-detail-label">
                      {metadata.key[0].toUpperCase() + metadata.key.slice(1)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {insight && (
            <div id="insight" className="insight-info">
              {insight}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
