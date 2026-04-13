class Profile {
  // los privados #
  #id;
  #userId;
  firstName;
  lastName;
  #birthDate;
  #recoveryEmail;
  bio;
  imageUrl;
  #theme;
  #createdAt;

  constructor(
    id,
    userId,
    firstName,
    lastName,
    birthDate,
    recoveryEmail,
    bio,
    imageUrl,
    theme,
    createdAt
  ) {
    this.#id = id;
    this.#userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.#birthDate = birthDate;
    this.#recoveryEmail = recoveryEmail;
    this.bio = bio;
    this.imageUrl = imageUrl;
    this.#theme = theme;
    this.#createdAt = createdAt;
  }

  getId() {
    return this.#id;
  }
  setId(id) {
    this.#id = id;
  }

  getUserId() {
    return this.#userId;
  }
  setUserId(userId) {
    this.#userId = userId;
  }

  getBirthDate() {
    return this.#birthDate;
  }
  setBirthDate(birthDate) {
    this.#birthDate = birthDate;
  }

  getRecoveryEmail() {
    return this.#recoveryEmail;
  }
  setRecoveryEmail(recoveryEmail) {
    this.#recoveryEmail = recoveryEmail;
  }

  getTheme() {
    return this.#theme;
  }
  setTheme(theme) {
    this.#theme = theme;
  }

  getCreatedAt() {
    return this.#createdAt;
  }
  setCreatedAt(createdAt) {
    this.#createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.#id,
      userId: this.#userId,
      firstName: this.firstName,
      lastName: this.lastName,
      birthDate: this.#birthDate,
      recoveryEmail: this.#recoveryEmail,
      bio: this.bio,
      imageUrl: this.imageUrl ? `/yourtree/api/upload/${this.imageUrl}` : null,
      theme: this.#theme,
      createdAt: this.#createdAt
    };
  }

  toPublic() {
    return {
      id: this.#id,
      firstName: this.firstName,
      lastName: this.lastName,
      bio: this.bio,
      imageUrl: this.imageUrl ? `/yourtree/api/upload/${this.imageUrl}` : null,
      theme: this.#theme
    };
  }
}

export default Profile;
