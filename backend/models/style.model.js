class Style {
  #id;
  title;
  section;
  style;

  constructor(id, title, section, style) {
    this.#id = id;
    this.title = title;
    this.section = section;
    this.style = style;
  }

  getId() {
    return this.#id;
  }
  setId(id) {
    this.#id = id;
  }

  // getTitle() { return this.title; }
  // setTitle(title) { this.title = title; }

  // getSection() { return this.section; }
  // setSection(section) { this.section = section; }

  // getStyle() { return this.style; }
  // setStyle(style) { this.style = style; }
  toJSON() {
    return {
      id: this.#id,
      title: this.title,
      section: this.section,
      style: this.style,
    };
  }

  toPublic() {
    return {
      title: this.title,
      section: this.section,
      style: this.style,
    };
  }
}

export default Style;
