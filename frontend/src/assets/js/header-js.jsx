// header-js.jsx
import { useEffect, useRef } from "react";

export function HeaderScroll() {
  const lastScrollY = useRef(window.scrollY);

  useEffect(() => {
    const header = document.querySelector("header");
    const DELTA = 3;      // mínimo de movimiento para considerar cambio
    const SHOW_AT_TOP = 80; // siempre mostrar si estamos cerca del top

    function handleScroll() {
      const current = window.scrollY;
      const diff = current - lastScrollY.current;

      // Siempre mostrar si estamos casi arriba
      if (current < SHOW_AT_TOP) {
        header.classList.remove("header-hidden");
      } else {
        // Scroll hacia abajo suficiente → ocultar
        if (diff > DELTA) {
          header.classList.add("header-hidden");
        }
        // Scroll hacia arriba suficiente → mostrar
        else if (diff < -DELTA) {
          header.classList.remove("header-hidden");
        }
      }

      lastScrollY.current = current;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}


export function HeaderPageEffect() {
  useEffect(() => {
    let links = document.querySelectorAll("#header .Links:not(#my_logo)");
    const handler = (element) => {
      links.forEach((link) => link.classList.remove("active"));
      element.currentTarget.classList.add("active");
    };

    links.forEach((link) => {
      link.addEventListener("click", handler);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", handler);
      });
    };
  }, []);
  return null;
}
export function HeaderSmallScreen() {
  useEffect(() => {});
}

// Close menu when route changes
export function handleLinkClick() {
  setMobileMenuOpen(false);
}

export function useClickOutside(
  mobileMenuOpen,
  mobileMenuClose,
  selector = "header"
) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      const element = document.querySelector(selector);

      if (mobileMenuOpen && element && !element.contains(event.target)) {
        mobileMenuClose(); // aquí cierras el menú o haces lo que quieras
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen, mobileMenuClose, selector]);
}
