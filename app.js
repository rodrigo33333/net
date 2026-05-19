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

const emojis = ['😂', '👀', '🔥', '💀', '😤', '🤙', '👊', '😎'];
let emojiIdx = 0;

function addEmoji() {
  const input = document.getElementById('msgInput');
  input.value += emojis[emojiIdx++ % emojis.length];
  input.focus();
}

function toggleLike(btn) {
  const isLiked = btn.classList.toggle('liked');
  btn.textContent = isLiked ? '♥ 1' : '♡ 0';
}

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function sendMessage() {
  const input = document.getElementById('msgInput');
  const text = input.value.trim();
  if (!text) return;

  const now = new Date();
  const time =
    now.getHours().toString().padStart(2, '0') + ':' +
    now.getMinutes().toString().padStart(2, '0');

  const row = document.createElement('div');
  row.className = 'msg-row own';
  row.innerHTML = `
    <div class="avatar r">R</div>
    <div class="msg-content">
      <div class="msg-meta">
        <span>${time}</span>
        <span class="msg-username">rodrigo</span>
      </div>
      <div class="bubble">${escapeHTML(text)}</div>
      <div class="msg-actions">
        <button class="action-btn" onclick="toggleLike(this)">♡ 0</button>
        <button class="action-btn danger" onclick="this.closest('.msg-row').remove()">🗑 Borrar</button>
      </div>
    </div>`;

  const messages = document.getElementById('messages');
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
  input.value = '';
}

document.getElementById('msgInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});