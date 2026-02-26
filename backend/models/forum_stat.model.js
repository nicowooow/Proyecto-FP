class ForumStat {
	#id;
	#forumId;
	#profileId;
	#viewedAt;
	#userAgent;
	#ipAddress;
	#referrer;

	constructor(
		id,
		forumId,
		profileId,
		viewedAt,
		userAgent,
		ipAddress,
		referrer,
	) {
		this.#id = id;
		this.#forumId = forumId;
		this.#profileId = profileId;
		this.#viewedAt = viewedAt;
		this.#userAgent = userAgent;
		this.#ipAddress = ipAddress;
		this.#referrer = referrer;
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

	getProfileId() {
		return this.#profileId;
	}
	setProfileId(profileId) {
		this.#profileId = profileId;
	}

	getViewedAt() {
		return this.#viewedAt;
	}
	setViewedAt(viewedAt) {
		this.#viewedAt = viewedAt;
	}

	getUserAgent() {
		return this.#userAgent;
	}
	setUserAgent(userAgent) {
		this.#userAgent = userAgent;
	}

	getIpAddress() {
		return this.#ipAddress;
	}
	setIpAddress(ipAddress) {
		this.#ipAddress = ipAddress;
	}

	getReferrer() {
		return this.#referrer;
	}
	setReferrer(referrer) {
		this.#referrer = referrer;
	}

	toJSON() {
		return {
			id: this.#id,
			forumId: this.#forumId,
			profileId: this.#profileId,
			viewedAt: this.#viewedAt,
			userAgent: this.#userAgent,
			ipAddress: this.#ipAddress,
			referrer: this.#referrer,
		};
	}

	toPublic() {
		return {};
	}
}

export default ForumStat;
