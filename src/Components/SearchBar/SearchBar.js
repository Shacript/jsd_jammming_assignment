import { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState(localStorage.getItem('searchTerm') || '');

  const search = () => {
    onSearch(searchTerm);
  };

  const handleTermChange = (e) => {
    setSearchTerm(e.target.value);
    localStorage.setItem('searchTerm', e.target.value);
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
