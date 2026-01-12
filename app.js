// ---------------------------
// Navegación entre secciones
// ---------------------------
const buttons = document.querySelectorAll("nav button");
const sections = document.querySelectorAll("section");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    sections.forEach(sec => sec.classList.remove("active"));
    document.getElementById(btn.dataset.target).classList.add("active");
  });
});

// ---------------------------
// Función para agregar tarjetas
// ---------------------------
function addCard(section) {
  const container = document.getElementById("cards-" + section);
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h3>Nueva página</h3>
    <textarea placeholder="Escribe aquí..."></textarea>
  `;
  container.appendChild(card);
}

// ---------------------------
// 🧘 Seijaku — Núcleo emocional
// ---------------------------

// Botón de pausa con respiración guiada
function iniciarRespiracionGuiada() {
  alert("Inhala contando hasta 4... Sostén 2... Exhala 6... Repite 3 veces 🧘");
}

// Semáforo emocional con registro en localStorage
function registrarEstadoEmocional(color) {
  const entrada = {
    fecha: new Date().toLocaleString(),
    estado: color
  };
  const registros = JSON.parse(localStorage.getItem("semaforo") || "[]");
  registros.push(entrada);
  localStorage.setItem("semaforo", JSON.stringify(registros));
  alert(`Estado registrado: ${color} 🚦`);
}

// Minuto Zen con temporizador
function iniciarMinutoZen() {
  let segundos = 60;
  const intervalo = setInterval(() => {
    console.log(`Quedan ${segundos} segundos`);
    segundos--;
    if (segundos < 0) {
      clearInterval(intervalo);
      alert("Tu Minuto Zen ha terminado 🌙");
    }
  }, 1000);
}

// ---------------------------
// 🌟 Entelequia — Sueños y economía consciente
// ---------------------------

// Analizar decisiones económicas
function analizarDecision(texto) {
  if (texto.includes("necesito") || texto.includes("urgente")) {
    alert("Esto parece una necesidad 💡");
  } else if (texto.includes("quiero") || texto.includes("me gusta")) {
    alert("Esto parece un deseo ✨ ¿Es emocional?");
  } else {
    alert("Reflexiona: ¿nace de emoción o necesidad?");
  }
}

// Guardar metas en localStorage
function guardarMeta(meta) {
  const metas = JSON.parse(localStorage.getItem("metas") || "[]");
  metas.push({ meta, fecha: new Date().toLocaleDateString() });
  localStorage.setItem("metas", JSON.stringify(metas));
  alert("Meta guardada 🌟");
}

// ---------------------------
// 🎨 Yūgen — Arte y poesía
// ---------------------------

// Frases inspiradoras aleatorias
function sugerirFraseInspiradora() {
  const frases = [
    "Tu calma es tu superpoder.",
    "Hoy puedes crear algo que nunca existió.",
    "Respira. Todo lo demás puede esperar.",
    "Tu tristeza también merece ternura.",
    "Cada palabra que escribes es un pétalo en tu jardín interior."
  ];
  const aleatoria = frases[Math.floor(Math.random() * frases.length)];
  alert(aleatoria);
}

// Guardar poemas o reflexiones
function guardarPoema(texto) {
  const poemas = JSON.parse(localStorage.getItem("poemas") || "[]");
  poemas.push({ texto, fecha: new Date().toLocaleString() });
  localStorage.setItem("poemas", JSON.stringify(poemas));
  alert("Poema guardado 🎨");
}
