import pool from "../db/connection_db.model.js";

class profileRepository {
  /**
   * Obtener perfil por id de usuario.
   *
   * @param {int} userId - id del usuario del perfil a obtener
   * @returns {Promise<Object|null>} fila o null
   */
  getProfileByUserId(userId) {
    const sql = "select * from profiles where user_id = $1 limit 1";
    return pool.query(sql, [userId]).then(({ rows }) => rows[0] || null);
  }

  /**
   *  Obtener perfil por id de perfil.
   *
   * @param {int} id - id del perfil a obtener
   * @returns {Promise<Object|null>} fila o null
   */
  getProfile(id) {
    const sql = "select * from profiles where id = $1 limit 1";
    return pool.query(sql, [id]).then(({ rows }) => rows[0] || null);
  }

  /**
   * Crear un nuevo perfil.
   *
   * @param {int} userId - id del usuario al que pertenece el perfil
   * @param {string} firstName - nombre del perfil
   * @param {string} lastName - apellido del perfil
   * @param {date} birthDate - fecha de nacimiento del perfil
   * @param {string} recoveryEmail - email de recuperación del perfil
   * @param {string} bio - biografía del perfil
   * @param {string} imageUrl - url de la imagen del perfil
   * @param {string} theme - tema del perfil claro u oscuro
   * @returns {Promise<number>} filas afectadas
   */
  createProfile(
    userId,
    firstName,
    lastName,
    birthDate,
    recoveryEmail,
    bio,
    imageUrl,
    theme
  ) {
    const sql = `insert into profiles (user_id, first_name, last_name, birth_date, recovery_email, bio, image_url, theme, created_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
    const createdAt = new Date();
    return pool
      .query(sql, [
        userId,
        firstName,
        lastName,
        birthDate,
        recoveryEmail,
        bio,
        imageUrl,
        theme,
        createdAt,
      ])
      .then(({ rowCount }) => rowCount);
  }

  /**
   * Eliminar un perfil por id.
   * 
   * @param {int} id - id del perfil a eliminar
   * @returns {Promise<number>} filas afectadas
   */
  deleteProfile(id) {
    const sql = "delete from profiles where id = $1";
    return pool.query(sql, [id]).then(({ rowCount }) => rowCount);
  }

  /**
   * Actualizar parcialmente un perfil por id usando COALESCE.
   * 
   * @param {int} id - id del perfil a actualizar
   * @param {string} firstName - nombre del perfil
   * @param {string} lastName - apellido del perfil
   * @param {date} birthDate - fecha de nacimiento del perfil
   * @param {string} recoveryEmail  - email de recuperación del perfil
   * @param {string} bio - biografía del perfil
   * @param {string} imageUrl - url de la imagen del perfil
   * @param {string} theme - tema del perfil claro u oscuro
   * @returns {Promise<number>} filas afectadas
   */
  patchProfile(
    id,
    firstName,
    lastName,
    birthDate,
    recoveryEmail,
    bio,
    imageUrl,
    theme
  ) {
    const sql = `update profiles set first_name = COALESCE($1,first_name), last_name = COALESCE($2,last_name), birth_date = COALESCE($3,birth_date), recovery_email = COALESCE($4,recovery_email), bio = COALESCE($5,bio), image_url = COALESCE($6,image_url), theme = COALESCE($7,theme) where id = $8`;
    return pool
      .query(sql, [
        firstName,
        lastName,
        birthDate,
        recoveryEmail,
        bio,
        imageUrl,
        theme,
        id,
      ])
      .then(({ rowCount }) => rowCount);
  }
}

export default new profileRepository();
