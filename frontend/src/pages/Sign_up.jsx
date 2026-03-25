import { useState } from "react";
import "../assets/css/Sign.css";
import { useNavigate } from "react-router-dom";

import { PasswordField, VerifyPassword } from "../components/UsePassword.jsx";
//password field es el componente del input de password con el icono de mostrar/ocultar
// verify password es la funcion que compara las dos contraseñas y devuelve si son iguales, la clase css y el mensaje de error
import SEO from './../components/seo.jsx';


function Sign_up() {
  const navigate = useNavigate();
  // iniciamos los valores de Password y ConfirmPassword en vacio
  let [Password, setPassword] = useState("");
  let [ConfirmPassword, setConfirmPassword] = useState("");
  // los metemos en la funcion VerifyPassword para obtener si son iguales, la clase css y el mensaje de error
  let [message, setMessage] = useState("");
  const { isSame, confirmedClass, action } = VerifyPassword(
    Password,
    ConfirmPassword
  );

  // funcion que se ejecuta al enviar el formulario
  async function handleSubmit(e) {
    e.preventDefault(); // para que no se recargue la pagina
    if (!isSame) {
      //// console.log("passwords are not the same");
      return;
    }
    let form = new FormData(e.currentTarget);
    // let data = {
    //   username: form.get("username"),
    //   email: form.get("email"),
    //   password: form.get("password"),
    //   confirm_password: form.get("confirm_password"),
    // }; es igual a Object.fromEntries(form.entries())
    try {
      //// console.log("submitting form");

      let res = await fetch(
        "/yourtree/api/sign-up?role=1",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Object.fromEntries(form.entries())),
        }
      );
      let data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return setMessage(data.message || "Register failed");
      }

      if (res.ok) {
        //// console.log("REGISTER OK:", data);
        navigate("/sign_in");
        return setMessage("");
      }
      return setMessage("something was wrong");
    } catch (error) {
      // console.error(error);
      return setMessage("Network error");
    }
  }

  return (
    <main id="main_sign">
<SEO 
  title="Sign Up - YourTree Link in Bio"
  description="Create free YourTree account and start building your custom link page."
/>
      <section id="sign">
        <section id="message_sign">
          <h2>Hello there</h2>
        </section>
        <section>
          <form id="form_sign" onSubmit={handleSubmit}>
            <label htmlFor="username">Username :*</label>
            <input type="text" name="username" id="username" required />
            <label htmlFor="email">Email :*</label>
            <input type="email" name="email" id="email" required />
            <label htmlFor="password">Password :*</label>
            <PasswordField
              id={"password"}
              name={"password"}
              value={Password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <label htmlFor="confirm_password">Confirm Password :*</label>
            <PasswordField
              id={"confirm_password"}
              name={"confirm_password"}
              value={ConfirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              extraClass={confirmedClass}
            />
            {(message || action) && (
              <p className="error">{message || action}</p>
            )}
            <input type="submit" disabled={!isSame} />
          </form>
        </section>
      </section>
    </main>
  );
}
export default Sign_up;
