// ===== INICIO =====
verificarSesion();
renderNavbar('inicio');

// Leer categoria de la URL si viene desde un link del navbar
const params = new URLSearchParams(window.location.search);
const catURL = params.get('cat');
if (catURL) {
  document.getElementById('filtroCategoria').value = catURL;
}

// ===== RENDER PRODUCTOS =====
function renderProductos() {
  const busqueda  = document.getElementById('buscador').value.trim().toLowerCase();
  const categoria = document.getElementById('filtroCategoria').value;
  const orden     = document.getElementById('filtroOrden').value;

  let productos = obtenerProductos();

  // Filtrar por busqueda
  if (busqueda) {
    productos = productos.filter(p =>
      p.nombre.toLowerCase().includes(busqueda) ||
      p.marca.toLowerCase().includes(busqueda)
    );
  }

  // Filtrar por categoria
  if (categoria) {
    productos = productos.filter(p => p.categoria === categoria);
  }

  // Ordenar
  if (orden === 'precio-asc') {
    productos.sort((a, b) => a.precio - b.precio);
  } else if (orden === 'precio-desc') {
    productos.sort((a, b) => b.precio - a.precio);
  } else if (orden === 'nombre') {
    productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  const grid = document.getElementById('grid-productos');

  if (productos.length === 0) {
    grid.innerHTML = `<div class="sin-resultados">No se encontraron productos.</div>`;
    return;
  }

  grid.innerHTML = productos.map(p => `
    <div class="producto-card" onclick="verDetalle(${p.id})">
      <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" />
      <div class="producto-info">
        <p class="producto-marca">${p.marca}</p>
        <p class="producto-nombre">${p.nombre}</p>
        <div class="producto-footer">
          <span class="producto-precio">$${p.precio.toFixed(2)}</span>
          <button class="btn-ver" onclick="event.stopPropagation(); verDetalle(${p.id})">Ver</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderRecomendaciones() {
  const productos = obtenerRecomendaciones();
  const grid = document.getElementById('grid-recomendaciones');

  if (!productos.length) {
    grid.innerHTML = '<div class="sin-resultados">Visita algunos productos para recibir recomendaciones personalizadas.</div>';
    return;
  }

  grid.innerHTML = productos.map(p => `
    <div class="producto-card" onclick="verDetalle(${p.id})">
      <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" />
      <div class="producto-info">
        <p class="producto-marca">${p.marca}</p>
        <p class="producto-nombre">${p.nombre}</p>
        <div class="producto-footer">
          <span class="producto-precio">$${p.precio.toFixed(2)}</span>
          <button class="btn-ver" onclick="event.stopPropagation(); verDetalle(${p.id})">Ver</button>
        </div>
      </div>
    </div>
  `).join('');
}

function recomendarDesdeConsulta(consulta) {
  const texto = consulta.toLowerCase();
  const productos = obtenerProductos();
  const categorias = ['limpieza', 'serums', 'hidratacion', 'proteccion', 'tratamiento'];
  const beneficios = [...new Set(productos.flatMap(producto => producto.beneficios.map(item => item.toLowerCase())))];
  const categoria = categorias.find(item => texto.includes(item));
  const beneficio = beneficios.find(item => texto.includes(item));
  const presupuesto = texto.match(/(?:menos de|hasta|por menos de|máximo|maximo)\s*\$?\s*(\d+(?:[.,]\d+)?)/);
  const limite = presupuesto ? parseFloat(presupuesto[1].replace(',', '.')) : null;

  const resultados = productos.map(producto => {
    const descripcion = `${producto.nombre} ${producto.marca} ${producto.categoria} ${producto.beneficios.join(' ')} ${producto.descripcion}`.toLowerCase();
    let puntuacion = 0;
    if (categoria && producto.categoria === categoria) puntuacion += 8;
    if (beneficio && producto.beneficios.some(item => item.toLowerCase() === beneficio)) puntuacion += 5;
    if (limite && producto.precio <= limite) puntuacion += 4;
    if (texto.split(/\s+/).some(palabra => palabra.length > 3 && descripcion.includes(palabra))) puntuacion += 1;
    if (!categoria && !color && !limite) puntuacion = obtenerRecomendaciones(20).some(item => item.id === producto.id) ? 2 : 0;
    return { producto, puntuacion };
  }).filter(item => item.puntuacion > 0)
    .sort((a, b) => b.puntuacion - a.puntuacion || a.producto.precio - b.producto.precio)
    .slice(0, 4)
    .map(item => item.producto);

  const grid = document.getElementById('grid-recomendaciones');
  const respuesta = document.getElementById('respuestaIA');
  if (!resultados.length) {
    respuesta.textContent = 'No encontré una coincidencia exacta. Prueba con una categoría, color o presupuesto diferente.';
    grid.innerHTML = '';
    return;
  }

  const criterios = [categoria, beneficio, limite ? `menos de $${limite.toFixed(2)}` : null].filter(Boolean).join(', ');
  respuesta.textContent = criterios ? `Encontré opciones relacionadas con: ${criterios}.` : 'Estas opciones pueden ajustarse a lo que estás buscando.';
  grid.innerHTML = resultados.map(p => `
    <div class="producto-card" onclick="verDetalle(${p.id})">
      <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" />
      <div class="producto-info">
        <p class="producto-marca">${p.marca}</p>
        <p class="producto-nombre">${p.nombre}</p>
        <div class="producto-footer"><span class="producto-precio">$${p.precio.toFixed(2)}</span><button class="btn-ver" onclick="event.stopPropagation(); verDetalle(${p.id})">Ver</button></div>
      </div>
    </div>
  `).join('');
}

// ===== NAVEGACION =====
function verDetalle(id) {
  registrarProductoVisto(id);
  window.location.href = `detalle.html?id=${id}`;
}

function scrollCatalogo() {
  document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
}

// ===== FILTROS EN TIEMPO REAL =====
document.getElementById('buscador').addEventListener('input', renderProductos);
document.getElementById('filtroCategoria').addEventListener('change', renderProductos);
document.getElementById('filtroOrden').addEventListener('change', renderProductos);
document.getElementById('formAsistenteIA').addEventListener('submit', event => {
  event.preventDefault();
  const consulta = document.getElementById('consultaIA').value.trim();
  if (consulta) recomendarDesdeConsulta(consulta);
});

// ===== CARGAR =====
renderProductos();
renderRecomendaciones();