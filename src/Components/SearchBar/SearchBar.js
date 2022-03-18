import { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const search = () => {
    onSearch(searchTerm);
    setSearchTerm("");
  };

  const handleTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTermEnter = (e) => {
    if(e.key === 'Enter'){
      search()
    }
  }

  return (
    <div className="SearchBar">
      <input
        placeholder="Enter A Song, Album, or Artist"
        value={searchTerm}
        onChange={handleTermChange}
        onKeyUp={handleTermEnter}
      />
      <button className="SearchButton" onClick={search}>
        SEARCH
      </button>
    </div>
  );
};

export default SearchBar;
