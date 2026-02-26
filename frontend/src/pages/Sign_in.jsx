import "../assets/css/Sign.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PasswordField } from "../components/usePassword.jsx";
import { useAuth } from "../components/auth.jsx";

function Sign_in() {
  const { login } = useAuth();
  const navigate = useNavigate();
  let [message, setMessage] = useState("");
  let [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault(); // para que no se recargue la pagina
    let form = new FormData(e.currentTarget);
    let username_or_email = form.get("username_or_email");
    let passwd = form.get("password");
    // console.log(e);  console.log(form);  console.log(username_or_email); console.log(password);
    try {
      let res = await fetch("/yourtree/api/sign-in/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username_or_email,
          password: passwd,
        }),
      });

      let data = await res.json().catch(() => ({}));
      // usamos el catch(() => ({})) para que si el back da un error o envia HTML no se rompa el front
      if (!res.ok) {
        return setMessage(data.message || "Login failed");
      }
      if (res.ok) {
        // console.log("LOGIN OK:", data);
        // return setMessage(data.message)
        login(data.accessToken, data.refreshToken, data.user);

        navigate("/home");
        return setMessage("");
      }
      return setMessage("something was wrong");
    } catch (error) {
      console.error(error);
      return setMessage("Network error");
    }
  }
  return (
    <main id="main_sign">
      <section id="sign">
        <section>
          <form id="form_sign" onSubmit={handleSubmit} method="POST">
            <label htmlFor="username_or_email">Username / Email :*</label>
            <input
              type="text"
              name="username_or_email"
              id="username_or_email"
              required
            />
            <label htmlFor="password">Password :*</label>
            <PasswordField
              id={"password"}
              name={"password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {message && <p className="error">{message}</p>}
            <input type="submit" value="sing_in" />
          </form>
        </section>
        <section id="message_sign">
          <h2> Hello again, I can see that you want use your accont </h2>
        </section>
      </section>
    </main>
  );
}
export default Sign_in;
