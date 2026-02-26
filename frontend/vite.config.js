import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy:{
      "/yourtree/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    }
  },
});
// En server configuramos un proxy para desarrollo.
// Cualquier fetch a "/yourtree/api/..." desde el front
// se redirige internamente a "http://192.168.1.134:3000/yourtree/api/...", el localhost le tenemos que poner la ip del servidor
// gracias a la opción `target`.
// `changeOrigin: true` ajusta el host de la cabecera para que parezca
// que la petición se hizo directamente al backend.
