// models/Link.js

class Link {
	#id;
	#profileId;
	title;
	url;
	urlImage;
	position;
	isVisible;

	constructor(link) {
		this.#id = link.id;
		this.#profileId = link.profil_id;
		this.title = link.title;
		this.url = link.url;
		this.urlImage = link.url_image;
		this.position = link.position;
		this.isVisible = link.is_visible;
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

	// getTitle() { return this.title }
	// setTitle(title) { this.title = title }

	// getUrl() { return this.url }
	// setUrl(url) { this.url = url }

	// getUrlImage() { return this.urlImage }
	// setUrlImage(urlImage) { this.urlImage = urlImage }

	// getPosition() { return this.position }
	// setPosition(position) { this.position = position }

	// getIsVisible() { return this.isVisible }
	// setIsVisible(isVisible) { this.isVisible = isVisible }

	toJSON() {
		return {
			id: this.#id,
			profileId: this.#profileId,
			title: this.title,
			url: this.url,
			urlImage: this.urlImage,
			position: this.position,
			isVisible: this.isVisible,
		};
	}
	toPublic() {
		return {
			id: this.#id,
			title: this.title,
			url: this.url,
			urlImage: this.urlImage,
			position: this.position,
			isVisible: this.isVisible,
		};
	}
}

export default Link;
