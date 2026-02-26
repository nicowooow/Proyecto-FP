import pool from "../db/connection_db.model.js";

class forumStatRepository {
  /**
   * Añadir estadística/visita para un foro.
   *
   * @param {int} forumId - id del foro
   * @param {int|null} profileId - id del perfil (si aplica)
   * @param {string|null} userAgent - cadena del agente de usuario
   * @param {string|null} ipAddress - dirección IP desde la que se registró la visita
   * @param {string|null} referrer - URL referer
   * @returns {Promise<number>} filas afectadas
   */
  addStat(forumId, profileId, userAgent, ipAddress, referrer) {
    const sql = "insert into forum_stats (forum_id, profile_id, user_agent, ip_address, referrer) values ($1,$2,$3,$4,$5)";
    return pool.query(sql, [forumId, profileId, userAgent, ipAddress, referrer]).then(({ rowCount }) => rowCount);
  }

  /**
   * Obtener estadísticas de un foro ordenadas por fecha.
   *
   * @param {int} forumId - id del foro
   * @returns {Promise<Array>} filas con stats (viewed_at, user_agent, ip_address, referrer)
   */
  getStatsByForum(forumId) {
    const sql = "select * from forum_stats where forum_id = $1 order by viewed_at desc";
    return pool.query(sql, [forumId]).then(({ rows }) => rows);
  }
}

export default new forumStatRepository();
