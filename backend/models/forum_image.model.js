class ForumImage {
	#id;
	#forumId;
	imageUrl;
	position;

	constructor(id, forumId, imageUrl, position) {
		this.#id = id;
		this.#forumId = forumId;
		this.imageUrl = imageUrl;
		this.position = position;
	}

	getId() {
		return this.#id;
	}
	setId(id) {
		this.#id = id;
	}

	getForumId() {
		return this.#forumId;
	}
	setForumId(forumId) {
		this.#forumId = forumId;
	}

	// getImageUrl() { return this.imageUrl; }
	// setImageUrl(imageUrl) { this.imageUrl = imageUrl; }

	// getPosition() { return this.position; }
	// setPosition(position) { this.position = position; }

	toJSON() {
		return {
			id: this.#id,
			forumId: this.#forumId,
			imageUrl: this.imageUrl,
			position: this.position,
		};
	}

	toPublic() {
		return {
			imageUrl: this.imageUrl,
			position: this.position,
		};
	}
}

export default ForumImage;
