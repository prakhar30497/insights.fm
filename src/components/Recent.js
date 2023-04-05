import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSpotify } from "../utils/useSpotify";
import { convertTime } from "../utils/index";
import Loader from "./Loader";
import "../styles/Profile.css";

const Recent = () => {
  const { fetchRecentlyPlayed } = useSpotify();

  const [tracks, setTracks] = useState(null);

  useEffect(() => {
    fetchRecentlyPlayed().then((data) => {
      setTracks(data.items);
    });
  }, []);

  return !tracks ? (
    <Loader />
  ) : (
    <div className="wrapper">
      <div className="list-wrapper">
        <div className="list-header">
          <h2>Recently Played</h2>
        </div>
        <ul className="list-content">
          {tracks &&
            tracks.map((item) => {
              const artistList = item.track.artists.map(
                (artist) => artist.name
              );
              return (
                <li
                  key={item.track.id + "recent"}
                  className="list-content-item"
                >
                  <Link to={`/track/${item.track.id}`}>
                    <div className="item-image">
                      <img
                        src={
                          (item.track &&
                            item.track.album &&
                            item.track.album.images &&
                            item.track.album.images.length > 0 &&
                            item.track.album.images[2].url) ||
                          ""
                        }
                        alt=""
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://w7.pngwing.com/pngs/190/777/png-transparent-music-musical-note-computer-icons-musical-note-text-logo-musician.png";
                        }}
                      />
                    </div>
                    <span className="item-name">{item.track.name}</span>
                    <span className="item-name-sec">
                      {artistList.join(", ")}
                    </span>
                    <span className="item-name-sec">|</span>
                    <span className="item-name-sec">
                      {item.track.album.name}
                    </span>
                    <span className="align-item-right item-name-sec">
                      {convertTime(item.track.duration_ms)}
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

export default Recent;
