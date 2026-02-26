js;
// models/Link.js

class Link {
  #id;
  #profileId;
  title;
  url;
  position;
  isVisible;

  constructor(id, profileId, title, url, position, isVisible) {
    this.#id = id;
    this.#profileId = profileId;
    this.title = title;
    this.url = url;
    this.position = position;
    this.isVisible = isVisible;
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
      position: this.position,
      isVisible: this.isVisible,
    };
  }
  toPublic() {
    return {
      title: this.title,
      url: this.url,
      position: this.position,
      isVisible: this.isVisible,
    };
  }
}

export default Link;
