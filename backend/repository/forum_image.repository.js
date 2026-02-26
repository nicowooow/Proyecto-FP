import pool from "../db/connection_db.model.js";

class forumImageRepository {
  /**
   * Listar imágenes de un foro.
   * @param {int} forumId - id del foro
   * @returns {Promise<Array>} filas de imágenes
   */
  getImagesByForum(forumId) {
    const sql = "select * from forum_images where forum_id = $1 order by position asc";
    return pool.query(sql, [forumId]).then(({ rows }) => rows);
  }

  /**
   * Añadir imagen a foro.
   * @param {int} forumId - id del foro
   * @param {string} imageUrl - URL de la imagen
   * @param {int} position - posición de la imagen en el orden del foro (1, 2, 3, 4 y 5)
   * @returns {Promise<number>} filas afectadas
   */
  addImage(forumId, imageUrl, position) {
    const sql = "insert into forum_images (forum_id, image_url, position) values ($1,$2,$3)";
    return pool.query(sql, [forumId, imageUrl, position]).then(({ rowCount }) => rowCount);
  }

  /**
   * Eliminar imagen por id.
   * @param {int} id - id de la imagen a eliminar
   * @returns {Promise<number>} filas afectadas
   */
  deleteImage(id) {
    const sql = "delete from forum_images where id = $1";
    return pool.query(sql, [id]).then(({ rowCount }) => rowCount);
  }
}

export default new forumImageRepository();
