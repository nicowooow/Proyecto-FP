import pool from "../db/connection_db.model.js";
export const get_profiles = async (req, res) => {
  try {
    let sql = "select * from profiles";
    let { rows } = await pool.query(sql);
    res.send(rows);
  } catch (error) {
    console.log(error);
  }
};

export const get_profile = async (req, res, next) => {
  try {
    let { username } = req.params;
    let sql = `select p.* from profiles p join users u on p.user_id = u.id where u.username = $1`;
    let { rows } = await pool.query(sql, [username]);

    if (rows.length === 0) return res.status(404).json({ message: "Profile not found" });
    res.send(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const post_profile = (req, res) => {
  try {
    let {
      user_id,
      plan_id,
      first_name,
      last_name,
      birth_day,
      phone,
      recovery_email,
      bio,
      image_url,
      theme,
      is_monthly_plan,
      is_public
    } = req.body;
    let created_at = new Date();
    let updated_at;
  } catch (error) {
    console.log(error);
    // res.status(404).send("usuario no encontrado");
    res.status(500).json({ message: "Error en el servidor" }); // importante
  }
};

export const delete_profile = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    // res.status(404).send("usuario no encontrado");
    res.status(500).json({ message: "Error en el servidor" }); // importante
  }
};

export const put_profile = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    // res.status(404).send("usuario no encontrado");
    res.status(500).json({ message: "Error en el servidor" }); // importante
  }
};

export const patch_profile = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    // res.status(404).send("usuario no encontrado");
    res.status(500).json({ message: "Error en el servidor" }); // importante
  }
};
