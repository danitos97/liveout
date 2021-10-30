
const btnIniciar = document.querySelector("#btnIniciar"),
      portada    = document.querySelector("#portada"),
      main       = document.querySelector("main"),
      nav        = document.querySelector("nav"),

    navInicio    = document.querySelector("nav #ini > div"),
    navTenden    = document.querySelector("nav #tende > div"),
    navMapa      = document.querySelector("nav #mapa > div"),
    navCuenta    = document.querySelector("nav #cuenta > div"),

    divPrincipal = document.getElementById("principal"),

    spanArtista  = document.getElementById("nombre-artista"),
    imgArtista   = document.getElementById("img-artista"),
    btnSeguir    = document.getElementById("btn-seguir"),
    spanCanciones= document.getElementById("canciones-artista"),
    btnRegresar  = document.getElementById("btn-regresar"),

    divMapa      = document.getElementById("div-mapa"),
    divCuenta    = document.getElementById("div-cuenta"),

    puntosMapa  = document.querySelectorAll("#puntos-mapa > div"),
    modalMapa   = document.getElementById("modal-mapa"),
    btnCerrarModal=document.getElementById("cerrar-modal"),
    btnIrEvento = document.getElementById("btn-ir-evento"),

    tam = Object.keys(canciones).length,

    volumen = .7;

   


let orden = null;

ordenar();
mezclar();

function ordenar(){
    let c = 0;
    orden = Array.from({length: tam},() => (c++));
}

function mezclar(){
    for(let i = 0; i < tam - 1; i++){
        const aux = orden[i];
        const rand = getRand(i, tam - 1);
        orden[i] = orden[rand];
        orden[rand] = aux;
    }
}

function getRand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + parseInt(min);
}

let likes = null;
function generarLikes(){
    likes = Array.from({length: tam},() => (getRand(100,1000)));
}

generarLikes();
generarElementos();

function generarElementos(){
    
    let elementos = "";
    for(let i = 0; i < tam; i++){
        const song = canciones[orden[i]];
        //`<div style="background-color: ${i % 2 == 0? 'lightskyblue':'lightsalmon'}">
        elementos +=    
            `<div style="background-color: ${song.color}">
                <div class="contenedor-img">
                    <img src = "artistas/${song.artista}/${song.nombre}.jpg">
                </div>
                <div class="contenedor-datos">
                    <h2>${song.nombre}</h2>
                    <h3>${song.artista}</h3>
                    <br>
                    <div>
                        <span onclick=incrementar(this) likes = "${likes[i]}">
                            <img src ="images/me-gusta.png">${likes[i]}
                        </span>
                        <span><img src ="images/comentario.png">${Math.floor(likes[i] / 8)}</span>
                    </div>
                </div>
                
            </div>`;
    }
    divPrincipal.innerHTML = elementos;
}

function incrementar(span){
    const likes = parseInt(span.getAttribute("likes")) + 1;
    span.innerHTML = '<img src ="images/me-gusta-blue.png">'+ likes;
    span.setAttribute("class","liked");
}


cambiarArtista(0);

function cambiarArtista(i){
    const song = canciones[orden[i]];
    spanArtista.innerHTML = song.artista;
    imgArtista.src = `artistas/${song.artista}/${song.artista}.jpg`;
    btnSeguir.classList.remove("siguiendo");
    btnSeguir.classList.add("seguir");
    spanCanciones.innerHTML = "Mas canciones ("+ Math.ceil(parseInt(likes[orden[i]]) / 50) + ")";
}



let enReproduccion = null;

let arregloAudios = [];


function llenarArragloAudios(){
    for(let i = 0; i < tam; i++){
        const song = canciones[i];
        const audio = new Audio(`artistas/${song.artista}/${song.nombre}.mp3`);
        audio.volume = volumen;

        audio.play().then(function(){
            if(i !== orden[0])audio.pause();
            else {
                enReproduccion = audio;
                portada.style.display = "none";
                main.style.display = "block";
                nav.style.display = "grid";
            }
        });
        audio.onended = function(){moverHacia(1)};
        arregloAudios.push(audio);
    }
}

btnIniciar.addEventListener("click",function(){
    if(this.innerHTML == "<div><h3>INICIAR</h3></div>"){
        this.innerHTML = "cargando";
        llenarArragloAudios();
    }
    

});

function reproducir(i){
    if(enReproduccion !== arregloAudios[orden[i]]){
        enReproduccion.pause();
        arregloAudios[orden[i]].currentTime = 0;
        arregloAudios[orden[i]].play();
        
        // musica = new Audio(`artistas/${song.artista}/${song.nombre}.mp3`);  
        enReproduccion = arregloAudios[orden[i]];
    }
    
}

function moverHacia(i){
    let speed = "smooth";
    if(i == 0){
        speed = "auto";
        if(divPrincipal.scrollTop == 0){
            reproducir(0);
            cambiarArtista(0);
        }
        
    }
    divPrincipal.scroll({
        top: i > 0? (divPrincipal.scrollTop + divPrincipal.clientHeight) : 0,
        behavior: speed,
    });
}



var timer = null;
//Last rolling distance
var scrollTop = 0;
//Scrolling event start


divPrincipal.addEventListener('scroll', function () {
    clearInterval(timer);
    //Renew timer
    
    timer = setInterval(function () {
        if (divPrincipal.scrollTop == scrollTop) {
            //If the rolling distance is equal, the rolling stops
            clearInterval(timer);
            //... do what you want to do, such as callback processing
            const i = Math.floor(scrollTop / divPrincipal.clientHeight + .1);
            reproducir(i);
            cambiarArtista(i);

        } 
        else {
            scrollTop = divPrincipal.scrollTop;
            // if(enReproduccion != null) {
            //     enReproduccion.pause();
            //     enReproduccion = null;
            // }
        }
    }, 100);
});



btnRegresar.addEventListener("click",function(){
    moverPrincipal("smooth");
});


navInicio.addEventListener("click",function(){
    ocultarTodo();
    main.style.display = "block";
    mezclar();
    generarLikes();
    generarElementos();
    moverHacia(0);
    moverPrincipal("auto");
    
});

navTenden.addEventListener("click",function(){
    ocultarTodo();
    main.style.display = "block";
    ordenar();
    generarElementos();
    moverHacia(0);
    moverPrincipal("auto");
});

navMapa.addEventListener( "click" ,function(){
    ocultarTodo();
    divMapa.style.display = "block";
    enReproduccion.pause();
});

navCuenta.addEventListener("click",function(){
    ocultarTodo();
    divCuenta.style.display = "block";
    enReproduccion.pause();
});

function ocultarTodo(){
    main.style.display = "none";
    divCuenta.style.display = "none";
    divMapa.style.display = "none";
    modalMapa.style.display = "none";
}
function moverPrincipal(behavior){
    main.scroll({
        left:0,
        behavior:behavior,
    });
}

btnSeguir.addEventListener("click",function(){
    this.classList.remove("seguir");
    this.classList.add("siguiendo");
});



const  contenidoModal1 = `
        <div class="modal-header">
            <h2>Eminem</h2><div id="cerrar-modal" onclick="cerrarModal()">X</div>
        </div>
        <img src ="artistas/Eminem/Eminem.jpg">
        <br>
        <p>Tepatitlan de Morelos, Jal</p>
        <p>Praga Discoteca</p>
        <br>
        <p>Mañana a las 10:30 pm</p>
        <br>
        <p><span class="link">87 personas</span> confirmaron su asistencia</p>
        <br>
        <p>Entrada: <span class="link">Boletaje</span></p>
        <br>
        <div id="btn-ir-evento" class ="button ir" onclick="cambiarClase(this)">
            <span class="ir">Comprar Boletos</span>
            <span class="vas">Iras a este evento</span>
        </div>`,

    contenidoModal2 = `
        <div class="modal-header">
            <h2>Black Eyed Peas</h2><div id="cerrar-modal" onclick="cerrarModal()">X</div>
        </div>
        <img src ="artistas/Black Eyed Peas/Black Eyed Peas.jpg">
        <br>
        <p>Tepatitlán de Morelos, Jal</p>
        <p>Auditorio Hidalgo</p>
        <br>
        <p>Sabado, 21 de Noviembre a las 9:30 pm</p>
        <br>
        <p><span class="link">322 personas</span> confirmaron su asistencia</p>
        <br>
        <p>Entrada: <span class="link">Libre</span></p>
        <br>
        <div id="btn-ir-evento" class ="button ir" onclick="cambiarClase(this)">
            <span class="ir">Voy a este evento</span>
            <span class="vas">Iras a este evento</span>
        </div>`;

let alternar = true;

const nPuntos = puntosMapa.length;
for(let i = 0; i < nPuntos; i++){
    puntosMapa[i].addEventListener("click",function(){
        
        // btnIrEvento.classList.remove("vas");
        // btnIrEvento.classList.add("ir");
        modalMapa.innerHTML = alternar? contenidoModal1 : contenidoModal2;
        alternar = !alternar;

        modalMapa.style.display = "block";
    });
}
function cerrarModal(){
    modalMapa.style.display = "none";
}

function cambiarClase(btn){
    btn.classList.remove("ir");
    btn.classList.add("vas");
}

