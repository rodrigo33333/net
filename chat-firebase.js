// ================================================
//   CHAT-FIREBASE.JS — chat en tiempo real
//   Uso: <script type="module" src="chat-firebase.js"></script>
//   IMPORTANTE: este archivo va separado de app.js
// ================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ⚠️ TUS CREDENCIALES DE FIREBASE
// Después de pegar esto, andá a Firebase Console →
// Configuración → Restricciones de API key →
// Agregá solo tu dominio: rodrigo33333.github.io
const firebaseConfig = {
  apiKey:            "AIzaSyAmYJM3pXqcW8dvN4T2yvZp1b-dD2B2r1Q",
  authDomain:        "acc1-3f87f.firebaseapp.com",
  projectId:         "acc1-3f87f",
  storageBucket:     "acc1-3f87f.firebasestorage.app",
  messagingSenderId: "164532802057",
  appId:             "1:164532802057:web:319c074baf42d11db4ded8"
};

// ── Inicializar Firebase ──
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const col = collection(db, "mensajes");

// ── Referencias al DOM ──
const contenedor   = document.getElementById("mensajes");
const vacio        = document.getElementById("vacio");
const inputNombre  = document.getElementById("inputNombre");
const inputMensaje = document.getElementById("inputMensaje");
const btnEnviar    = document.getElementById("btnEnviar");

// ── Escuchar mensajes en tiempo real ──
const q = query(col, orderBy("fecha", "asc"));

onSnapshot(q, (snapshot) => {
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
      <div class="msg-top">
        <span class="msg-nombre">${escapeHTML(m.nombre)}</span>
        <span class="msg-hora">${hora}</span>
      </div>
      <div class="msg-texto">${escapeHTML(m.texto)}</div>
    `;
    contenedor.appendChild(div);
  });

  contenedor.scrollTop = contenedor.scrollHeight;
});

// ── Enviar mensaje ──
async function enviar() {
  const nombre = inputNombre.value.trim();
  const texto  = inputMensaje.value.trim();

  if (!nombre) { alert("Poné tu nombre primero"); inputNombre.focus(); return; }
  if (!texto)  { alert("Escribí un mensaje");      inputMensaje.focus(); return; }

  btnEnviar.disabled    = true;
  btnEnviar.textContent = "...";

  try {
    await addDoc(col, { nombre, texto, fecha: serverTimestamp() });
    inputMensaje.value = "";
    inputMensaje.focus();
  } catch (err) {
    alert("Error al enviar. Revisá tu conexión.");
    console.error(err);
  } finally {
    btnEnviar.disabled    = false;
    btnEnviar.textContent = "ENVIAR";
  }
}

// ── Eventos ──
if (btnEnviar)    btnEnviar.addEventListener("click", enviar);
if (inputMensaje) inputMensaje.addEventListener("keydown", e => { if (e.key === "Enter") enviar(); });

// ── Utilidad ──
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}