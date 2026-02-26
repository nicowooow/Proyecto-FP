class ForumComment {
  #id;
  #forumId;
  #profileId;
  content;
  #status;
  likes;
  shares;
  createdAt;

  constructor(
    id,
    forumId,
    profileId,
    content,
    status,
    likes,
    shares,
    createdAt
  ) {
    this.#id = id;
    this.#forumId = forumId;
    this.#profileId = profileId;
    this.content = content;
    this.#status = status;
    this.likes = likes;
    this.shares = shares;
    this.createdAt = createdAt;
  }

  getId() {
    return this.#id;
  }
  setId(id) {
    this.#id = id;
  }
  getForumId() { return this.#forumId; }
  setForumId(forumId) { this.#forumId = forumId; }

  getProfileId() { return this.#profileId; }
  setProfileId(profileId) { this.#profileId = profileId; }

  // getContent() { return this.content; }
  // setContent(content) { this.content = content; }

  getStatus() { return this.#status; }
  setStatus(status) { this.#status = status; }

  // getLikes() { return this.likes; }
  // setLikes(likes) { this.likes = likes; }

  // getShares() { return this.shares; }
  // setShares(shares) { this.shares = shares; }

  // getCreatedAt() { return this.createdAt; }
  // setCreatedAt(createdAt) { this.createdAt = createdAt; }



  toJSON() {
    return {
      id: this.#id,
      forumId: this.#forumId,
      profileId: this.#profileId,
      content: this.content,
      status: this.#status,
      likes: this.likes,
      shares: this.shares,
      createdAt: this.createdAt,
    };
  }

  toPublic() {
    return {
      content: this.content,
      likes: this.likes,
      shares: this.shares,
      createdAt: this.createdAt,
    };
  }
}

export default ForumComment;
