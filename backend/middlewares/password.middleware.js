import bcrypt from "bcrypt";

export const prepare_sign_up = async (req, res, next) => {
  try {
    let { username, email, password, confirm_password } = req.body;
    //console.log(req.body);// para saber si esta bien el body que enviamos
    // si no encuentra password en el body se salta la logica
    // hashea la contraseña de verificacion, y la primera se deja para luego verificarlo con el metoo de verify_password
    if (!username || !email || !password || !confirm_password) {
      return res.status(400).json({ action: "faltan completar datos" });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ action: "las contraseñas no coinciden" });
    }
    const saltRounds = 10; //la cantidad de salseo que se le pondra al hash
    // hashea la contraseña para confirma de confirmacion
    let hash_password = await bcrypt.hash(password, saltRounds);
    req.body.password = hash_password;
    delete req.body.confirm_password; // al ya haber comparado las contraseñas no se nos hace imprecindible

    next();
  } catch (error) {
    next(error);
  }
};

export const hash_password = async (req, res, next) => {
  try {
    console.log(req.body.password);
    let password = req.body.password;
    const saltRounds = 10;
    let hash_password = await bcrypt.hash(password, saltRounds);
    req.body.password = hash_password;
    console.log(req.body.password);

    next();
  } catch (error) {
    next(error);
  }
};

export const verify_password = (password, password_hash) => {
  return bcrypt.compare(password, password_hash);
};
