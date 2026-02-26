class Category {
  #id;
  name;
  theme;

  constructor(id, name, theme) {
    this.#id = id;
    this.name = name;
    this.theme = theme;
  }

  getId() {
    return this.#id;
  }
  setId(id) {
    this.#id = id;
  }

  // getName() { return this.name }
  // setName(name) { this.name = name }

  // getTheme() { return this.theme }
  // setTheme(theme) { this.theme = theme }

  toJSON() {
    return {
      id: this.#id,
      name: this.name,
      theme: this.theme,
    };
  }

  toPublic() {
    return {
      name: this.name,
      theme: this.theme,
    };
  }
}

export default Category;
