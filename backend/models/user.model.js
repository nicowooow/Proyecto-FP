class User {
	// si tiene el # se considera privado y si no lo tiene se considera publico
	#id;
	username;
	email;
	#password;
	#status;
	#createdAt;
	#lastLoginAt;
	#role;
	#tokenVersion;
	#verifyCode;

	constructor(userBD) {
		this.#id = userBD.id;
		this.username = userBD.username;
		this.email = userBD.email;
		this.#password = userBD.password;
		this.#status = userBD.status;
		this.#createdAt = userBD.createdAt;
		this.#lastLoginAt = userBD.lastLoginAt;
		this.#role = userBD.role;
		this.#tokenVersion = userBD.tokenVersion;
		this.#verifyCode = userBD.verifyCode;
	}

	getId() {
		return this.#id;
	}
	setId(id) {
		this.#id = id;
	}

	// getUsername(){ return this.username }
	// setUsername(username){  this.username = username }

	// getEmail(){ return this.email }
	// setEmail(email){  this.email = email }

	getPassword() {
		return this.#password;
	}
	setPassword(password) {
		this.#password = password;
	}

	getStatus() {
		return this.#status;
	}
	setStatus(status) {
		this.#status = status;
	}

	getCreatedAt() {
		return this.#createdAt;
	}
	setCreatedAt(createdAt) {
		this.#createdAt = createdAt;
	}

	getLastLoginAt() {
		return this.#lastLoginAt;
	}
	setLastLoginAt(lastLoginAt) {
		this.#lastLoginAt = lastLoginAt;
	}

	getRole() {
		return this.#role;
	}
	setRole(role) {
		this.#role = role;
	}

	getTokenVersion() {
		return this.#tokenVersion;
	}
	setTokenVersion(tokenVersion) {
		this.#tokenVersion = tokenVersion;
	}
	getVerifyCode() {
		return this.#verifyCode;
	}
	setVerifyCode(verifyCode) {
		this.#verifyCode = verifyCode;
	}

	toJson() {
		return {
			id: this.#id,
			username: this.username,
			email: this.email,
			status: this.#status,
			createdAt: this.#createdAt,
			lastLoginAt: this.#lastLoginAt,
			role: this.#role,
			verifyCode: this.#verifyCode,
		};
	}

	toPublic() {
		return {
			username: this.username,
			email: this.email,
		};
	}
}

export default User;
