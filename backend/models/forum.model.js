class Forum {
	#id;
	#profileId;
	title;
	description;
	isSensitive;
	#isPublic;
	#status;
	likes;
	shares;
	createdAt;

	constructor(
		id,
		profileId,
		title,
		description,
		isSensitive,
		isPublic,
		status,
		likes,
		shares,
		createdAt,
	) {
		this.#id = id;
		this.#profileId = profileId;
		this.title = title;
		this.description = description;
		this.isSensitive = isSensitive;
		this.#isPublic = isPublic;
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

	getProfileId() {
		return this.#profileId;
	}
	setProfileId(profileId) {
		this.#profileId = profileId;
	}

	// getTitle() { return this.title; }
	// setTitle(title) { this.title = title; }

	// getDescription() { return this.description; }
	// setDescription(description) { this.description = description; }

	// getIsSensitive() { return this.isSensitive; }
	// setIsSensitive(isSensitive) { this.isSensitive = isSensitive; }

	getIsPublic() {
		return this.#isPublic;
	}
	setIsPublic(isPublic) {
		this.#isPublic = isPublic;
	}

	getStatus() {
		return this.#status;
	}
	setStatus(status) {
		this.#status = status;
	}

	// getLikes() { return this.likes; }
	// setLikes(likes) { this.likes = likes; }

	// getShares() { return this.shares; }
	// setShares(shares) { this.shares = shares; }

	// getCreatedAt() { return this.createdAt; }
	// setCreatedAt(createdAt) { this.createdAt = createdAt; }

	toJSON() {
		return {
			id: this.#id,
			profileId: this.#profileId,
			title: this.title,
			description: this.description,
			isSensitive: this.isSensitive,
			isPublic: this.#isPublic,
			status: this.#status,
			likes: this.likes,
			shares: this.shares,
			createdAt: this.createdAt,
		};
	}
	toPublic() {
		return {
			title: this.title,
			description: this.description,
			isSensitive: this.isSensitive,
			likes: this.likes,
			shares: this.shares,
			createdAt: this.createdAt,
		};
	}
}

export default Forum;
