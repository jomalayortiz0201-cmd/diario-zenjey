// Utilidades de almacenamiento
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const get = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};

// 🎨 Restaurar fondo guardado al cargar
const fondoGuardado = localStorage.getItem("fondoZenjey");
if (fondoGuardado) {
  if (fondoGuardado.startsWith("url(")) {
    document.body.style.backgroundImage = fondoGuardado;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  } else {
    document.body.style.background = fondoGuardado;
  }
}

// 🎨 Selector de color
const colorPicker = document.getElementById("colorPicker");
colorPicker.addEventListener("input", function () {
  document.body.style.backgroundColor = colorPicker.value;
  localStorage.setItem("fondoZenjey", colorPicker.value);
});

// 🎨 Menú de estilos
const estiloFondo = document.getElementById("estiloFondo");
const aplicarFondo = document.getElementById("aplicarFondo");

aplicarFondo.addEventListener("click", function () {
  const seleccion = estiloFondo.value;

  if (seleccion === "solido") {
    document.body.style.backgroundColor = "#f0f4f8";
    localStorage.setItem("fondoZenjey", "#f0f4f8");
  } else if (seleccion === "gradiente") {
    const gradiente = "linear-gradient(135deg, #38bdf8, #0f172a)";
    document.body.style.background = gradiente;
    localStorage.setItem("fondoZenjey", gradiente);
  }
});

// 🎨 Subir imagen desde galería
const imagenFondo = document.getElementById("imagenFondo");
imagenFondo.addEventListener("change", function () {
  const archivo = imagenFondo.files[0];
  if (archivo) {
    const lector = new FileReader();
    lector.onload = function (e) {
      const imagenData = `url('${e.target.result}')`;
      document.body.style.backgroundImage = imagenData;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
      localStorage.setItem("fondoZenjey", imagenData);
    };
    lector.readAsDataURL(archivo);
  }
});

// Botón de pausa y respiración
const pauseBtn = document.getElementById('pauseBtn');
const breathingGuide = document.getElementById('breathingGuide');
pauseBtn.addEventListener('click', () => {
  const steps = [
    'Inhala por la nariz (4 segundos)…',
    'Sostén el aire (4 segundos)…',
    'Exhala lentamente por la boca (6 segundos)…'
  ];
  let i = 0;
  breathingGuide.textContent = 'Pausa activa. Sigue la respiración…';
  const interval = setInterval(() => {
    breathingGuide.textContent = steps[i % steps.length];
    i++;
    if (i > steps.length * 3) {
      clearInterval(interval);
      breathingGuide.textContent = 'Listo. ¿Cómo te sientes ahora?';
    }
  }, 4000);
});

// Semáforo emocional
document.querySelectorAll('.light').forEach(btn => {
  btn.addEventListener('click', () => {
    const emotion = btn.dataset.emotion;
    const log = get('emotionLog', []);
    log.push({ emotion, ts: Date.now() });
    save('emotionLog', log);
    breathingGuide.textContent = `Marcaste: ${emotion}.`;
  });
});

// Comparación antes/después
const beforeEmotion = document.getElementById('beforeEmotion');
const afterEmotion = document.getElementById('afterEmotion');
const saveComparison = document.getElementById('saveComparison');
const comparisonMsg = document.getElementById('comparisonMsg');

saveComparison.addEventListener('click', () => {
  const before = beforeEmotion.value;
  const after = afterEmotion.value;
  if (!before || !after) {
    comparisonMsg.textContent = 'Selecciona ambos estados para comparar.';
    return;
  }
  const comps = get('emotionComparisons', []);
  comps.push({ before, after, ts: Date.now() });
  save('emotionComparisons', comps);
  comparisonMsg.textContent = 'Comparación guardada con éxito.';
});

// Minuto Zen
const timerDisplay = document.getElementById('timerDisplay');
const startTimer = document.getElementById('startTimer');
const resetTimer = document.getElementById('resetTimer');
let timerInterval = null;
let remaining = 60;

const renderTimer = () => {
  const m = String(Math.floor(remaining / 60)).padStart(2, '0');
  const s = String(remaining % 60).padStart(2, '0');
  timerDisplay.textContent = `${m}:${s}`;
};

startTimer.addEventListener('click', () => {
  clearInterval(timerInterval);
  remaining = 60;
  renderTimer();
  timerInterval = setInterval(() => {
    remaining--;
    renderTimer();
    if (remaining <= 0) {
      clearInterval(timerInterval);
      timerDisplay.textContent = '00:00';
    }
  }, 1000);
});
resetTimer.addEventListener('click', () => {
  clearInterval(timerInterval);
  remaining = 60;
  renderTimer();
});

// Gestión de la tristeza
const sadWriting = document.getElementById('sadWriting');
const saveSadWriting = document.getElementById('saveSadWriting');
const sadMsg = document.getElementById('sadMsg');

saveSadWriting.addEventListener('click', () => {
  const text = sadWriting.value.trim();
  if (!text) { sadMsg.textContent = 'Escribe algo para guardar.'; return; }
  const entries = get('sadEntries', []);
  entries.push({ text, ts: Date.now() });
  save('sadEntries', entries);
  sadMsg.textContent = 'Reflexión guardada.';
  sadWriting.value = '';
});

// Modo calma
const calmMode = document.getElementById('calmMode');
const audioFile = document.getElementById('audioFile');
const playAudio = document.getElementById('playAudio');
const stopAudio = document.getElementById('stopAudio');
const calmAudio = document.getElementById('calmAudio');

// Cuando el usuario selecciona un archivo
audioFile.addEventListener('change', function () {
  const archivo = audioFile.files[0];
  if (archivo) {
    const lector = new FileReader();
    lector.onload = function (e) {
      calmAudio.src = e.target.result; // asigna el audio elegido
    };
    lector.readAsDataURL(archivo);
  }
});

// Botón reproducir
playAudio.addEventListener('click', () => {
  if (calmAudio.src) {
    calmAudio.volume = 0.3;
    calmAudio.loop = true;
    calmAudio.play();
  }
});

// Botón detener
stopAudio.addEventListener('click', () => {
  calmAudio.pause();
  calmAudio.currentTime = 0;
});

// Retos sin pantalla
const offlineChallenge = document.getElementById('offlineChallenge');
const challengeText = document.getElementById('challengeText');
const challenges = [
  'Camina 5 minutos y nombra 5 cosas nuevas que veas.',
  'Prepara una bebida caliente y escribe 3 gratitudes.',
  'Dibuja tu emoción como un paisaje.',
  'Ordena tu escritorio por 10 minutos con música tranquila.'
];
offlineChallenge.addEventListener('click', () => {
  const pick = challenges[Math.floor(Math.random() * challenges.length)];
  challengeText.textContent = pick;
});

// Economía consciente
const purchaseDesc = document.getElementById('purchaseDesc');
const purchaseType = document.getElementById('purchaseType');
const purchaseImportance = document.getElementById('purchaseImportance');
const savePurchase = document.getElementById('savePurchase');
const purchaseMsg = document.getElementById('purchaseMsg');
const feedbackPurchase = document.getElementById('feedbackPurchase');
const feedbackText = document.getElementById('feedbackText');

savePurchase.addEventListener('click', () => {
  const desc = purchaseDesc.value.trim();
  const type = purchaseType.value;
  const imp = purchaseImportance.value;
  if (!desc || !type || !imp) {
    purchaseMsg.textContent = 'Completa todos los campos.';
    return;
  }
  const purchases = get('purchases', []);
  purchases.push({ desc, type, imp, ts: Date.now() });
  save('purchases', purchases);
  purchaseMsg.textContent = 'Registro guardado.';
  purchaseDesc.value = '';
  purchaseType.value = '';
  purchaseImportance.value = '';
});

feedbackPurchase.addEventListener('click', () => {
  const last = (get('purchases', []).slice(-1)[0]);
  if (!last) { feedbackText.textContent = 'Registra una compra primero.'; return; }
  const tips = [];
  if (last.type === 'deseo') tips.push('Esto parece más un deseo que una necesidad.');
  if (last.imp === 'alta') tips.push('Si es importante, ¿puedes esperar 24 horas antes de decidir?');
  tips.push('¿Nace de una emoción o de una necesidad? Tómate un Minuto Zen y decide con calma.');
  feedbackText.textContent = tips.join(' ');
});

// Espacio libre + inspiración
const freeSpace = document.getElementById('freeSpace');
const saveFreeSpace = document.getElementById
// --- Sugerencias de manualidades ---
const suggestCraft = document.getElementById('suggestCraft');
const materials = document.getElementById('materials');
const craftText = document.getElementById('craftText');

const crafts = {
  papel: [
    'Organizador de escritorio con cajas recicladas.',
    'Mini refrigerador de cartón como proyecto divertido.'
  ],
  simples: [
    'Pulseras con hilos de colores.',
    'Marco de fotos con botones y retazos de tela.'
  ],
  habitacion: [
    'Pinta frascos de vidrio y úsalos como lámparas.',
    'Diseña un póster con frase motivadora.'
  ],
  rapidas: [
    'Origami sencillo (grulla, flor, corazón).',
    'Collage con revistas viejas.'
  ]
};

suggestCraft.addEventListener('click', () => {
  const kind = materials.value; // obtiene el valor del select
  const list = crafts[kind] ?? crafts.rapidas; // si no hay valor, usa "rápidas"
  const pick = list[Math.floor(Math.random() * list.length)]; // elige una al azar
  craftText.textContent = pick; // muestra la idea en el párrafo
});
// --- Gráfico de emociones semanales ---
const ctx = document.getElementById('emotionChart').getContext('2d');

const log = get('emotionLog', []);

// Agrupar por día
const dias = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const verde = new Array(7).fill(0);
const amarillo = new Array(7).fill(0);
const rojo = new Array(7).fill(0);

log.forEach(entry => {
  const fecha = new Date(entry.ts);
  const dia = fecha.getDay(); // 0=Domingo, 1=Lunes...
  if (entry.emotion === 'verde') verde[dia]++;
  if (entry.emotion === 'amarillo') amarillo[dia]++;
  if (entry.emotion === 'rojo') rojo[dia]++;
});

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: dias,
    datasets: [
      { label: 'Verde (calma)', data: verde, backgroundColor: '#34d399' },
      { label: 'Amarillo (alerta)', data: amarillo, backgroundColor: '#f59e0b' },
      { label: 'Rojo (intenso)', data: rojo, backgroundColor: '#ef4444' }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Tus emociones esta semana' }
    }
  }
});