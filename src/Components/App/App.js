import { useState, useEffect } from "react";
import "./App.css";

import Spotify from "../../util/Spotify";

import SearchBar from "../SearchBar/SearchBar";

import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";

function App() {
  const [searchResults, setSearchResults] = useState([]);

  const [playlistName, setPlaylistName] = useState(localStorage.getItem("playlistName") || "New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState(JSON.parse(localStorage.getItem("playlistTracks")) || []);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    Spotify.getAccessToken()
    Spotify.getMyPlaylist()
  }, []);

  const addTrack = (track) => {
    if (playlistTracks.find((prevTrack) => prevTrack.id === track.id)) return;
    setPlaylistTracks([...playlistTracks, track]);
    localStorage.setItem("playlistTracks", JSON.stringify(playlistTracks))
  };

  const removeTrack = (track) => {
    setPlaylistTracks(
      playlistTracks.filter((prevTrack) => prevTrack.id !== track.id)
    );
    localStorage.setItem("playlistTracks", JSON.stringify(playlistTracks))
  };

  const updatePlaylistName = (name) => {
    setPlaylistName(name);
    localStorage.setItem("playlistName", name)
  };

  const savePlaylist = () => {
    setIsSaving(true)
    const trackURIs = playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(playlistName, trackURIs).then(() => {
      setPlaylistTracks([]);
      setPlaylistName("New Playlist");
      localStorage.setItem("playlistTracks", JSON.stringify([]));
      localStorage.setItem("playlistName", "New Playlist");
      setIsSaving(false)
    });
  };

  const search = (searchTerm) => {
    Spotify.search(searchTerm).then((tracks) => {
      setSearchResults(tracks);
    });
  };

  const searchFiltered = () => {
    return searchResults.filter((searchTrack) => !playlistTracks.find(playlistTrack => searchTrack.id === playlistTrack.id))
  }

  return (
    <div>
      <h1>
        Ja<span className="highlight">mmm</span>ing
      </h1>
      <div className="App">
        <SearchBar onSearch={search} />
        <div className="App-playlist">
          <SearchResults searchResults={searchFiltered()} onAdd={addTrack} />
          <Playlist
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            onNameChange={updatePlaylistName}
            onRemove={removeTrack}
            onSave={savePlaylist}
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
