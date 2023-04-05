import axios from 'axios';

export const spotifyAuth = 'https://accounts.spotify.com/authorize';
const redirectUri = 'http://localhost:3000/';
// const redirectUri = 'https://magnificent-kangaroo-a46046.netlify.app'
const clientId = '3c27c84665ed4d8b9e40da9d61931b2a';

const scopes = [
    'user-read-recently-played',
    'user-read-playback-state',
    'user-top-read',
    'user-modify-playback-state',
    'playlist-modify-public',
    'user-follow-modify',
    'user-read-currently-playing',
    'user-follow-read',
    'user-read-email',
    'user-library-read'
];

export const loginUrl = `${spotifyAuth}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;

export const getAccessTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split('&')
    .reduce((initial, item) => {
        let parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);

        return initial;
    }, {})
}

const headers = {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json',
};

export const getUser = () => axios.get('https://api.spotify.com/v1/me', { headers });