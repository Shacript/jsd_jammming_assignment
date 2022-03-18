import "./Playlist.css";

import TrackList from "../TrackList/TrackList";

const Playlist = ({
  playlistName,
  playlistTracks,
  onRemove,
  onNameChange,
  onSave,
  isSaving,
}) => {
  const handleNameChange = (e) => {
    onNameChange(e.target.value);
  };

  return (
    <div className="Playlist">
      <input
        value={playlistName}
        onChange={handleNameChange}
        disabled={isSaving}
      />
      {!isSaving ? (
        <TrackList
          lists={playlistTracks}
          onRemove={onRemove}
          isRemoval={true}
        />
      ) : (
        <h1>Saving . . .</h1>
      )}
      <button className="Playlist-save" onClick={onSave} disabled={isSaving}>
        SAVE TO SPOTIFY
      </button>
    </div>
  );
};

export default Playlist;
