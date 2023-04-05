import { createContext, useContext, useEffect, useState } from "react";
import { getHashParams } from "./index";
import { gql, useMutation } from "@apollo/client";

export const spotifyAuth = "https://accounts.spotify.com/authorize";
const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URL;
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const BASE_API_URL = "https://api.spotify.com/v1";

const scopes = [
  "user-read-recently-played",
  "user-top-read",
  "playlist-modify-public",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-follow-modify",
  "user-follow-read",
  "user-read-email",
  "user-library-read",
];

export const loginUrl = `${spotifyAuth}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}&response_type=token&show_dialog=true`;

const ADD_USER = gql`
  mutation AddUser($name: String!, $id: String!, $token: String!) {
    addUser(name: $name, id: $id, token: $token) {
      name
      id
    }
  }
`;

const SpotifyContext = createContext();

export const useSpotify = () => {
  return useContext(SpotifyContext);
};

export const SpotifyProvider = ({ children }) => {
  const spotify = useProvideSpotify();

  return (
    <SpotifyContext.Provider value={spotify}>
      {children}
    </SpotifyContext.Provider>
  );
};

const useProvideSpotify = () => {
  const [token, setToken] = useState(
    localStorage.getItem("spotify_access_token")
  );
  const [tokenExp, setTokenExp] = useState(
    localStorage.getItem("spotify_token_expires_in")
  );
  const [user, setUser] = useState(null);
  const [userAdded, setUserAdded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [addUser, { data, loading, error }] = useMutation(ADD_USER);

  useEffect(() => {
    if (token && tokenExp) {
      if (!user) {
        loadCurrentUser();
      } else {
        // setIsLoading(false);
      }
    }
  }, [token, tokenExp, user]);

  useEffect(() => {
    const hash = getHashParams();
    window.history.pushState("", document.title, window.location.pathname);

    const accessToken = hash.access_token;
    const expires_in = hash.expires_in;

    if (accessToken) {
      setToken(accessToken);
      setTokenExp(expires_in);
      setLoggedIn(true);
      window.localStorage.setItem("spotify_access_token", accessToken);
      window.localStorage.setItem("spotify_token_timestamp", Date.now());
      window.localStorage.setItem("spotify_token_expires_in", expires_in);
    }
  }, []);

  useEffect(() => {
    hasTokenExpired();
  }, [token]);

  const loadCurrentUser = async () => {
    try {
      const user = await fetchCurrentUserInfo();
      if (!userAdded) {
        addUser({
          variables: {
            name: user.display_name,
            id: user.id,
            token,
          },
        });
      }

      // fetch('http://localhost:8000/api/post', {
      //   headers: {"Content-Type": "application/json"},
      //   method: 'POST',
      //   body: JSON.stringify({
      //     name: user.display_name,
      //     id: user.id
      //   })
      // })
      setUserAdded(true);
      setUser(user);
    } catch (err) {
      console.error(err);

      // history.push("/");
    }
  };

  const hasLoggedIn = () => {
    return !!token && !!user && !hasTokenExpired();
  };

  const hasTokenExpired = () => {
    try {
      if (!token || !tokenExp || isNaN(tokenExp)) {
        setLoggedIn(false);
        return true;
      }
      const tokenExpired =
        Date.now() - window.localStorage.getItem("spotify_token_timestamp") >
        tokenExp * 1000;
      setLoggedIn(!tokenExpired);
      return tokenExpired;
    } catch (err) {
      console.error(err);

      return true;
    }
  };

  const invalidateToken = () => {
    setUser(null);
    setToken(null);
    setTokenExp(null);
  };

  const callEndpoint = async ({ path, method = "GET", body = {} }) => {
    if (hasTokenExpired()) {
      invalidateToken();

      throw new Error("Token has expired.");
    }

    return method === "POST"
      ? await (
          await fetch(`${BASE_API_URL}${path}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            method,
            body,
          })
        ).json()
      : await (
          await fetch(`${BASE_API_URL}${path}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            method,
          })
        ).json();
  };

  const fetchCurrentUserInfo = async () => {
    return await callEndpoint({ path: "/me" });
  };

  const fetchUserTopItems = async (
    type,
    time_range = "long_term",
    limit = "20"
  ) => {
    return await callEndpoint({
      path: `/me/top/${type}?time_range=${time_range}&limit=${limit}`,
    });
  };

  const fetchUserAlbums = async () => {
    return callEndpoint({ path: `/users/albums` });
  };

  const fetchFollowedArtists = async () => {
    return await callEndpoint({ path: "/me/following?type=artist" });
  };

  const followArtist = async (id, method) => {
    return await callEndpoint({
      path: `/me/following?type=artist&ids=${id}`,
      method,
    });
  };

  const fetchCurrentUserPlaylists = async () => {
    return callEndpoint({ path: `/me/playlists` });
  };

  const fetchPlaylist = async (id) => {
    return callEndpoint({ path: `/playlists/${id}` });
  };

  const fetchSavedTracks = async () => {
    return callEndpoint({ path: `/me/tracks?limit=50` });
  };

  const fetchTrack = async (id) => {
    return callEndpoint({ path: `/tracks/${id}` });
  };

  const fetchSavedAlbums = async () => {
    return callEndpoint({ path: `/me/albums` });
  };

  const fetchUserProfile = async (id) => {
    return callEndpoint({ path: `/users/${id}` });
  };

  const fetchRecentlyPlayed = async () => {
    return callEndpoint({ path: `/me/player/recently-played?limit=50` });
  };

  const checkFollowed = async (type, id) => {
    return await callEndpoint({
      path: `/me/following/contains?type=${type}&ids=${id}`,
    });
  };

  const fetchArtistData = async (id) => {
    return callEndpoint({ path: `/artists/${id}` });
  };

  const fetchArtistAlbums = async (id) => {
    return callEndpoint({ path: `/artists/${id}/albums?include_groups=album` });
  };

  const fetchArtistTopTracks = async (id) => {
    return callEndpoint({
      path: `/artists/${id}/top-tracks?market=US&limit=20`,
    });
  };

  const fetchRelatedArtists = async (id) => {
    return callEndpoint({ path: `/artists/${id}/related-artists` });
  };

  const fetchAudioFeatures = async (id) => {
    return callEndpoint({ path: `/audio-features/${id}` });
  };

  const fetchAudioAnalysis = async (id) => {
    return callEndpoint({ path: `/audio-analysis/${id}` });
  };

  const fetchAlbum = async (id) => {
    return callEndpoint({ path: `/albums/${id}` });
  };

  const getRecommendations = async (
    seed_artists,
    seed_genres,
    seed_tracks,
    limit = 30
  ) => {
    return callEndpoint({
      path: `/recommendations?seed_tracks=${seed_tracks}&seed_artists=06HL4z0CvFAxyc27GXpf02&limit=${limit}`,
    });
  };

  const createPlaylist = async (name, description) => {
    return callEndpoint({
      path: `/users/${user.id}/playlists`,
      method: "POST",
      body: JSON.stringify({
        name,
        description,
      }),
    });
  };

  const addPlaylistItems = async (id, body) => {
    return callEndpoint({
      path: `/playlists/${id}/tracks `,
      method: "POST",
      body: JSON.stringify(body),
    });
  };

  const search = async (query) => {
    return callEndpoint({
      path: `/search?q=${query}&type=album,track,artist,playlist&limit=10`,
    });
  };

  const fetchGenres = async () => {
    return callEndpoint({ path: `/recommendations/available-genre-seeds` });
  };

  const fetchNewReleases = async () => {
    return callEndpoint({ path: `/browse/new-releases?country=US` });
  };

  const fetchFeaturedPlaylists = async () => {
    return callEndpoint({ path: `/browse/featured-playlists?country=US` });
  };

  return {
    token,
    user,
    loggedIn,
    hasLoggedIn,
    fetchUserTopItems,
    fetchCurrentUserInfo,
    fetchUserProfile,
    fetchUserAlbums,
    fetchSavedTracks,
    fetchTrack,
    fetchSavedAlbums,
    fetchFollowedArtists,
    fetchCurrentUserPlaylists,
    fetchPlaylist,
    checkFollowed,
    fetchArtistData,
    fetchArtistAlbums,
    fetchArtistTopTracks,
    fetchRelatedArtists,
    fetchAudioFeatures,
    fetchAudioAnalysis,
    followArtist,
    fetchAlbum,
    getRecommendations,
    createPlaylist,
    addPlaylistItems,
    fetchRecentlyPlayed,
    search,
    fetchGenres,
    fetchNewReleases,
    fetchFeaturedPlaylists,
  };
};
