const SpotifyClientId = "640a44ed21384b75ba804bdeae32e6a1"; // Change this !
// const RedirectURI = "https://jsd-sha-jammming.netlify.app/"; // Change this !
const RedirectURI = "http://localhost:3000/"

let userAccessToken = localStorage.getItem("userAccessToken");
let userExpires = localStorage.getItem("userExpires") || 0;

const Spotify = {
  getAccessToken() {

    if(userAccessToken){
      const date = new Date()
      
      if(date.getTime() > Number(userExpires)){
        userAccessToken = null
        localStorage.setItem("userAccessToken", null);
      }else{
        return;
      }
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      
      const date = new Date()

      userAccessToken = localStorage.setItem("userAccessToken", accessTokenMatch[1]);
      localStorage.setItem("userExpires", (date.getTime() + Number(expiresInMatch[1]) * 1000))

      window.setTimeout(
        () => {
          userAccessToken = null
          localStorage.setItem("userAccessToken", null);
          Spotify.getAccessToken();
        },
        Number(expiresInMatch[1]) * 1000
      );
      window.history.pushState("Access Token", null, "/");
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${SpotifyClientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${RedirectURI}`;
    }
  },
  async search(term) {
    console.log(userAccessToken)
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
  async getMyPlaylist(){
    const headers = {
      Authorization: `Bearer ${userAccessToken}`,
    };

    const responseMe = await fetch("https://api.spotify.com/v1/me", {
      headers,
    });
    const responseMeJson = await responseMe.json();
    const userId = responseMeJson.id;

    const responsePlaylists = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        headers
      }
    );
    const responsePlaylistsJson = await responsePlaylists.json();

    console.log(responsePlaylistsJson)
  }
};

export default Spotify;
