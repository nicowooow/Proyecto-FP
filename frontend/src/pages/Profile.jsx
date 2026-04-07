import { useEffect, useState } from "react";
import { useAuth } from "./../components/auth.jsx";
import { getUser, getToken } from "./../components/token.jsx";
import { FormUploadImage } from "../components/forms.jsx";
import profileDefaultUrl from "../assets/images/profile_default.svg";
import "../assets/css/forms.css";
import "../assets/css/Profile.css";

function Profile() {
    let [user, setUser] = useState(getUser());
    let [profileData, setProfileData] = useState(null);
    let [userData, setUserData] = useState(null);
    let [loading, setLoading] = useState(true);

    // Form states
    let [firstName, setFirstName] = useState("");
    let [lastName, setLastName] = useState("");
    let [birthDate, setBirthDate] = useState("");
    let [recoveryEmail, setRecoveryEmail] = useState("");
    let [bio, setBio] = useState("");
    let [theme, setTheme] = useState("light");

    let [imageFile, setImageFile] = useState(null);
    let [imagePreview, setImagePreview] = useState(null);
    let [deleteImage, setDeleteImage] = useState(false);

    // Evitar que el navegador use una version vieja de la imagen (cache)
    const [cacheBuster, setCacheBuster] = useState(Date.now());

    useEffect(() => {
        if (user && user.username) {
            const token = getToken();

            Promise.all([
                fetch(`/yourtree/api/profile/private/${user.username}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(res => res.json()),
                fetch(`/yourtree/api/user/${user.username}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(res => res.json())
            ])
                .then(([profileRes, userRes]) => {
                    setProfileData(profileRes);
                    setUserData(userRes);

                    // Initialize form
                    setFirstName(profileRes.firstName || "");
                    setLastName(profileRes.lastName || "");
                    if (profileRes.birthDate) {
                        const date = new Date(profileRes.birthDate);
                        setBirthDate(date.toISOString().split('T')[0]);
                    }
                    setRecoveryEmail(profileRes.recoveryEmail || "");
                    setBio(profileRes.bio || "");
                    setTheme(profileRes.theme || "light");

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

    const handleFileSelect = (file) => {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setDeleteImage(false);
    };

    const handleDeleteImage = () => {
        setImageFile(null);
        setImagePreview(profileDefaultUrl);
        setDeleteImage(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const token = getToken();

        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("birthDate", birthDate);
        formData.append("recoveryEmail", recoveryEmail);
        formData.append("description", bio);
        formData.append("theme", theme);

        if (imageFile) {
            formData.append("profile_photo", imageFile);
        } else if (deleteImage) {
            formData.append("delete_image", "true");
        }

        try {
            const res = await fetch(`/yourtree/api/profile/${user.username}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                alert("Profile updated successfully!");

                // Actualizar local storage y aplicar colores de inmediato
                localStorage.setItem('theme', theme);
                document.documentElement.setAttribute('data-theme', theme);
                window.dispatchEvent(new Event('storage'));

                // Refrescar el valor para obligar a descargar la nueva foto
                const freshTimestamp = Date.now();
                setCacheBuster(freshTimestamp);

                // Opcionalmente actualizar estado interno
                if (data.imageUrl !== undefined) {
                    setProfileData(prev => ({ ...prev, imageUrl: data.imageUrl }));
                    if (data.imageUrl !== "") {
                        setImagePreview(""); // Reiniciamos preview local para forzar carga externa
                    }
                }
            } else {
                alert("Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error updating profile.");
        }
    };

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

    const { username, email, status } = userData;

    // Formatear nombre completo
    const fullName = [firstName, lastName].filter(Boolean).join(" ");

    // Lógica limpiar imagen y bust cache
    let displayImageUrl = profileDefaultUrl;
    if (imagePreview) {
        displayImageUrl = imagePreview;
    } else if (profileData.imageUrl && !profileData.imageUrl.includes("profile_default.svg") && !profileData.imageUrl.includes("profile?default.svg")) {
        // Agregamos cacheBuster al final para impedir cache del navegador
        displayImageUrl = `${profileData.imageUrl}?t=${cacheBuster}`;
    }

    return (
        <main>
            <div className="profile-page-container">
                <div className="profile-layout">
                    {/* Sidebar */}
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
                            <h2 className="profile-username">@{username}</h2>
                        </div>

                        {bio && (
                            <div className="profile-bio">
                                <p>{bio}</p>
                            </div>
                        )}

                        <div className="profile-details">
                            <div className="profile-detail-item">
                                <span>✉️ {email}</span>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="profile-main">
                        <div className="profile-form-container">
                            <h2>Edit Profile</h2>
                            <form onSubmit={handleSave}>
                                <div style={{width: 'max-content'}}>
                                    <FormUploadImage onFileSelect={handleFileSelect} onDeleteImage={handleDeleteImage} />
                                </div>

                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="form-input" required />
                                </div>

                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="form-input" />
                                </div>

                                <div className="form-group">
                                    <label>Birth Date</label>
                                    <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="form-input" />
                                </div>

                                <div className="form-group">
                                    <label>Recovery Email</label>
                                    <input type="email" value={recoveryEmail} onChange={e => setRecoveryEmail(e.target.value)} className="form-input" />
                                </div>

                                <div className="form-group">
                                    <label>Bio</label>
                                    <textarea
                                        value={bio}
                                        onChange={e => setBio(e.target.value)}
                                        className="form-textarea"
                                        placeholder="Tell us a little bit about yourself"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Theme</label>
                                    <select value={theme} onChange={e => setTheme(e.target.value)} className="form-input">
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                    </select>
                                </div>

                                <button type="submit" className="btn-edit-profile">Save Changes</button>
                            </form>
                        </div>
                    </main>
                </div>
            </div>

        </main>
    );
}

export default Profile;
