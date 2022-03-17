import "./SearchResults.css";

import TrackList from "../TrackList/TrackList";

const SearchResults = ({ searchResults, onAdd }) => {
  return (
    <div className="SearchResults">
      <h2>Results</h2>
      <TrackList lists={searchResults} onAdd={onAdd} isRemoval={false} />
    </div>
  );
};

export default SearchResults;
