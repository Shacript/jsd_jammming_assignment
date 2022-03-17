const SpotifyClientId = "640a44ed21384b75ba804bdeae32e6a1";
const RedirectURI = "http://localhost:3000/";

let userAccessToken;

const Spotify = {
  getAccessToken() {
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      userAccessToken = accessTokenMatch[1];
      window.setTimeout(
        () => (userAccessToken = null),
        Number(expiresInMatch[1]) * 1000
      );
      window.history.pushState("Access Token", null, "/");
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${SpotifyClientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${RedirectURI}`;
    }
  },
  async search(term) {
    const response = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${term}`,
      {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      }
    );
    const responseJson = await response.json();

    return responseJson.tracks.items.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri,
    }));
  },
  async savePlaylist(playlistName, trackURIs) {
    if (!playlistName || !trackURIs || !trackURIs.length) return;
    const headers = {
      Authorization: `Bearer ${userAccessToken}`,
    };

    const responseMe = await fetch("https://api.spotify.com/v1/me", {
      headers,
    });
    const responseMeJson = await responseMe.json();
    const userId = responseMeJson.id;

    const responsePlaylist = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        headers,
        method: "POST",
        body: JSON.stringify({ name: playlistName }),
      }
    );
    const responsePlaylistJson = await responsePlaylist.json();
    const playlistId = responsePlaylistJson.id;

    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: "POST",
      headers,
      body: JSON.stringify({ uris: trackURIs }),
    });
  },
};

export default Spotify;
