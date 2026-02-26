import pool from "../db/connection_db.model.js";

class styleRepository {
  /**
   * Obtener todos los estilos disponibles.
   * 
   * @returns {Promise<Array>} Array de estilos disponibles
   */
  getStyles(){
    const sql = "select * from styles"
    return pool.query(sql,[]).then(({rows})=> rows)
  }

  /**
   * Obtener un estilo por su id.
   * 
   * @param {int} id - id del estilo
   * @returns {Promise<Object>} estilo correspondiente al id
   */
  getStyle(id) {
    const sql = "select * from styles where id = $1 limit 1";
    return pool.query(sql, [id]).then(({rows})=>rows);
  }

  /**
   * Crear un nuevo estilo.
   * 
   * @param {string} title - título del estilo
   * @param {string} style - estilo CSS en formato JSON
   * @returns {Promise<number>} filas afectadas
   */
  createStyle(title, style) {
    const sql = "insert into styles (title, style) values ($1,$2)";
    return pool.query(sql, [title, style]).then(({rowCount})=>rowCount);
  }

  /**
   * Eliminar un estilo por su id.
   * 
   * @param {int} id - id del estilo a eliminar
   * @returns {Promise<number>} filas afectadas
   */
  deleteStyle(id) {
    const sql = "delete from styles where id = $1";    
    return pool.query(sql, [id]).then(({rowCount})=>rowCount);
  }

  /**
   * Actualizar un estilo por su id.
   * 
   * @param {int} id - id del estilo a actualizar
   * @param {string} title - título del estilo
   * @param {string} style - estilo CSS en formato JSON
   * @returns {Promise<number>} filas afectadas
   */
  putStyle(id, title, style) {
    const sql =
      "update styles set title = $1 ,style = $2 where id = $3";
    return pool.query(sql, [title,style,id]).then(({rowCount})=>rowCount);
  }

  /**
   * Actualizar parcialmente un estilo por su id usando COALESCE.
   * 
   * @param {int} id - id del estilo a actualizar
   * @param {string} title - título del estilo
   * @param {string} style - estilo CSS en formato JSON
   * @returns {Promise<number>} filas afectadas
   */
  patchStyle(id,title,style) {
    const sql =
      "update styles set title = COALESCE($1,title) ,style = COALESCE($2,style) where id = $3";
    return pool.query(sql, [title,style,id]).then(({rowCount})=>rowCount);
  }
}

export default new styleRepository;