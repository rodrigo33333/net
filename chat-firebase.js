// ================================================
//   CHAT-FIREBASE.JS — chat + galería en tiempo real
//   Uso: <script type="module" src="chat-firebase.js"></script>
// ================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAmYJM3pXqcW8dvN4T2yvZp1b-dD2B2r1Q",
  authDomain: "acc1-3f87f.firebaseapp.com",
  projectId: "acc1-3f87f",
  storageBucket: "acc1-3f87f.firebasestorage.app",
  messagingSenderId: "164532802057",
  appId: "1:164532802057:web:319c074baf42d11db4ded8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const colMensajes = collection(db, "mensajes");
const colGaleria = collection(db, "galeria");

const contenedor = document.getElementById("mensajes");
const vacio = document.getElementById("vacio");
const inputNombre = document.getElementById("inputNombre");
const inputMensaje = document.getElementById("inputMensaje");
const btnEnviar = document.getElementById("btnEnviar");

const qMensajes = query(colMensajes, orderBy("fecha", "asc"));

onSnapshot(qMensajes, (snapshot) => {
  if (snapshot.empty) {
    if (vacio) { vacio.textContent = "// sin mensajes aún..."; vacio.style.display = "block"; }
    return;
  }
  if (vacio) vacio.style.display = "none";
  contenedor.innerHTML = "";
  snapshot.forEach((doc) => {
    const m = doc.data();
    const hora = m.fecha?.toDate().toLocaleTimeString("es-PY", {
      hour: "2-digit", minute: "2-digit"
    }) || "--:--";
    const div = document.createElement("div");
    div.className = "mensaje";
    div.innerHTML = `
      <span class="msg-nombre">${escapeHTML(m.nombre)}</span>
      <span class="msg-texto">${escapeHTML(m.texto)}</span>
      <span class="msg-hora">${hora}</span>
    `;
    contenedor.appendChild(div);
  });
  contenedor.scrollTop = contenedor.scrollHeight;
});

// Anti-spam: bloquea caracteres repetidos más de 15 veces seguidos
function esSpam(texto) {
  return /(.)\1{15,}/.test(texto);
}

async function enviar() {
  const nombre = inputNombre.value.trim();
  const texto = inputMensaje.value.trim();

  if (!nombre) { alert("Poné tu nombre primero"); inputNombre.focus(); return; }
  if (!texto) { alert("Escribí un mensaje"); inputMensaje.focus(); return; }

  if (esSpam(texto) || esSpam(nombre)) {
    alert("Mensaje no permitido.");
    return;
  }

  btnEnviar.disabled = true;
  btnEnviar.textContent = "...";

  try {
    await addDoc(colMensajes, { nombre, texto, fecha: serverTimestamp() });
    inputMensaje.value = "";
    inputMensaje.focus();
  } catch (err) {
    alert("Error al enviar. Revisá tu conexión.");
    console.error(err);
  } finally {
    btnEnviar.disabled = false;
    btnEnviar.textContent = "ENVIAR";
  }
}

if (btnEnviar) btnEnviar.addEventListener("click", enviar);
if (inputMensaje) inputMensaje.addEventListener("keydown", e => { if (e.key === "Enter") enviar(); });

async function cargarGaleria() {
  const galeriaGrid = document.getElementById("galeria-grid");
  const imagenAleatoria = document.getElementById("mini-galeria");
  try {
    const qGaleria = query(colGaleria, orderBy("orden", "asc"));
    const snapshot = await getDocs(qGaleria);
    if (snapshot.empty) return;
    const items = [];
    snapshot.forEach((doc) => items.push(doc.data()));
    if (galeriaGrid) {
      galeriaGrid.innerHTML = "";
      items.forEach((data) => {
        const { url, titulo } = data;
        const item = document.createElement("div");
        item.className = "galeria-item";
        item.onclick = () => abrirModal(item);
        item.innerHTML = `
          <img src="${url}" alt="${escapeHTML(titulo)}" />
          <div class="galeria-overlay">🔍</div>
        `;
        galeriaGrid.appendChild(item);
      });
    }
    if (imagenAleatoria) {
      const random = items[Math.floor(Math.random() * items.length)];
      const { url, titulo } = random;
      imagenAleatoria.innerHTML = `
        <img src="${url}" alt="${escapeHTML(titulo)}" />
        <div class="mini-overlay">🔍</div>
      `;
      imagenAleatoria.onclick = () => abrirModal(imagenAleatoria);
    }
  } catch (err) {
    console.error("Error cargando galería:", err);
  }
}

cargarGaleria();

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('.hero-stat-num[data-target]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target, 10);
    const duration = 1600;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), target);
      counter.textContent = current.toLocaleString('es-PY');
      if (current >= target) clearInterval(timer);
    }, duration / steps);
  });
});