import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/recent_pages.css';
import LogoUrl from '../assets/YourTree.svg';
import { Links_base } from '../components/linksBase.jsx';

export default function Recent_Pages() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentProfiles = async () => {
      try {
        const res = await fetch('/yourtree/api/profiles/recent');
        if (!res.ok) {
          throw new Error('Failed to fetch recent profiles');
        }
        const data = await res.json();
        setProfiles(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProfiles();
  }, []);

  const handleCardClick = (username) => {
    navigate(`/YourTree/${username}`);
  };

  if (loading) {
    return <main className="recent_pages_container"><p className="loading_text">Loading recent pages...</p></main>;
  }

  if (error) {
    return <main className="recent_pages_container"><p className="error_text">Error: {error}</p></main>;
  }

  return (
    <main className="recent_pages_container">
      <h2 className="recent_pages_title">Recent Pages</h2>
      {profiles.length === 0 ? (
        <p className="empty_text">No recent pages found.</p>
      ) : (
        <div className="profiles_grid">
          {profiles.map((profile) => (
            <article
              key={profile.profile_id}
              onClick={() => handleCardClick(profile.username)}
              className="profile_card_mini"
              style={{ position: 'relative', cursor: 'pointer' }}
            >
              {/* Invisible overlay to catch clicks and prevent clicking the inner links */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}></div>
              <Links_base
                optionCheck={profile.theme === 'dark' ? 1 : 0}
                usernameUser={profile.username}
                descriptionInput={profile.bio || "Hello, I'm new here"}
                imageUrl={profile.image_url ? `http://localhost:3000${profile.image_url}` : LogoUrl}
              />
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
