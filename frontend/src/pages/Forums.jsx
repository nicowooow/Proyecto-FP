import React, { useState, useEffect, useRef, useId, useMemo } from 'react';
import { useAuth } from '../components/auth.jsx';
import './../assets/css/forums.css';

export default function Forums() {
    const [forums, setForums] = useState([]);
    const { isLogged, user } = useAuth();

    const fetchForums = () => {
        fetch('/yourtree/api/forums')
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) setForums(data);
            })
            .catch(console.error);
    };

    useEffect(() => {
        fetchForums();
    }, []);

    return (
        <main id="forums_page">
            <header className="forums_header">
                <div className="forums_header_content">
                    <h1>Community Forums</h1>
                    <p>Join the conversation with other creators. Discuss ideas and share your thoughts.</p>
                </div>
                {isLogged && <FormCreateForum username={user?.username} onCreated={fetchForums} />}
            </header>
            <section className="forums_list">
                {forums.length > 0 ? forums.map(forum => (
                    <article key={forum.id} className="forum_card">
                        <h2>{forum.title}</h2>
                        <p className="forum_desc">{forum.description}</p>
                        <div className="forum_meta">
                            <span className="forum_status">{forum.status}</span>
                            <span className="forum_likes">Likes: {forum.likes}</span>
                        </div>
                    </article>
                )) : (
                    <p className="no_forums">No forums available yet. Be the first to create one!</p>
                )}
            </section>
        </main>
    );
}

const FormCreateForum = React.memo(function FormCreateForum({ username, onCreated }) {
    let dialogRef = useRef(null);
    const baseId = useId();

    function openDialog() {
        dialogRef.current?.showModal();
    }
    function closeDialog() {
        dialogRef.current?.close();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            let profileRes = await fetch(`/yourtree/api/profile/${username}`);
            if (!profileRes.ok) return;
            let profile = await profileRes.json();
            if (!profile.id) return;

            const res = await fetch(`/yourtree/api/forum/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    profileId: profile.id,
                    title: formData.get('title'),
                    description: formData.get('description'),
                    isSensitive: false,
                    isPublic: true,
                    status: 'active'
                })
            });

            if (res.ok) {
                closeDialog();
                if (onCreated) onCreated();
            } else {
                console.error("Failed to create forum");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const plusIcon = useMemo(() => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
            <path d="M9 12h6"></path><path d="M12 9v6"></path>
        </svg>
    ), []);

    return (
        <>
            <button type="button" className="btn_create_forum" onClick={openDialog}>
                {plusIcon} Create Forum
            </button>
            <dialog className="dialog_form_create" ref={dialogRef}>
                <h2>Create a new Forum</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form_group">
                        <label htmlFor={`${baseId}-title`}>Title</label>
                        <input type="text" name="title" id={`${baseId}-title`} required />
                    </div>
                    <div className="form_group">
                        <label htmlFor={`${baseId}-desc`}>Description</label>
                        <textarea name="description" id={`${baseId}-desc`} rows="4" required></textarea>
                    </div>
                    <div className="form_actions">
                        <button className="btn_cancel" type="button" onClick={closeDialog}>Cancel</button>
                        <button className="btn_submit" type="submit">Create</button>
                    </div>
                </form>
            </dialog>
        </>
    );
});