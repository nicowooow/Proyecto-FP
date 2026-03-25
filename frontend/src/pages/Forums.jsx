import React, { useState, useEffect, useRef, useId, useMemo, useCallback } from 'react';
import { useAuth } from '../components/auth.jsx';
import cookies from "js-cookie";
import { useParams, useNavigate } from 'react-router-dom';
import './../assets/css/forums.css';
import SEO from './../components/seo.jsx';

const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
};

export default function Forums() {
    const [forums, setForums] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // For specific forum post popup
    const { forumId } = useParams();
    const navigate = useNavigate();
    const [selectedForum, setSelectedForum] = useState(null);

    const { isLogged } = useAuth();
    const cookieUser = cookies.get("user") ? JSON.parse(cookies.get("user")) : null;
    const currentUsername = cookieUser ? cookieUser.username : "";
    const observer = useRef();

    const limit = 10;

    const fetchForums = useCallback(async (currentOffset, overwrite = false) => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch(`/yourtree/api/forums?limit=${limit}&offset=${currentOffset}`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            if (Array.isArray(data)) {
                if (data.length < limit) setHasMore(false);
                else setHasMore(true);

                if (overwrite) setForums(data);
                else setForums(prev => [...prev, ...data]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    // Initial load
    useEffect(() => {
        fetchForums(0, true);
    }, []);

    // Last element ref for infinite scroll
    const lastForumElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setOffset(prev => {
                    const nextOffset = prev + limit;
                    fetchForums(nextOffset, false);
                    return nextOffset;
                });
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, fetchForums]);

    // Handle fetching specific forum logic if URL has forumId
    useEffect(() => {
        if (forumId) {
            // Check if already fetched to prevent flashing
            if (selectedForum && selectedForum.id === parseInt(forumId)) {
                return;
            }

            const f = forums.find(f => f.id === parseInt(forumId));
            if (f) {
                setSelectedForum(f);
            } else {
                fetch(`/yourtree/api/forums/${forumId}`)
                    .then(async res => {
                        if (!res.ok) throw new Error("Failed to fetch specific forum");
                        const text = await res.text();
                        return text ? JSON.parse(text) : {};
                    })
                    .then(data => {
                        if (data && !data.error && Object.keys(data).length > 0) {
                            setSelectedForum(data);
                        } else {
                            navigate('/Forums');
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        navigate('/Forums');
                    });
            }
        } else {
            setSelectedForum(null);
        }
    }, [forumId, forums, selectedForum, navigate]);

    const handleCardClick = (id) => {
        navigate(`/Forums/${id}`);
    };
    const handleClosePopup = () => {
        navigate(`/Forums`);
    };

    return (
        <main id="forums_page">
<SEO 
  title="YourTree Forums - Creator Community"
  description="Join conversations in YourTree forums. Discuss ideas, share links, and connect with fellow creators."
/>
            <header className="forums_header">
                <div className="forums_header_content">
                    <h1>Community Forums</h1>
                    <p>Join the conversation with other creators. Discuss ideas and share your thoughts.</p>
                </div>
                <FormCreateForum isLogged={isLogged} username={currentUsername} onCreated={() => { setOffset(0); fetchForums(0, true); }} />
            </header>
            <section className="forums_list">
                {forums.length > 0 ? forums.map((forum, index) => {
                    if (forums.length === index + 1) {
                        return (
                            <article ref={lastForumElementRef} key={forum.id} className="forum_card" onClick={() => handleCardClick(forum.id)}>
                                <h2 className="forum_title_card">{forum.title}</h2>
                                <p className="forum_description_card">{forum.description}</p>
                                <span className="forum_date">{formatDate(forum.created_at)}</span>
                            </article>
                        );
                    } else {
                        return (
                            <article key={forum.id} className="forum_card" onClick={() => handleCardClick(forum.id)}>
                                <h2 className="forum_title_card">{forum.title}</h2>
                                <p className="forum_description_card">{forum.description}</p>
                                <span className="forum_date">{formatDate(forum.created_at)}</span>
                            </article>
                        );
                    }
                }) : (
                    <p className="no_forums">No forums available yet. Be the first to create one!</p>
                )}
                {loading && <p>Loading more forums...</p>}
            </section>

            {selectedForum && (
                <ForumDetailDialog
                    forum={selectedForum}
                    onClose={handleClosePopup}
                    isLogged={isLogged}
                    currentUsername={currentUsername}
                />
            )}
        </main>
    );
}

// Dialog to show detailed forum post, with like, share and comment
function ForumDetailDialog({ forum, onClose, isLogged, currentUsername }) {
    const dialogRef = useRef(null);
    const [commentsList, setCommentsList] = useState([]);
    const [newCommentText, setNewCommentText] = useState("");
    const [myProfileId, setMyProfileId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
        // Fetch comments for this forum
        fetch(`/yourtree/api/forum/${forum.id}/comments`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCommentsList(data);
            })
            .catch(err => console.error("Error fetching comments:", err));

        // Fetch user profile id if logged in
        if (isLogged && currentUsername) {
            fetch(`/yourtree/api/profile/${currentUsername}`)
                .then(res => res.json())
                .then(profile => {
                    if (profile && profile.id) setMyProfileId(profile.id);
                })
                .catch(err => console.error("Error fetching my profile", err));
        }
    }, [forum.id, isLogged, currentUsername]);

    const handleClose = () => {
        if (dialogRef.current) dialogRef.current.close();
        onClose();
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    };
    const handleComment = () => {
        if (!isLogged) return alert("You must be logged in to comment.");
        // Mock comment action
        // console.log("Commented on", forum.id);
    };

    return (
        <dialog className="forum_detail_dialog" ref={dialogRef} onCancel={handleClose}>
            <div className="dialog_content">
                <div className="dialog_top_bar">
                    <button className="btn_back_icon" onClick={handleClose}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </button>
                </div>

                <h2 className="forum_title_detail">{forum.title}</h2>

                <div className="forum_description_area">
                    {forum.description && <p className="post_text_detail">{forum.description}</p>}
                </div>
                <span className="forum_date detail_date">{formatDate(forum.created_at)}</span>

                <div className="forum_card_actions detail_actions">
                    <button className="btn_action_small">💬 Comentarios</button>
                    <button className="btn_action_small" onClick={handleShare}>➦ Compartir</button>
                </div>

                <div className="comments_section_detail">
                    {/* Add Comment Area */}
                    <div className="add_comment_container">
                        <textarea
                            className="comment_input_box"
                            placeholder="Añadir un comentario..."
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            onClick={(e) => {
                                if (!isLogged) {
                                    e.preventDefault();
                                    navigate("/Sign_in");
                                }
                            }}
                        />
                        <button
                        type='button'
                            className="btn_submit_comment"
                            onClick={async () => {
                                if (!isLogged) {
                                    navigate("/Sign_in");
                                    return;
                                }
                                if (newCommentText.trim() === "") return;
                                if (!myProfileId) {
                                    alert("No public profile found for your user. Please complete your profile to comment.");
                                    return;
                                }

                                const token = localStorage.getItem('accessToken') || cookies.get('token');
                                try {
                                    const res = await fetch('/yourtree/api/forum/comment/', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`
                                        },
                                        body: JSON.stringify({
                                            profileId: myProfileId,
                                            forumId: forum.id,
                                            content: newCommentText,
                                            status: 'active'
                                        })
                                    });
                                    if (res.ok) {
                                        // Fake pushing the comment to UI immediately for responsivness, wait for refresh on reopen
                                        setCommentsList([{ id: Date.now(), username: currentUsername || "You", content: newCommentText, created_at: new Date().toISOString() }, ...commentsList]);
                                        setNewCommentText("");
                                    } else {
                                        alert("Failed to submit comment");
                                    }
                                } catch (error) {
                                    console.error(error);
                                }
                            }}
                        >
                            Comentar
                        </button>
                    </div>

                    {commentsList.length === 0 ? (
                        <p className="comment_text no_comments_text">No comments yet, this is a placeholder mimicking the UI.</p>
                    ) : (
                        commentsList.map(comment => (
                            <div className="comment_thread" key={comment.id}>
                                <div className="comment_body">
                                    <div className="comment_header">
                                        <span className="comment_username">@{comment.username || comment.first_name || "unknown"}</span>
                                        {comment.created_at && (
                                            <span className="comment_date">{formatDate(comment.created_at)}</span>
                                        )}
                                    </div>
                                    <p className="comment_content">{comment.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </dialog>
    );
}

const FormCreateForum = React.memo(function FormCreateForum({ isLogged, username, onCreated }) {
    let dialogRef = useRef(null);
    const baseId = useId();

    function openDialog() {
        if (!isLogged) {
            alert("You must be logged in to create a forum.");
            return;
        }
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