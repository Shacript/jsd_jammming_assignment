import "./Playlist.css";

import TrackList from "../TrackList/TrackList";

const Playlist = ({
  playlistName,
  playlistTracks,
  onRemove,
  onNameChange,
  onSave,
}) => {
  const handleNameChange = (e) => {
    onNameChange(e.target.value);
  };

  return (
    <div className="Playlist">
      <input value={playlistName} onChange={handleNameChange} />
      <TrackList lists={playlistTracks} onRemove={onRemove} isRemoval={true} />
      <button className="Playlist-save" onClick={onSave}>
        SAVE TO SPOTIFY
      </button>
    </div>
  );
};

export default Playlist;
