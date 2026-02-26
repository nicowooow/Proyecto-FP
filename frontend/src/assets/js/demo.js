document.querySelectorAll('.view').forEach(view =>{
    view.addEventListener('mouseover',e=>{
        let id_tag_parent = view.closest('[id^="demo_"]');
        const description = id_tag_parent.querySelector('.description');

        if (e.target !== view) {
            let tag = e.target.tagName;
            // Accede a la sección description correspondiente
            if(tag == "IMG"){
            //description.innerHTML = `esta es una imagen de referencia, la cual `;

            }else if(tag == "H1"){
            //description.innerHTML = ``;

            }else if(tag == "P"){
            //description.innerHTML = `esta es un parrafo de referencia`;

            }else if(tag =="A"){
            //description.innerHTML = `esta es un enlace de referencia`;

            }else if(tag == "SECTION"){
            //description.innerHTML = `esta es una seccion de referencia`;

            }else if(tag == "DIV"){
            //description.innerHTML = `esta es una division de referencia`;

            }
        }

    })
})

