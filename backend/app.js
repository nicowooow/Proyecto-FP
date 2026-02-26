// librerias que ne necesitan
// import cors from "cors";
// app.use(cors()); // permitir peticiones desde el frontend
import express from "express";

//middlewares

// rutas que usaremos
import tokenRoutes from "./routes/token.routes.js";
import signRoutes from "./routes/sign.routes.js";
import userRoutes from "./routes/users.routes.js";
import profileRoutes from "./routes/profiles.routes.js";
import styleRoutes from "./routes/style.routes.js";
import forumRoutes from "./routes/forum.routes.js";
import linkRoutes from "./routes/links.routes.js";

// import { upload_images } from "./middlewares/multer-S3.middleware.js";


// import {} from './../controllers/.controller.js'
const app = express();
app.use(express.json()); // esto nos permite usar el formato JSON
// Ruta principal (HTML)
app.get("/", (req, res) => {
  //vamos a tener el get del endpoint base "/" el cual nos dira si funciona o no el programa
  res.json({ mensaje: "the base endpoint works" });
});
app.get("/yourtree/api", (req, res) => {
  res.json({
    Profiles: "profiles/",
    users: "users/",
    style: "styles/",
    forum: "forums/",
    forum_comment: "forum_comments/",
  });
});
app.use("/yourtree/api", tokenRoutes);
app.use("/yourtree/api", signRoutes);
app.use("/yourtree/api", userRoutes);
app.use("/yourtree/api", profileRoutes);
app.use("/yourtree/api", styleRoutes);
app.use("/yourtree/api", forumRoutes);
app.use("/yourtree/api", linkRoutes);

/* app.post("/prueba/multer", upload_images.single("image"), (req, res) => {
  try {
    // console.log("REQUEST ===> ",req);
    console.log("FILE ===> ", req.file);
    console.log("BODY ===> ", req.body);

    return res.status(200).json({
      message: "Archivo recibido correctamente",
      file: req.file,
      body: req.body,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}); */

app.use((req, res) => {
  // este el el app.use el cual dara el mensaje, siemre y cuando los endpoints anteriores no se encuentren descritos/definidos.
  try {
    res.status(404).json({
      mensagge: `we don't have this endoint >> ${req.originalUrl} << `,
    });
  } catch (error) {
    console.log(error);
  }
});

export default app;
