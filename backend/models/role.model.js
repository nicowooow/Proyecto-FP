class Role {
  #id;
  name;
  description;

  constructor(id, name, description) {
    this.#id = id;
    this.name = name;
    this.description = description;
  }

  getId() {
    return this.#id;
  }
  setId(id) {
    this.#id = id;
  }

  // getName() { return this.name }
  // setName(name) { this.name = name }

  // getDescription() { return this.description }
  // setDescription(description) { this.description = description }
  toJSON() {
    return {
      id: this.#id,
      name: this.name,
      description: this.description,
    };
  }
  toPublic() {
    return {
      name: this.name,
      description: this.description,
    };
  }
}

export default Role;
