import pool from "../db/connection_db.model.js";
class link_statsRepository {
  /**
   * Obtener estadísticas de los links asociados a un perfil ordenadas por fecha.
   *
   * @param {int} profileId - id del perfil para obtener las estadísticas de los links asociados a ese perfil
   * @returns {Promise<Array>} filas con stats de los links asociados a ese perfil
   */
  getLinksStats(profileId) {
    const sql = "select * from link_stats where profile_id = $1";
    return pool.query(sql, [profileId]).then(({ rows }) => rows);
  }

  /**
   * Obtener estadísticas de un link por id.
   *
   * @param {int} id - id del link para obterner sus estadisticas
   * @returns {Promise<Array>} filas con stats del link asociado a ese id
   */
  getLinkStats(id) {
    const sql = "select * from link_stats where id = $1";
    return pool.query(sql, [id]).then(({ rows }) => rows);
  }
  /**
   * Registrar una nueva estadística para un link.
   *
   * @param {int} LinkId - id del link asociado a las estadísticas
   * @param {int} profileId - id del perfil asociado a las estadísticas
   * @param {date} viewedAt - fecha de visualización de las estadísticas
   * @param {string} userAgent - agente de usuario que accedió a las estadísticas
   * @param {string} ipAddress - dirección IP desde donde se accedió a las estadísticas
   * @param {string} referrer - referer desde donde se accedió al link
   * @returns {Promise<number>} filas afectadas
   */
  postLinkStats(LinkId, profileId, viewedAt, userAgent, ipAddress, referrer) {
    const sql =
      " insert into link_stats (Link_id, profile_id,viewed_at,user_agent,ip_address,referrer) values ($1,$2,$3,$4,$5,$6) ";
    return pool
      .query(sql, [LinkId, profileId, viewedAt, userAgent, ipAddress, referrer])
      .then(({ rowCount }) => rowCount);
  }
  /**
   * Eliminar estadísticas de un link por id.
   * @param {int} id - id del link cuyas estadísticas se eliminarán
   * @returns {Promise<number>} filas afectadas
   */
  deleteLinkStats(id) {
    const sql = "delete from link_stats where id = $1";
    return pool.query(sql, [id]).then(({ rowCount }) => rowCount);
  }

  /**
   * Reemplazar completamente las estadísticas de un link por id.
   *
   * @param {int} id - id del link cuyas estadísticas se actualizarán
   * @param {int} LinkId - id del link asociado a las estadísticas
   * @param {int} profileId - id del perfil asociado a las estadísticas
   * @param {date} viewedAt - fecha de visualización de las estadísticas
   * @param {string} userAgent - agente de usuario que accedió a las estadísticas
   * @param {string} ipAddress - dirección IP desde donde se accedió a las estadísticas
   * @param {string} referrer - referer desde donde se accedió al link
   * @returns {Promise<number>} filas afectadas
   */
  putLinkStats(
    id,
    LinkId,
    profileId,
    viewedAt,
    userAgent,
    ipAddress,
    referrer,
  ) {
    const sql =
      "update link_stats set Link_id = $1, profile_id = $2, viewed_at = $3, user_agent = $4, ip_address = $5, referrer = $6 where id = $7";
    return pool
      .query(sql, [
        id,
        LinkId,
        profileId,
        viewedAt,
        userAgent,
        ipAddress,
        referrer,
      ])
      .then(({ rowCount }) => rowCount);
  }

  /**
   * Actualizar parcialmente las estadísticas de un link por id.
   *
   * @param {int} id - id del link cuyas estadísticas se actualizarán
   * @param {int} LinkId - id del link asociado a las estadísticas
   * @param {int} profileId - id del perfil asociado a las estadísticas
   * @param {date} viewedAt - fecha de visualización de las estadísticas
   * @param {string} userAgent - agente de usuario que accedió a las estadísticas
   * @param {string} ipAddress - dirección IP desde donde se accedió a las estadísticas
   * @param {*} referrer - referer desde donde se accedió al link
   * @returns {Promise<number>} filas afectadas
   */
  patchLinkStats(
    id,
    LinkId,
    profileId,
    viewedAt,
    userAgent,
    ipAddress,
    referrer,
  ) {
    const sql =
      "update link_stats set Link_id = COALESCE($1,Link_id), profile_id = COALESCE($2,profile_id), viewed_at = COALESCE($3,viewed_at), user_agent = COALESCE($4,user_agent), ip_address = COALESCE($5,ip_address), referrer = COALESCE($6,referrer) where id = $7";
    return pool
      .query(sql, [
        id,
        LinkId,
        profileId,
        viewedAt,
        userAgent,
        ipAddress,
        referrer,
      ])
      .then(({ rowCount }) => rowCount);
  }
}

export default new link_statsRepository();
