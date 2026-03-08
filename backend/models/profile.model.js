class Profile {
  // los privados #
  #id;
  #userId;
  #planId;
  firstName;
  lastName;
  #birthDate;
  #phone;
  #recoveryEmail;
  bio;
  imageUrl;
  #theme;
  #isMonthlyPlan;
  isPublic;
  #createdAt;
  #updatedAt;

  constructor(
    id,
    userId,
    planId,
    firstName,
    lastName,
    birthDate,
    phone,
    recoveryEmail,
    bio,
    imageUrl,
    theme,
    isMonthlyPlan,
    isPublic,
    createdAt,
    updatedAt,
  ) {
    this.#id = id;
    this.#userId = userId;
    this.#planId = planId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.#birthDate = birthDate;
    this.#phone = phone;
    this.#recoveryEmail = recoveryEmail;
    this.bio = bio;
    this.imageUrl = imageUrl;
    this.#theme = theme;
    this.#isMonthlyPlan = isMonthlyPlan;
    this.isPublic = isPublic;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
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

  getPlanId() {
    return this.#planId;
  }
  setPlanId(planId) {
    this.#planId = planId;
  }

  // getFirsName(){return this.firstName }
  // setFirsName(firstName){this.firstName = firstName }

  // getLastName(){return this.lastName}
  // setLastName(lastName){this.lastName = lastName }

  getBirthDate() {
    return this.#birthDate;
  }
  setBirthDate(birthDate) {
    this.#birthDate = birthDate;
  }

  getPhone() {
    return this.#phone;
  }
  setPhone(phone) {
    this.#phone = phone;
  }

  getRecoveryEmail() {
    return this.#recoveryEmail;
  }
  setRecoveryEmail(recoveryEmail) {
    this.#recoveryEmail = recoveryEmail;
  }

  // getBio(){return this.bio}
  // setBio(bio){this.bio = bio }

  // getImageUrl(){return this.imageUrl}
  // setImageUrl(imageUrl){this.imageUrl = imageUrl }

  getTheme() {
    return this.#theme;
  }
  setTheme(theme) {
    this.#theme = theme;
  }

  getIsMonthlyPlan() {
    return this.#isMonthlyPlan;
  }
  setIsMonthlyPlan(isMonthlyPlan) {
    this.#isMonthlyPlan = isMonthlyPlan;
  }

  // getIsPublic(){return this.isPublic}
  // setIsPublic(isPublic){this.isPublic = isPublic }

  getCreatedAt() {
    return this.#createdAt;
  }
  setCreatedAt(createdAt) {
    this.#createdAt = createdAt;
  }

  getUpdatedAt() {
    return this.#updatedAt;
  }
  setUpdatedAt(updatedAt) {
    this.#updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this.#id,
      userId: this.#userId,
      planId: this.#planId,
      firstName: this.firstName,
      lastName: this.lastName,
      birthDate: this.#birthDate,
      phone: this.#phone,
      recoveryEmail: this.#recoveryEmail,
      bio: this.bio,
      imageUrl: this.imageUrl,
      theme: this.#theme,
      isMonthlyPlan: this.#isMonthlyPlan,
      isPublic: this.isPublic,
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt,
    };
  }

  toPublic() {
    return {
      id: this.#id,
      firstName: this.firstName,
      lastName: this.lastName,
      bio: this.bio,
      imageUrl: this.imageUrl,
    };
  }
}

export default Profile;
