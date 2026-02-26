import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { verifyToken } from "./token.jsx";

const AuthContext = createContext();
// creamos un contexto de autenticacion general para la aplicacion es decir
// es una etiqueta semantica en react que sera obligatoria de pasar al estar dentro de la app web

// creamos dicha etiqueta con el nombre de AuthProvider el cual tendra como parametro de entrada\
// un objeto cualquiera
export function AuthProvider({ children }) {
  // isLogged y loading lo ponemos con sus valores por defecto
  let [isLogged, setIsLogged] = useState(false);
  // let [loading, setLoading] = useState(true);
  // el loading no lo usamos porque por ahora no tengo la pantalla de carga

  // usamos un efecto en el cual metemos una funcion asincrona para esperar la repuesta del servidor
  useEffect(() => {
    //hacemos una funcion vacia para por asi decirlo para ejecutar el verifytoken
    (async () => {
      let logged = await verifyToken();
      // si no encuentra su refresh lo elimina, loss tokens guardados previamente
      // console.log(logged);
      
      if (!logged) logout();
      // ponemos los datos
      // el resultado de verifyToken sera un boolean lo cual nos dira si esta logueado o no
      setIsLogged(logged);
      // setLoading(false);
      // esto nos serviria para el loader de la paginal si es falso desaparece el loader de la vista princial
    })();
  }, []);

  // esta sera una funcion para almacenar los tokens en el login
  const login = (token, refreshToken, user) => {
    // token inicial el cual es token de autenticacion original
    localStorage.setItem("token", token);
    // este sera el token que usaremos para recargar el anterior antes de que expire
    localStorage.setItem("refreshToken", refreshToken);
    // almacenamos los datos que sacamos de usuario en el almacenamiento local
    localStorage.setItem("user", JSON.stringify(user));
    // cambiamos el valor de isLogged a true por ende si se logro loguear
    console.log("se creo el token y su refresh");
    setIsLogged(true);
  };

  // esta sera para destruir los datos almacenados en el almacenamiento local
  const logout = () => {
    // removemos el token origial
    localStorage.removeItem("token");
    // removemos el refresh token
    localStorage.removeItem("refreshToken");
    //removemos los datos del usuario
    localStorage.removeItem("user");
    // retornamos que el login es falso, es decir que no tiene la sesion abierta
    setIsLogged(false);
  };

  //retornamos la etiqueta que generamos con el contexto y que tiene los valores de
  // isLogged, login, logout  y loading
  // cuales pueden tener elementos adentro
  const value = useMemo(() => ({ isLogged, login, logout }), [isLogged]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
