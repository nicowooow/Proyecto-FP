import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./../assets/css/header.css";

function SearchComponent() {
  const [query, setQuery] = useState("");
  const [forumResults, setForumResults] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim() !== "") {
        // Fetch forums
        fetch(`/yourtree/api/forums/search?q=${encodeURIComponent(query)}`)
          .then((res) => res.json())
          .then((data) => setForumResults(data))
          .catch((err) => console.error(err));

        // Fetch users
        fetch(`/yourtree/api/users/search?q=${encodeURIComponent(query)}`)
          .then((res) => res.json())
          .then((data) => setUserResults(data))
          .catch((err) => console.error(err));
          
        setIsOpen(true);
      } else {
        setForumResults([]);
        setUserResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Si envían form, o presionan enter.
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!query.trim()) {
        // En caso de enviar vacío o nada, o algo pero presiona Enter -> decide a donde ir.
        // Pero como son dos búsquedas distintas (usuarios y foros), no hay un solo lugar, 
        // según el requerimiento, la búsqueda no tiene nada, mandarlo a su lugar principal.
        // Dejaremos el click específico a cada uno o lo podemos mandar al feed principal.
      }
    }
  }

  return (
    <div className="search_container" ref={wrapperRef}>
      <div className="search_input_wrapper">
        <svg className="search_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="search"
          placeholder="Search forums and users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.trim() !== "") setIsOpen(true) }}
          onKeyDown={handleKeyDown}
        />
      </div>

      {isOpen && (
        <div className="search_dropdown">
          <div className="search_section">
            <h4 className="search_section_title">Forums</h4>
            {forumResults.length > 0 ? (
              forumResults.map((forum) => (
                <div key={forum.id} className="search_item" onClick={() => { setIsOpen(false); navigate(`/Forums/${forum.id}`); setQuery(""); }}>
                  <span className="search_item_title">{forum.title}</span>
                  <span className="search_item_desc">{forum.description?.substring(0, 40) || ''}...</span>
                </div>
              ))
            ) : (
              <div className="search_item no_results" onClick={() => { setIsOpen(false); navigate('/Forums'); setQuery(""); }}>
                No results found. Go to Forums
              </div>
            )}
          </div>

          <div className="search_section">
            <h4 className="search_section_title">YourTree Users</h4>
            {userResults.length > 0 ? (
              userResults.map((usr) => (
                <div key={usr.username} className="search_item" onClick={() => { setIsOpen(false); navigate(`/YourTree/${usr.username}`); setQuery(""); }}>
                  <div className="search_user_info">
                    <span className="search_item_title">@{usr.username}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="search_item no_results" onClick={() => { setIsOpen(false); navigate('/Recent_Pages'); setQuery(""); }}>
                No results found. Go to Recent Pages
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(SearchComponent);
