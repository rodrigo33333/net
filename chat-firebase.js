function mostrarMensaje(m) {
    const mensajes = document.getElementById('mensajes');
    const div = document.createElement('div');
    div.classList.add('mensaje');

    const avatarHTML = m.avatar
        ? `<img class="avatar" src="${m.avatar}" alt="${m.nombre}" onerror="this.outerHTML='<div class=\\'avatar-placeholder\\'>${m.nombre[0].toUpperCase()}</div>'">`
        : `<div class="avatar-placeholder">${m.nombre[0].toUpperCase()}</div>`;

    div.innerHTML = `
        ${avatarHTML}
        <div style="flex:1; margin-left: 10px;">
            <div class="mensaje-nombre">${m.nombre} <span class="mensaje-fecha">${m.fecha} ${m.hora}</span></div>
            <div class="mensaje-texto">${m.texto}</div>
        </div>
        <button onclick="borrarMensaje(this, '${m.id}')">Borrar</button>
    `;
    mensajes.appendChild(div);
}

function scrollAlFinal() {
    setTimeout(() => {
        const mensajes = document.getElementById('mensajes');
        mensajes.scrollTop = mensajes.scrollHeight;
    }, 50);
}

window.onload = function () {
    const guardados = JSON.parse(localStorage.getItem('mensajes')) || [];
    guardados.forEach(m => mostrarMensaje(m));
    scrollAlFinal();
}

function obtenerAvatar() {
    return new Promise((resolve) => {
        const file = document.getElementById('inputAvatar').files[0];
        if (!file) { resolve(''); return; }
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

async function enviarMensaje() {
    const nombre = document.getElementById('inputNombre').value.trim();
    const texto = document.getElementById('inputMensaje').value.trim();
    if (nombre === '') { alert('Escribí tu nombre primero'); return; }
    if (texto === '') { alert('Escribí un mensaje'); return; }

    const avatar = await obtenerAvatar();
    const ahora = new Date();
    const m = {
        id: Date.now().toString(),
        nombre,
        texto,
        avatar,
        fecha: ahora.toLocaleDateString('es-PY'),
        hora: ahora.toLocaleTimeString('es-PY', { hour: '2-digit', minute: '2-digit' })
    };

    const guardados = JSON.parse(localStorage.getItem('mensajes')) || [];
    guardados.push(m);
    localStorage.setItem('mensajes', JSON.stringify(guardados));

    mostrarMensaje(m);
    document.getElementById('inputMensaje').value = '';
    scrollAlFinal();
}

function borrarMensaje(btn, id) {
    btn.parentElement.remove();
    let guardados = JSON.parse(localStorage.getItem('mensajes')) || [];
    guardados = guardados.filter(m => m.id !== id);
    localStorage.setItem('mensajes', JSON.stringify(guardados));
}

document.getElementById('inputMensaje').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') enviarMensaje();
});

function cambiarTab(nombre) {
    // Ocultar todos los contenidos
    document.querySelectorAll('.tab-contenido').forEach(t => {
        t.classList.remove('activo');
    });

    // Desactivar todos los botones
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('activo');
    });

    // Mostrar el seleccionado
    document.getElementById('tab-' + nombre).classList.add('activo');

    // Activar el botón clickeado
    event.target.classList.add('activo');
}

// ================================================
//   CHAT FIREBASE · LOS SANTOS COMMUNITY
//   Requiere: Firebase 10+ (módulo ESM)
//   Uso: <script type="module" src="chat-firebase.js"></script>
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

// ⚠️  REEMPLAZÁ CON TUS CREDENCIALES DE FIREBASE
// Las encontrás en: Firebase Console → ⚙ Configuración → Tus apps → Web
const firebaseConfig = {
  apiKey: "AIzaSyAmYJM3pXqcW8dvN4T2yvZp1b-dD2B2r1Q",
  authDomain: "acc1-3f87f.firebaseapp.com",
  projectId: "acc1-3f87f",
  storageBucket: "acc1-3f87f.firebasestorage.app",
  messagingSenderId: "164532802057",
  appId: "1:164532802057:web:319c074baf42d11db4ded8",
  measurementId: "G-9N580LF6DT"
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
    vacio.textContent = "// sin mensajes aún...";
    vacio.style.display = "block";
    return;
  }

  vacio.style.display = "none";
  contenedor.innerHTML = "";

  snapshot.forEach((doc) => {
    const m = doc.data();

    const hora = m.fecha?.toDate().toLocaleTimeString("es-PY", {
      hour:   "2-digit",
      minute: "2-digit"
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

  btnEnviar.disabled = true;
  btnEnviar.textContent = "...";

  try {
    await addDoc(col, {
      nombre,
      texto,
      fecha: serverTimestamp()
    });
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

// ── Eventos ──
btnEnviar.addEventListener("click", enviar);

inputMensaje.addEventListener("keydown", (e) => {
  if (e.key === "Enter") enviar();
});

// ── Utilidad ──
function escapeHTML(str) {
  return String(str)
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;");
}