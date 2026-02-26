import './../assets/css/loader.css'
import './../assets/js/loader.js'
import React, { useEffect, useRef, useState, useMemo } from 'react';
function Loader() {
    // cuando ponermos el nombre de la variable,setVariable es porque el valor se guarda en la inicial y los cambios lo hacemos con el set
    let [width, setWidth] = useState(0); //aqui guardaremos las cosas para cuando cambie el ancho
    let [loading, setLoading] = useState(true) // lo mismo que arriba, solo que ahora es para mostrarlo o no
    let [idx, setIdx] = useState(0);//esto lo usaremos para el indice de la palabra loading
    let text = "loading ...";
    const letters = useMemo(() => text.split(""), [text]); // partimos la palabra en letras y lo metemos en un array
    let intervalRef = useRef(null);// segun AI sirve para guardar información entre renders del componente sin causar renderizados extra
    useEffect(() => {
        let navegation = performance.getEntriesByType('navegation');//esto nos da los datos del rendimiento en la navegacion los cuales podemos sacar el tiempo de carga de la pagina
        let load_time = (navegation?.loadEventEnd - navegation?.LoadStart) / 1000;// el ? entre los nave.. es para la condicional si tiene me da el primero, sino me da indefinido para no romper el programa o en este caso el temporizador
        intervalRef.current = setInterval(() => {
            setWidth(prevWidth => {
                if (prevWidth >= 100) {
                    clearInterval(intervalRef.current);
                    setLoading(false);
                    document.body.style.overflow = 'auto';
                    return prevWidth;
                } else {
                    document.body.style.overflow = 'hidden';
                    return prevWidth + 1;
                }
            });
            setIdx(prevInx => (prevInx + 1) % letters.length);//hace el cambio de letra por cada salto 
        }, load_time);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current); //Ese temporizador sigue activo aunque el componente deje de usarse, a menos que lo detengas manualmente con clearInterval
            document.body.style.overflow = 'auto';
        }
    });
    if (!loading) return null; // cuando termine de realizar el loading ya no se muestra
    return (
        <section id="loader" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', zIndex: 9999, }}>
            <div className="text_load" id="spinner_js">
                {letters.map((l,i)=> <span key={i} className={i===idx ? 'jump':''}>{l}</span>)
                //con el map intineramos el array
                }
            </div>
            <div id="loading-bar" style={{ height: '10px', width:`${width}%`, background: 'var(--color-acento)', transition: 'width 0.3s' }}>
            </div>
        </section>
    )
}
export default React.memo(Loader);