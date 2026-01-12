// Bienvenida
function guardarNombre(){
  const nombre=document.getElementById("nombreUsuario").value;
  localStorage.setItem("usuarioNombre",nombre);
  alert(`Encantado de conocerte, ${nombre} 🌸`);
  abrirDiario();
}
function abrirDiario(){
  document.getElementById("bienvenida").style.display="none";
  document.getElementById("menu").style.display="flex";
  document.getElementById("seijaku").classList.add("active");
}
function iniciarVoz(){
  const reconocimiento=new(window.SpeechRecognition||window.webkitSpeechRecognition)();
  reconocimiento.lang="es-ES";
  reconocimiento.start();
  reconocimiento.onresult=(event)=>{
    const texto=event.results[0][0].transcript.toLowerCase();
    if(texto.includes("abrir mi diario")){
      const nombre=localStorage.getItem("usuarioNombre")||"amigo";
      alert(`Bienvenido de nuevo, ${nombre} 🌸`);
      abrirDiario();
    }
  };
}
window.onload=()=>{
  const nombre=localStorage.getItem("usuarioNombre");
  if(nombre){
    document.querySelector("#bienvenida h1").textContent=`🌸 Bienvenido, ${nombre}`;
  }
};

// Navegación
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
  });
});

// 🧘 Respiración
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

// 🚦 Semáforo emocional
function registrarEstado(color){
  const estados={verde:"Tranquilo",amarillo:"Inquieto",azul:"Reflexivo",rojo:"Triste"};
  const registro={fecha:new Date().toLocaleDateString(),estado:color,significado:estados[color]};
  const lista=JSON.parse(localStorage.getItem("emociones")||"[]");
  lista.push(registro);
  localStorage.setItem("emociones",JSON.stringify(lista));
  alert(`Estado registrado: ${estados[color]}`);
  guardarRacha("emociones");
}

// 💰 Decisiones
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

// ✉️ Visión futura
function guardarVision(){
  const texto=document.getElementById("vision-texto").value;
  const carta={fecha:new Date().toLocaleDateString(),contenido:texto};
  const lista=JSON.parse(localStorage.getItem("visionFutura")||"[]");
  lista.push(carta);
  localStorage.setItem("visionFutura",JSON.stringify(lista));
  alert("Carta guardada ✉️");
}

// 🎨 Poemas
function guardarPoema(){
  const texto=document.getElementById("poema-texto").value;
  const poema={fecha:new Date().toLocaleDateString(),texto};
  const lista=JSON.parse(localStorage.getItem("poemas")||"[]");
  lista.push(poema);
  localStorage.setItem("poemas",JSON.stringify(lista));
  alert("Poema guardado 🎨");
  guardarRacha("poemas");
}

// 🎨 Dibujo
const canvas=document.getElementById("lienzo");
const ctx=canvas.getContext("2d");
let dibujando=false;
canvas.addEventListener("mousedown",()=>dibujando=true);
canvas.addEventListener("mouseup",()=>dibujando=false);
canvas.addEventListener("mousemove",e=>{
  if(!dibujando) return;
  ctx.fillStyle="black";
  ctx.fillRect(e.offsetX,e.offsetY,2,2);
});

// 💬 Inspiración
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

// 📊 Gráficos
function dibujarGraficos(){
  const emociones=JSON.parse(localStorage.getItem("emociones")||"[]");
  const decisiones=JSON.parse(localStorage.getItem("decisiones")||"[]");

  const ctx1=document.getElementById("graficoEmociones").getContext("2d");
  new Chart(ctx1,{
    type:"bar",
    data:{
      labels:emociones.map(e=>e.fecha),
      datasets:[{label:"Emociones",data:emociones.map(e=>e.estado.length),backgroundColor:"rgba(59,181,167,0.6)"}]
    }
  });

  const ctx2=document.getElementById("graficoDecisiones").getContext("2d");
  new Chart(ctx2,{
    type:"pie",
    data:{
      labels:["Deseos","Necesidades"],
      datasets:[{data:[decisiones.filter(d=>d.tipo==="deseo").length,decisiones.filter(d=>d.tipo==="necesidad").length],backgroundColor:["#f7c6d0","#3bb5a7"]}]
    }
  });
}

// 🌳 Logros
function guardarRacha(tipo){
  const rachas=JSON.parse(localStorage.getItem("rachas")||"{}");
  rachas[tipo]=(rachas[tipo]||0)+1;
  localStorage.setItem("rachas",JSON.stringify(rachas));

  if(rachas[tipo]===3){alert("🌟 Has desbloqueado: 'Tu calma es tu superpoder'");}
  if(rachas[tipo]===5){alert("🌟 Has desbloqueado: 'Cada día floreces más'");}
  if(rachas[tipo]===7){alert("🌟 Has desbloqueado: 'Tu serenidad inspira'");}
}
function mostrarLogros(){
  const rachas=JSON.parse(localStorage.getItem("rachas")||"{}");
  let html="<ul>";
  for(const tipo in rachas){
    html+=`<li>${tipo}: ${rachas[tipo]} días 🌱</li>`;
  }
  html+="</ul>";
  document.getElementById("logros-contenido").innerHTML=html;
}

// 🎯 Reto diario
function retoDiario(){
  const retos=["Hoy escribe 3 cosas que agradeces.","Haz un dibujo con tu emoción.","Describe un recuerdo feliz.","Escribe una carta a tu yo futuro."];
  const dia=new Date().getDate();
  const reto=retos[dia%retos.length];
  document.getElementById("reto").textContent=reto;
}

// 🎶 Personalización
function cambiarFondo(event){
  const file=event.target.files[0];
  const url=URL.createObjectURL(file);
  document.body.style.backgroundImage=`url(${url})`;
}
function cambiarColor(event){
  document.documentElement.style.setProperty('--teal',event.target.value);
}
function cargarMusica(event){
  const file=event.target.files[0];
  const url=URL.createObjectURL(file);
  const audio=document.getElementById("musica");
  audio.src=url;
  audio.play();
}
