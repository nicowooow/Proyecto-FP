import React, { useEffect, useState, useMemo } from "react";

import "./../assets/css/header.css";
import Logo_yourtree from "../assets/YourTree.svg";
import { Link } from "react-router-dom";
import {
  HeaderScroll,
  HeaderPageEffect,
  handleLinkClick,
  useClickOutside,
} from "../assets/js/header-js.jsx";
import ThemeToggle from "../assets/js/ThemeToggle.jsx";
// import { verifyToken } from "./token.jsx";
import { useAuth } from "../components/auth.jsx";

function Header() {
  // sacamos la funciones de autenticacion, para que el header obtenga la un estado
  // true o false y saber que opciones mostrar
  const { isLogged } = useAuth(); // esto nos servira para usarlo con las tokens
  //const isLogged = true; // esto nos servira para la prueba rapida
  /*esto estaba en ela parte del primer a ( el que contiene la imagen )index.html*/
  let [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  //luego nos dira si esta logueado o no, si esta me da si es false me saldra la opcion de logins y si no me dara el de perfil y cerrar sesion
  // los paths que ponemos
  //el tamaño de la pantalla va a determinar como se vera
  const [Movile, setMobile] = useState(window.innerWidth <= 768);

  // usamos un efecto el cual se ejecutara siempre que cambie el tamaño de la pantalla
  useEffect(() => {
    // esto lo estamos usando para el responsive del ancho de la pagina
    const handleResize = () => {
      setMobile(window.innerWidth <= 768);
      // console.log(window.innerWidth <= 768);
    };

    //al ejercutar agrega un evento el cuial es la funcion que hicimos arriba
    window.addEventListener("resize", handleResize);
    // lo retorna quitando el evento para que no tenga problemas o duplicaciones
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useClickOutside(mobileMenuOpen, () => setMobileMenuOpen(false), "header");

  if (Movile) {
    return (
      <header>
        {/*esta es la parte izquierda de header */}
        <div className="header-glass-background">
          <nav id="header">
            <section className="left_header">
              <Link className="Links" to="/" id="my_logo">
                <img src={Logo_yourtree} alt="logo YourTree" />
              </Link>
            </section>
            {/*esta es la parte derecha de header */}
            <section className="right_header">
              <ThemeToggle />
              <button
                className={`menu ${mobileMenuOpen ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
              >
                {/* boton para desplegar el menu */}
                <span></span>
                <span></span>
                <span></span>
              </button>

              <div className={`mobile_menu ${mobileMenuOpen ? "open" : ""}`}>
                {/* nos indicara si el menu esta abierto o no */}
                <div className="mobile_menu_content">
                  <div className="mobile_nav_section">
                    <h3>Navigation</h3>
                    <Link
                      className="mobile-link"
                      to="Home"
                      onClick={handleLinkClick}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      Home
                    </Link>
                    <Link
                      className="mobile-link"
                      to="Top_Pages"
                      onClick={handleLinkClick}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      Top Pages
                    </Link>
                    <Link
                      className="mobile-link"
                      to={isLogged ? "YourTree" : "Templates"}
                      onClick={handleLinkClick}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                      {isLogged ? "YourTree" : "Templates"}
                    </Link>
                    <Link
                      className="mobile-link"
                      to="Forums"
                      onClick={handleLinkClick}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      Forums
                    </Link>

                  </div>

                  <div className="mobile_nav_divider"></div>

                  <div className="mobile_nav_section">
                    <h3>Account</h3>
                    {isLogged ? (
                      <>
                        <Link
                          className="mobile-link"
                          to="Profile"
                          onClick={handleLinkClick}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          Profile
                        </Link>
                        <Link
                          className="mobile-link"
                          to="Log-out"
                          onClick={handleLinkClick}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                          Logout
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          className="mobile_link highlight"
                          to="Sign_in"
                          onClick={handleLinkClick}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <polyline points="10 17 15 12 10 7" />
                            <line x1="15" y1="12" x2="3" y2="12" />
                          </svg>
                          Sign in
                        </Link>
                        <Link
                          className="mobile_link highlight"
                          to="Sign_up"
                          onClick={handleLinkClick}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="8.5" cy="7" r="4" />
                            <line x1="20" y1="8" x2="20" y2="14" />
                            <line x1="23" y1="11" x2="17" y2="11" />
                          </svg>
                          Sign up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </nav>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="mobile_menu_overlay"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        )}
        <HeaderScroll />
      </header>
    );
  } else {
    return (
      <header>
        <div className="header_glass_background">
          <nav id="header">
            <section className="left_header">
              <Link className="Links" to="/" id="my_logo">
                <img src={Logo_yourtree} alt="logo YourTree" />
              </Link>
              <Link className="Links" to="Home">
                Home
              </Link>
              <Link className="Links" to="Top_Pages">
                Top Pages
              </Link>
              <Link className="Links" to={isLogged ? "YourTree" : "Templates"}>
                {isLogged ? "YourTree" : "Templates"}
              </Link>
              <Link className="Links" to="Forums">
                Forums
              </Link>

            </section>

            <section className="right_header">
              {isLogged ? (
                <>
                  <Link className="Links" to="Profile">
                    Profile
                  </Link>
                  <Link className="Links" to="Log_out">
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link className="Links" to="Sign_in">
                    Sign in
                  </Link>
                  <Link className="Links" to="Sign_up">
                    Sign up
                  </Link>
                </>
              )}
              <ThemeToggle />
            </section>
          </nav>
        </div>
        <HeaderPageEffect />
        <HeaderScroll />
      </header>
    );
  }
}
export default React.memo(Header);
