// ==================== Bienvenida con nombre y contraseña ====================
function guardarCredenciales(){
  const nombre=document.getElementById("nombreUsuario").value;
  const clave=document.getElementById("claveUsuario").value;
  if(nombre && clave){
    localStorage.setItem("usuarioNombre",nombre);
    localStorage.setItem("usuarioClave",clave);
    alert("Credenciales guardadas 🌸");
  } else {
    alert("Por favor escribe nombre y contraseña.");
  }
}

function iniciarSesion(){
  const nombre=document.getElementById("nombreUsuario").value;
  const clave=document.getElementById("claveUsuario").value;
  const nombreGuardado=localStorage.getItem("usuarioNombre");
  const claveGuardada=localStorage.getItem("usuarioClave");

  if(nombre===nombreGuardado && clave===claveGuardada){
    abrirDiario();
    alert(`Bienvenido de nuevo, ${nombre} 🌸`);
  } else {
    alert("Nombre o contraseña incorrectos ❌");
  }
}

// ==================== Abrir diario con sonido y overlay ====================
function abrirDiario(){
  document.getElementById("bienvenida").style.display="none";
  document.getElementById("menu").style.display="flex";
  document.getElementById("seijaku").classList.add("active");
  const sonido=document.getElementById("sonido-apertura");
  if(sonido){ sonido.play().catch(()=>{}); }
}

// Botón "Hoy no"
function entrarHoyNo(){
  abrirDiario();
  alert("Hoy no hiciste actividades, y está bien 🫶");
}

// ==================== Voz con reconocimiento ====================
function iniciarVoz(){
  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!Recognition){ alert("Tu navegador no soporta reconocimiento de voz."); return; }
  const reconocimiento=new Recognition();
  reconocimiento.lang="es-ES";
  reconocimiento.interimResults=false;
  reconocimiento.maxAlternatives=1;
  reconocimiento.start();

  reconocimiento.onresult=(event)=>{
    const texto=event.results[0][0].transcript.trim().toLowerCase();
    const confianza=event.results[0][0].confidence;
    const comandoValido=texto.includes("abrir mi diario")||texto.includes("abrir diario");

    if(comandoValido && confianza>=0.6){
      mostrarCarga(true);
      setTimeout(()=>{
        mostrarCarga(false);
        const claveIngresada=prompt("Diario protegido 🌸. Escribe tu contraseña:");
        const claveGuardada=localStorage.getItem("usuarioClave");
        if(claveIngresada===claveGuardada){
          abrirDiario();
        } else {
          alert("Contraseña incorrecta ❌");
        }
      },1200);
    } else {
      alert("No se reconoció tu voz. Escribe tu nombre y contraseña para continuar.");
    }
  };
  reconocimiento.onerror=()=>alert("Hubo un problema con la voz. Inténtalo de nuevo.");
}

function mostrarCarga(estado){
  const ov=document.getElementById("overlay-cargando");
  if(!ov) return;
  ov.classList.toggle("active",!!estado);
}

// ==================== Navegación ====================
const buttons=document.querySelectorAll("nav button");
const sections=document.querySelectorAll("section");
buttons.forEach(btn=>{
  btn.addEventListener("click",()=>{
    buttons.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    sections.forEach(sec=>sec.classList.remove("active"));
    document.getElementById(btn.dataset.target).classList.add("active");

    if(btn.dataset.target==="progreso"){dibujarGraficos();}
    if(btn.dataset.target==="logros"){mostrarLogros();}
    if(btn.dataset.target==="retos-fuera"){generarRetoFuera();}
  });
});

// ==================== Seijaku ====================
function iniciarRespiracion(){
  const pasos=["Respira... 2","Sostén... 2","Exhala... 4"];
  let i=0;
  const texto=document.getElementById("respiracion-texto");
  texto.textContent="Comenzando...";
  const intervalo=setInterval(()=>{
    texto.textContent=pasos[i];
    i++;
    if(i>=pasos.length){
      clearInterval(intervalo);
      texto.textContent="Ejercicio completado 🌿";
      guardarRacha("respiracion");
    }
  },3000);
}

// Emojis emocionales (no se guardan)
function mostrarEmoji(emoji){
  document.getElementById("emoji-seleccion").textContent=`Hoy elegiste ${emoji}. Eso también cuenta 🌱`;
}

// Temporizador libre
function iniciarTemporizador(segundos){
  const cont=document.getElementById("temporizador");
  cont.textContent=`⏳ Tiempo iniciado: ${segundos} segundos`;
  setTimeout(()=>{
    cont.textContent="Gracias por quedarte un momento 🌱";
  },segundos*1000);
}

// ==================== Entelequia ====================
function guardarDecision(){
  const texto=document.getElementById("decision-texto").value;
  const tipo=document.getElementById("decision-tipo").value;
  const registro={fecha:new Date().toLocaleDateString(),texto,tipo};
  const lista=JSON.parse(localStorage.getItem("decisiones")||"[]");
  lista.push(registro);
  localStorage.setItem("decisiones",JSON.stringify(lista));
  alert("Decisión guardada 💡");
  guardarRacha("decisiones");
}

function guardarVision(){
  const texto=document.getElementById("vision-texto").value;
  const carta={fecha:new Date().toLocaleDateString(),contenido:texto};
  const lista=JSON.parse(localStorage.getItem("visionFutura")||"[]");
  lista.push(carta);
  localStorage.setItem("visionFutura",JSON.stringify(lista));
  alert("Carta guardada ✉️");
}

// ==================== Yūgen ====================
function guardarPoema(){
  const texto=document.getElementById("poema-texto").value;
  const poema={fecha:new Date().toLocaleDateString(),texto};
  const lista=JSON.parse(localStorage.getItem("poemas")||"[]");
  lista.push(poema);
  localStorage.setItem("poemas",JSON.stringify(lista));
  alert("Poema guardado 🎨");
  guardarRacha("poemas");
}

// 🎨 Dibujo con soporte táctil
const canvas=document.getElementById("lienzo");
if(canvas){
  const ctx=canvas.getContext("2d");
  let dibujando=false;

  // Mouse
  canvas.addEventListener("mousedown",()=>dibujando=true);
  canvas.addEventListener("mouseup",()=>dibujando=false);
  canvas.addEventListener("mousemove",e=>{
    if(!dibujando) return;
    dibujar(ctx,e.offsetX,e.offsetY);
  });

  // Touch
  canvas.addEventListener("touchmove",e=>{
    const rect=canvas.getBoundingClientRect();
    const x=e.touches[0].clientX-rect.left;
    const y=e.touches[0].clientY-rect.top;
    dibujar(ctx,x,y);
  });
}

function dibujar(ctx,x,y){
  const color=document.getElementById("colorPincel").value;
  const grosor=document.getElementById("grosorPincel").value;
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.arc(x,y,grosor/2,0,Math.PI*2);
  ctx.fill();
}

// 🧹 Limpiar lienzo
function limpiarLienzo(){
  const ctx=canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

// 💾 Guardar dibujo como imagen
function guardarDibujo(){
  const dataUrl=canvas.toDataURL("image/png");
  const dibujos=JSON.parse(localStorage.getItem("dibujos")||"[]");
  dibujos.push(dataUrl);
  localStorage.setItem("dibujos",JSON.stringify(dibujos));
  mostrarGaleria();
  alert("Dibujo guardado 🎨");
}

// 📂 Mostrar galería de dibujos guardados
function mostrarGaleria(){
  const dibujos=JSON.parse(localStorage.getItem("dibujos")||"[]");
  const galeria=document.getElementById("galeria-dibujos");
  galeria.innerHTML="";
  dibujos.forEach((img,i)=>{
    const imagen=document.createElement("img");
    imagen.src=img;
    imagen.style.width="120px";
    imagen.style.margin="5px";
    imagen.title=`Dibujo ${i+1}`;
    galeria.appendChild(imagen);
  });
}
window.addEventListener("load",mostrarGaleria);

function sugerirFrase(){
  const frases=["Tu calma es tu superpoder.","Respira, todo puede esperar.","Cada palabra que escribes es un pétalo."];
  const frase=frases[Math.floor(Math.random()*frases.length)];
  document.getElementById("inspiracion").textContent=frase;
}
function sugerirManualidad(){
  const ideas=["Haz un collage con revistas viejas.","Crea una pulsera con hilos.","Pinta un frasco como lámpara.","Origami de grullas."];
  const idea=ideas[Math.floor(Math.random()*ideas.length)];
  document.getElementById("inspiracion").textContent=idea;
}

// ====================
