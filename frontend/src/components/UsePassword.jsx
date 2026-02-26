import { useState } from "react";

// creamos una funcion para generar una etiqueta de input de las contraseñasa 
// con su dicho boton para convertirlo a texto plano y viceversa 
// necesitaremos el id, name,value,una funcion cuando cambia y una clase extra 
// por ejemplo para poner otro css si esta mal hecha 
export function PasswordField({
  id,
  name,
  value = "",
  onChange,
  extraClass = "",
}) {
  const [showPassword, setShowPassword] = useState(false);
  // variables las cuales son booleans, nos indicara si usar el text o password segun su valor
  // false nos indica password

  return (
    <div>
      <input
        type={showPassword ? "text" : "password"}
        id={id}
        name={name}
        autoComplete="off"
        className={`${extraClass}`}
        value={value} // <- valor viene del padre
        onChange={onChange} // <- cambio lo maneja el padre
        required
      />
      <button
        type="button"
        className="show_passwd" // mismo estilo del ojo
        onClick={() => setShowPassword((prev) => !prev)}// invierte el valor que tiene 
        aria-label={showPassword ? "Hide password" : "Show password"}
        aria-pressed={showPassword}
      >
        &#x1F441;
      </button>
    </div>
  );
}

// funcion para verificar si las contraseñas son iguales solo en el frontend, el cual nos permitira el poder enviar la contraseña
export function VerifyPassword(password, confirmPassword) {
  // console.log(password, confirmPassword);
  
  // si son iguales nos da true , sino false. 
  // se que es algo repetitivo pero para dejarlo en claro o si ocurre un bug lo pongo asi
  let isSame = (password === confirmPassword)?true:false;

  // nos envia el nombre de la clase si es declinada o no
  let confirmedClass = isSame ? "" : "declined";
  // para enviar un mensaje segun si son iguales o no
  let action = isSame ? "" : "passwords are not equals";
  // console.log(isSame,confirmedClass,message)
  return { isSame, confirmedClass, action };
}
