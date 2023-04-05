export const getHashParams = () => {
  return window.location.hash
    .substring(1)
    .split('&')
    .reduce((initial, item) => {
        let parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);

        return initial;
    }, {})
}

export const catchErrors = fn =>
  function(...args) {
    return fn(...args).catch(err => {
      console.error(err);
    });
  };

export const logout = () => {
  localStorage.removeItem('spotify_token_timestamp');
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_token_expires_in');
  window.location.reload();
};

export const convertTime = millis => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const convertDate = release_date => {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const date = new Date(release_date)
  return date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear()
}

export const totalAlbumTime = tracks => {
  const time = tracks.reduce((total, obj) => {
    return total + obj.duration_ms;
  }, 0)
  return convertTime(time)
}