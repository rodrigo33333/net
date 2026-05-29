// ================================================
//   APP.JS — funciones generales de la página
//   NO incluir código Firebase acá
// ================================================

// ── Hamburguesa / menú móvil ──
const hamburguesa = document.querySelector('.hamburguesa');
const navegacion  = document.querySelector('.navegacion');

if (hamburguesa && navegacion) {
  hamburguesa.addEventListener('click', () => {
    navegacion.classList.toggle('abierto');
  });
}

// ── Cambiar tabs ──
function cambiarTab(nombre) {
  document.querySelectorAll('.tab-contenido').forEach(t => t.classList.remove('activo'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('activo'));
  const tab = document.getElementById('tab-' + nombre);
  if (tab) tab.classList.add('activo');
  if (event && event.target) event.target.classList.add('activo');
}

function mostrar(seccion, link) {
  // Ocultar secciones
  document.getElementById('seccion-inicio').style.display = 'none';
  const extras = ['reglas', 'misiones'];
  extras.forEach(s => {
    const el = document.getElementById('seccion-' + s);
    if (el) el.style.display = 'none';
  });

  // Mostrar la pedida
  const target = document.getElementById('seccion-' + seccion);
  if (target) target.style.display = 'block';
  else document.getElementById('seccion-inicio').style.display = 'block';

  // Link activo
  document.querySelectorAll('.navegacion a').forEach(a => a.classList.remove('activo'));
  if (link) link.classList.add('activo');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function filtrar(dif, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('activo'));
  btn.classList.add('activo');
  document.querySelectorAll('.mission-card').forEach(card => {
    card.style.display = (dif === 'todas' || card.dataset.dif === dif) ? 'flex' : 'none';
  });
}

// ===== NAVEGACIÓN SIN RECARGAR =====
const secciones = ['inicio', 'reglas', 'misiones', 'capturas', 'foro', 'unete', 'ayuda', 'buscar'];

function mostrar(seccion, link) {
  secciones.forEach(s => {
    const el = document.getElementById('seccion-' + s);
    if (el) el.style.display = 'none';
  });

  const target = document.getElementById('seccion-' + seccion);
  if (target) target.style.display = 'block';
  else document.getElementById('seccion-inicio').style.display = 'block';

  document.querySelectorAll('.navegacion a').forEach(a => a.classList.remove('activo'));
  if (link) link.classList.add('activo');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== FILTRO MISIONES =====
function filtrar(dif, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('activo'));
  btn.classList.add('activo');
  document.querySelectorAll('.mission-card').forEach(card => {
    card.style.display = (dif === 'todas' || card.dataset.dif === dif) ? 'flex' : 'none';
  });
}

// ===== MODAL GALERÍA =====
function abrirModal(item) {
  const src = item.querySelector('img').src;
  document.getElementById('modal-img').src = src;
  const modal = document.getElementById('modal-imagen');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  document.getElementById('modal-imagen').style.display = 'none';
  document.getElementById('modal-img').src = '';
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') cerrarModal();
});

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal-imagen');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === this) cerrarModal();
    });
  }

  // ===== HAMBURGUESA =====
  const hamburguesa = document.querySelector('.hamburguesa');
  const nav = document.querySelector('.navegacion');
  if (hamburguesa && nav) {
    hamburguesa.addEventListener('click', () => {
      nav.classList.toggle('abierto');
    });
  }
});