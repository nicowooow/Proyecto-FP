import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/recent_pages.css';
import LogoUrl from '../assets/images/profile_default.svg';
import { Links_base } from '../components/linksBase.jsx';
import AdsComponent from '../components/ads.jsx';
import SEO from './../components/seo.jsx';

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
        // console.log(data);

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

  const renderProfilesWithAds = () => {
    const items = [];
    profiles.forEach((profile, index) => {
      // console.log(profile);

      items.push(
        <article
          key={profile.profile_id}
          onClick={() => handleCardClick(profile.username)}
          className="profile_card_mini"
          style={{ position: 'relative', cursor: 'pointer' }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}></div>
          <Links_base
            optionCheck={profile.theme === 'dark' ? 1 : 0}
            usernameUser={profile.username}
            descriptionInput={profile.bio || "Hello, I'm new here"}
            imageUrl={profile.imageUrl ? profile.imageUrl : LogoUrl}
          />
        </article>
      );

      if ((index + 1) % 6 === 0 && index !== profiles.length - 1) {
        items.push(
          <AdsComponent
            key={`recent-ad-${index}`}
            inline
            styleType="profile"
            className="col-span-full w-full"
          />
        );
      }
    });
    return items;
  };

  if (loading) {
    return <main className="recent_pages_container"><p className="loading_text">Loading recent pages...</p></main>;
  }

  if (error) {
    return <main className="recent_pages_container"><p className="error_text">Error: {error}</p></main>;
  }

  return (
    <main className="recent_pages_container">
      <SEO
        title="Recent Pages - YourTree"
        description="Discover recently created pages on YourTree. Explore other users' profiles."
      />
      <h2 className="recent_pages_title">Recent Pages</h2>
      {profiles.length === 0 ? (
        <>
          <p className="empty_text">No recent pages found.</p>
          <AdsComponent centered styleType="profile" />
        </>
      ) : (
        <>
          <div className="profiles_grid">
            {renderProfilesWithAds()}
          </div>
          {profiles.length > 0 && profiles.length < 5 && (
            <AdsComponent centered styleType="profile" />
          )}
        </>
      )}
    </main>
  );
}
