// ===== PRODUCTOS DESTACADOS =====
// Muestra todos los productos publicados desde el panel administrativo
function renderDestacados() {
  const productos = obtenerProductos();
  const grid = document.getElementById('gridDestacados');

  if (productos.length === 0) {
    grid.innerHTML = '<p class="sin-productos">No hay productos publicados.</p>';
    return;
  }

  grid.innerHTML = productos.map(p => `
    <div class="card-landing" onclick="window.location.href='detalle.html?id=${p.id}'">
      <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" />
      <div class="card-landing-info">
        <p class="card-marca">${p.marca}</p>
        <p class="card-nombre">${p.nombre}</p>
        <div class="card-footer">
          <span class="card-precio">$${p.precio.toFixed(2)}</span>
          <a href="detalle.html?id=${p.id}" class="card-btn" onclick="event.stopPropagation()">Ver detalles</a>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== ANIMACION AL HACER SCROLL =====
function animarAlVer() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.card-landing, .stat, .valor, .nosotros-imagen, .nosotros-texto, .persona, .contacto-info, .contacto-form').forEach(el => {
    el.classList.add('fade-up');
    observer.observe(el);
  });
}

function mostrarMensajeContacto() {
  document.getElementById('contactoConfirmacion').textContent = 'Mensaje recibido. Nuestro equipo te respondera pronto.';
  document.getElementById('contactoMensaje').value = '';
}

// ===== NAVBAR: ocultar al bajar, mostrar al subir =====
let lastScroll = 0;
const nav = document.querySelector('.nav-landing');

window.addEventListener('scroll', () => {
  const actual = window.scrollY;

  if (actual > lastScroll && actual > 100) {
    nav.style.transform = 'translateY(-100%)';
  } else {
    nav.style.transform = 'translateY(0)';
  }

  lastScroll = actual;
});

// ===== SI YA TIENE SESION VA DIRECTO AL CATALOGO =====
if (localStorage.getItem('sesionActiva')) {
  // Cambia el boton de ingresar por "Ir a la tienda"
  document.querySelectorAll('a[href="login.html"]').forEach(a => {
    a.href = 'index.html';
    if (a.textContent.includes('Ingresar')) a.textContent = 'Ir a la tienda';
    if (a.textContent.includes('Conoce')) a.textContent = 'Ir a la tienda';
    if (a.textContent.includes('Comprar')) a.textContent = 'Ir a la tienda';
  });
}

// ===== SMOOTH SCROLL para links internos =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== CARGAR =====
renderDestacados();
animarAlVer();