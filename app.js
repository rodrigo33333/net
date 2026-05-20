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

// ── FIB CHAT ──
function fibGetTime() {
  const n = new Date();
  return String(n.getHours()).padStart(2,'0') + ':' + String(n.getMinutes()).padStart(2,'0');
}

function fibEscape(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function fibSend() {
  const input    = document.getElementById('fibInput');
  const nameInp  = document.getElementById('fibNombre');
  const text     = input.value.trim();
  const nombre   = nameInp.value.trim().toUpperCase() || 'AGENTE';
  const iniciales = nombre.slice(0, 2);
  if (!text) return;

  const msgs = document.getElementById('fibMessages');
  const sys  = msgs.querySelector('.fib-sys:last-child');

  const row = document.createElement('div');
  row.className = 'fib-row own';
  row.innerHTML = `
    <div class="fib-av own" data-initials="${iniciales}"></div>
    <div class="fib-msg-content own">
      <div class="fib-msg-meta own">
        <span class="fib-rank">ACTIVO</span>
        <span class="fib-time">${fibGetTime()}</span>
        <span class="fib-username own">${fibEscape(nombre)}</span>
      </div>
      <div class="fib-bubble own">${fibEscape(text)}</div>
    </div>`;

  msgs.insertBefore(row, sys);
  msgs.scrollTop = msgs.scrollHeight;
  input.value = '';
  input.focus();
}

document.getElementById('fibInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') fibSend();
});