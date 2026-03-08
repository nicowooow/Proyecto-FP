import { useEffect, useState } from "react";
import { useAuth } from "./../components/auth.jsx";
import { getUser, getToken } from "./../components/token.jsx";
import profileDefaultUrl from "../assets/images/profile_default.svg";
import "../assets/css/Profile.css";

function Profile() {
    let [user, setUser] = useState(getUser());
    let [profileData, setProfileData] = useState(null);
    let [userData, setUserData] = useState(null);
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.username) {
            const token = getToken();

            Promise.all([
                fetch(`/yourtree/api/profile/${user.username}`).then(res => res.json()),
                fetch(`/yourtree/api/user/${user.username}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(res => res.json())
            ])
                .then(([profileRes, userRes]) => {
                    setProfileData(profileRes);
                    setUserData(userRes);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="loader"></div>
                <p>Cargando información...</p>
            </div>
        );
    }

    if (!userData || !profileData) {
        return (
            <div className="profile-page-container">
                <div className="profile-card">
                    <h2>Usuario no encontrado</h2>
                    <p>No se pudo obtener la información de este perfil.</p>
                </div>
            </div>
        );
    }

    console.log(userData, profileData);


    const { firstName, lastName, bio, imageUrl } = profileData;
    const { username, email, status } = userData;

    // Formatear nombre completo
    const fullName = [firstName, lastName].filter(Boolean).join(" ");

    // Lógica limpiar imagen: usar imageUrl válida, sino usar el archivo default
    let displayImageUrl = profileDefaultUrl;
    if (imageUrl && !imageUrl.includes("profile_default.svg") && !imageUrl.includes("profile?default.svg")) {
        displayImageUrl = imageUrl;
    }

    return (
        <main>
            <div className="profile-page-container">
                <div className="profile-layout">
                    {/* Sidebar similar to GitHub */}
                    <aside className="profile-sidebar">
                        <div className="profile-avatar-container">
                            <img
                                src={displayImageUrl}
                                alt={username}
                                className="profile-avatar"
                            />
                            <div className={`status-badge ${status}`} title={`Status: ${status}`}></div>
                        </div>

                        <div className="profile-names">
                            {fullName && <h1 className="profile-name">{fullName}</h1>}
                            <h2 className="profile-username">{username}</h2>
                        </div>

                        <div className="profile-actions">
                            <button className="btn-edit-profile">Edit profile</button>
                        </div>

                        {bio && (
                            <div className="profile-bio">
                                <p>{bio}</p>
                            </div>
                        )}

                        <div className="profile-details">
                            <div className="profile-detail-item">
                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" fill="#656d76">
                                    <path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-8.5C0 2.784.784 2 1.75 2ZM1.5 12.25c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V5.809L8.38 9.397a.75.75 0 0 1-.76 0L1.5 5.809v6.441Zm13-8.181v-.319a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v.319l6.5 3.626Z"></path>
                                </svg>
                                <span>{email}</span>
                            </div>
                            {/* More details could go here, e.g., company, location */}
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="profile-main">
                        <div className="profile-form-container">
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" value={firstName || ""} readOnly className="form-input" />
                            </div>

                            <div className="form-group">
                                <label>Last name</label>
                                <input type="text" value={lastName || ""} readOnly className="form-input" />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" value={email || ""} readOnly className="form-input" />
                            </div>

                            <div className="form-group">
                                <label>Bio</label>
                                <textarea
                                    value={bio || ""}
                                    readOnly
                                    className="form-textarea"
                                    placeholder="There is no bio"
                                />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </main>

    );
}
export default Profile;