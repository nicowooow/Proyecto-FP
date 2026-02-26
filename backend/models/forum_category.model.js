class ForumCategory {
  #categoryId;
  #forumId;

  constructor(categoryId, forumId) {
    this.#categoryId = categoryId;
    this.#forumId = forumId;
  }

  getCategoryId() {
    return this.#categoryId;
  }
  setCategoryId(categoryId) {
    this.#categoryId = categoryId;
  }

  getForumId() {
    return this.#forumId;
  }
  setForumId(forumId) {
    this.#forumId = forumId;
  }

  toJSON() {
    return {
      categoryId: this.#categoryId,
      forumId: this.#forumId,
    };
  }

  toPublic() {
    return {};
  }
}

export default ForumCategory;
