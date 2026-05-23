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