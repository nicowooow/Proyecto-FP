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
   * @param {int} planId - id del plan al que pertenece el perfil
   * @param {string} firstName - nombre del perfil
   * @param {string} lastName - apellido del perfil
   * @param {date} birthDate - fecha de nacimiento del perfil
   * @param {string} phone - teléfono del perfil
   * @param {string} recoveryEmail - email de recuperación del perfil
   * @param {string} bio - biografía del perfil
   * @param {string} imageUrl - url de la imagen del perfil
   * @param {string} theme - tema del perfil claro u oscuro
   * @param {boolean} isMonthlyPlan - si el plan es mensual o anual
   * @param {boolean} isPublic - si el perfil es público o privado
   * @returns {Promise<number>} filas afectadas
   */
  createProfile(
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
  ) {
    const sql = `insert into profiles (user_id, plan_id, first_name, last_name, birth_date, phone, recovery_email, bio, image_url, theme, is_monthly_plan, is_public, created_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`;
    const createdAt = new Date();
    return pool
      .query(sql, [
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
   * @param {string} phone - teléfono del perfil
   * @param {string} recoveryEmail  - email de recuperación del perfil
   * @param {string} bio - biografía del perfil
   * @param {string} imageUrl - url de la imagen del perfil
   * @param {string} theme - tema del perfil claro u oscuro
   * @param {boolean} isMonthlyPlan - si el plan es mensual o anual
   * @param {boolean} isPublic - si el perfil es público o privado
   * @param {int} planId - id del plan al que pertenece el perfil
   * @returns {Promise<number>} filas afectadas
   */
  patchProfile(
    id,
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
    planId,
  ) {
    const sql = `update profiles set first_name = COALESCE($1,first_name), last_name = COALESCE($2,last_name), birth_date = COALESCE($3,birth_date), phone = COALESCE($4,phone), recovery_email = COALESCE($5,recovery_email), bio = COALESCE($6,bio), image_url = COALESCE($7,image_url), theme = COALESCE($8,theme), is_monthly_plan = COALESCE($9,is_monthly_plan), is_public = COALESCE($10,is_public), plan_id = COALESCE($11,plan_id), updated_at = $12 where id = $13`;
    const updatedAt = new Date();
    return pool
      .query(sql, [
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
        planId,
        updatedAt,
        id,
      ])
      .then(({ rowCount }) => rowCount);
  }
}

export default new profileRepository();
