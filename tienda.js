// ===== SESION =====
function verificarSesion() {
  const sesion = localStorage.getItem('sesionActiva');
  if (!sesion) window.location.href = 'login.html';
  return sesion;
}

function cerrarSesion() {
  localStorage.removeItem('sesionActiva');
  window.location.href = 'login.html';
}

function obtenerUsuarioActual() {
  return localStorage.getItem('sesionActiva') || '';
}

// ===== PRODUCTOS =====
const PRODUCTOS_VERSION = 'perfumes-aurelix-reales-v1';
const PRODUCTOS_DEFAULT = [
  {
    id: 1, nombre: 'Chanel No. 5', marca: 'Chanel', precio: 239.99,
    categoria: 'arabes',
    imagen: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80',
    presentaciones: ['50 ml', '100 ml'], beneficios: ['Clasica', 'Elegante'],
    descripcion: 'Una fragancia icónica floral aldehídica con presencia, lujo y una estela sofisticada.'
  },
  {
    id: 2, nombre: 'Dior Sauvage', marca: 'Dior', precio: 199.99,
    categoria: 'americanos',
    imagen: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80',
    presentaciones: ['60 ml', '100 ml'], beneficios: ['Amaderado', 'Fresco'],
    descripcion: 'Una fragancia masculina intensa con bergamota, ambroxan y un toque fresco y poderoso.'
  },
  {
    id: 3, nombre: 'YSL Black Opium', marca: 'Yves Saint Laurent', precio: 189.99,
    categoria: 'yambal',
    imagen: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80',
    presentaciones: ['50 ml', '90 ml'], beneficios: ['Oriental', 'Seductor'],
    descripcion: 'Un perfume cálido y adictivo con café, vainilla y notas especiadas para una presencia inolvidable.'
  },
  {
    id: 4, nombre: 'Gucci Bloom', marca: 'Gucci', precio: 179.99,
    categoria: 'avon',
    imagen: 'https://images.unsplash.com/photo-1563170351-be82bc888e58?w=400&q=80',
    presentaciones: ['50 ml', '100 ml'], beneficios: ['Floral', 'Femenino'],
    descripcion: 'Una fragancia floral exuberante con jazmín, rosa y notas de magnolia muy elegante.'
  },
  {
    id: 5, nombre: 'Jean Paul Gaultier Le Male', marca: 'Jean Paul Gaultier', precio: 169.99,
    categoria: 'arabes',
    imagen: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=400&q=80',
    presentaciones: ['50 ml', '100 ml'], beneficios: ['Oriental', 'Marcado'],
    descripcion: 'Un perfume masculino característico con lavanda, vainilla y un toque muy distinguido.'
  },
  {
    id: 6, nombre: 'Ariana Grande Cloud', marca: 'Ariana Grande', precio: 149.99,
    categoria: 'americanos',
    imagen: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80',
    presentaciones: ['30 ml', '50 ml'], beneficios: ['Crema', 'Dulce'],
    descripcion: 'Una fragancia suave, dulce y aireada con musk, vainilla y notas de coco.'
  },
  {
    id: 7, nombre: 'Dolce & Gabbana Light Blue', marca: 'Dolce & Gabbana', precio: 159.99,
    categoria: 'yambal',
    imagen: 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=400&q=80',
    presentaciones: ['50 ml', '100 ml'], beneficios: ['Citrico', 'Veraniego'],
    descripcion: 'Una fragancia fresca y mediterránea con cítricos, jengibre y notas cristalinas.'
  },
  {
    id: 8, nombre: 'Carolina Herrera Good Girl', marca: 'Carolina Herrera', precio: 209.99,
    categoria: 'avon',
    imagen: 'https://images.unsplash.com/photo-1528747008803-5f10d0f2ec9d?w=400&q=80',
    presentaciones: ['30 ml', '50 ml'], beneficios: ['Femenino', 'Intenso'],
    descripcion: 'Paleta glamorosa de tonka, cacao y jazmín que deja una estela sofisticada y seductora.'
  },
  {
    id: 9, nombre: 'Viktor & Rolf Flowerbomb', marca: 'Viktor & Rolf', precio: 219.99,
    categoria: 'arabes',
    imagen: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400&q=80',
    presentaciones: ['30 ml', '100 ml'], beneficios: ['Floral', 'Potente'],
    descripcion: 'Una explosión floral con notas de jasmín, orquídea y patchouli muy intensa.'
  },
  {
    id: 10, nombre: 'Tom Ford Oud Wood', marca: 'Tom Ford', precio: 289.99,
    categoria: 'americanos',
    imagen: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',
    presentaciones: ['50 ml', '100 ml'], beneficios: ['Amaderado', 'Premium'],
    descripcion: 'Un aroma amaderado y vainillado con oud, especias y un perfil extremadamente refinado.'
  },
  {
    id: 11, nombre: 'Hermès Terre d’Hermès', marca: 'Hermès', precio: 229.99,
    categoria: 'arabes',
    imagen: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80',
    presentaciones: ['50 ml', '100 ml'], beneficios: ['Terroso', 'Masculino'],
    descripcion: 'Una fragancia mineral y amaderada con naranja, ciprés y un acabado cálido y elegante.'
  },
  {
    id: 12, nombre: 'Lancôme La Vie Est Belle', marca: 'Lancôme', precio: 189.99,
    categoria: 'yambal',
    imagen: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80',
    presentaciones: ['50 ml', '100 ml'], beneficios: ['Floral', 'Dulce'],
    descripcion: 'Un perfume femenino con iris, vainilla y pera que ofrece un aroma luminoso y floral.'
  },
  {
    id: 13, nombre: 'Creed Aventus', marca: 'Creed', precio: 349.99,
    categoria: 'americanos',
    imagen: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=400&q=80',
    presentaciones: ['50 ml', '100 ml'], beneficios: ['Fruta', 'Potente'],
    descripcion: 'Un perfume masculino icónico con manzana, musk y notas de ámbar con gran presencia.'
  },
  {
    id: 14, nombre: 'Maison Francis Kurkdjian Baccarat Rouge 540', marca: 'Maison Francis Kurkdjian', precio: 399.99,
    categoria: 'avon',
    imagen: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&q=80',
    presentaciones: ['70 ml'], beneficios: ['Azeda', 'Exclusivo'],
    descripcion: 'Un perfume muy premium con ámbar, notas de azahar y un carácter sensual y exclusivo.'
  },
  {
    id: 15, nombre: 'Bvlgari Man Wood Essence', marca: 'Bvlgari', precio: 179.99,
    categoria: 'arabes',
    imagen: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80',
    presentaciones: ['60 ml'], beneficios: ['Madera', 'Duro'],
    descripcion: 'Un aroma masculino amaderado con sándalo, pachulí y un tono cálido y moderno.'
  },
  {
    id: 16, nombre: 'Valentino Donna Born In Roma', marca: 'Valentino', precio: 199.99,
    categoria: 'yambal',
    imagen: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80',
    presentaciones: ['50 ml', '80 ml'], beneficios: ['Floral', 'Romántico'],
    descripcion: 'Un perfume femenino elegante con notas de jazmín, rosa y vainilla con aire chic.'
  },
  {
    id: 17, nombre: 'Prada Paradoxe', marca: 'Prada', precio: 189.99,
    categoria: 'americanos',
    imagen: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=400&q=80',
    presentaciones: ['50 ml'], beneficios: ['Floral', 'Minimalista'],
    descripcion: 'Un perfume innovador con neroli, ambroxan y flores blancas para un estilo limpio y moderno.'
  },
  {
    id: 18, nombre: 'Calvin Klein Eternity', marca: 'Calvin Klein', precio: 129.99,
    categoria: 'avon',
    imagen: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80',
    presentaciones: ['50 ml', '100 ml'], beneficios: ['Clásico', 'Cítrico'],
    descripcion: 'Una fragancia fresca y elegante con notas cítricas, florales y musgo para uso diario.'
  },
];

function obtenerProductos() {
  if (localStorage.getItem('productosVersion') !== PRODUCTOS_VERSION) {
    localStorage.setItem('productos', JSON.stringify(PRODUCTOS_DEFAULT));
    localStorage.setItem('productosVersion', PRODUCTOS_VERSION);
  }
  const guardados = localStorage.getItem('productos');
  return guardados ? JSON.parse(guardados) : PRODUCTOS_DEFAULT;
}

function guardarProductos(lista) {
  localStorage.setItem('productos', JSON.stringify(lista));
}

function obtenerProductoPorId(id) {
  return obtenerProductos().find(p => p.id === parseInt(id));
}

function registrarProductoVisto(id) {
  const historial = JSON.parse(localStorage.getItem('historialProductos') || '[]');
  const productoId = parseInt(id);
  const nuevoHistorial = [productoId, ...historial.filter(item => item !== productoId)].slice(0, 12);
  localStorage.setItem('historialProductos', JSON.stringify(nuevoHistorial));
}

function obtenerRecomendaciones(limite = 4) {
  const productos = obtenerProductos();
  const historial = JSON.parse(localStorage.getItem('historialProductos') || '[]');
  const carrito = obtenerCarrito();
  const vistos = new Set(historial);
  const categorias = [...historial, ...carrito.map(item => item.id)]
    .map(id => obtenerProductoPorId(id)?.categoria)
    .filter(Boolean);
  const marcas = historial.map(id => obtenerProductoPorId(id)?.marca).filter(Boolean);
  const precios = [...historial, ...carrito.map(item => item.id)]
    .map(id => obtenerProductoPorId(id)?.precio)
    .filter(Boolean);
  const categoriaPrincipal = categorias.sort((a, b) =>
    categorias.filter(item => item === b).length - categorias.filter(item => item === a).length
  )[0];
  const precioMedio = precios.length ? precios.reduce((total, precio) => total + precio, 0) / precios.length : 0;

  return productos
    .filter(producto => !vistos.has(producto.id))
    .map(producto => {
      let puntuacion = 0;
      if (producto.categoria === categoriaPrincipal) puntuacion += 5;
      if (marcas.includes(producto.marca)) puntuacion += 3;
      if (precioMedio && Math.abs(producto.precio - precioMedio) <= precioMedio * 0.3) puntuacion += 2;
      return { producto, puntuacion };
    })
    .sort((a, b) => b.puntuacion - a.puntuacion || a.producto.id - b.producto.id)
    .slice(0, limite)
    .map(item => item.producto);
}

// ===== CARRITO =====
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem('carrito') || '[]');
}

function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarBadge();
}

function agregarAlCarrito(productoId, presentacion, beneficio, cantidad = 1) {
  const producto = obtenerProductoPorId(productoId);
  if (!producto) return;

  const carrito = obtenerCarrito();
  const key = `${productoId}-${presentacion}-${beneficio}`;
  const existente = carrito.find(i => i.key === key);

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({
      key,
      id: producto.id,
      nombre: producto.nombre,
      marca: producto.marca,
      precio: producto.precio,
      imagen: producto.imagen,
      presentacion,
      beneficio,
      cantidad
    });
  }

  guardarCarrito(carrito);
  mostrarToast('Agregado al carrito', 'exito');
}

function eliminarDelCarrito(key) {
  guardarCarrito(obtenerCarrito().filter(i => i.key !== key));
}

function actualizarCantidad(key, cantidad) {
  let carrito = obtenerCarrito();
  const item = carrito.find(i => i.key === key);
  if (item) {
    item.cantidad = parseInt(cantidad);
    if (item.cantidad <= 0) carrito = carrito.filter(i => i.key !== key);
  }
  guardarCarrito(carrito);
}

function totalCarrito() {
  return obtenerCarrito().reduce((sum, i) => sum + i.precio * i.cantidad, 0);
}

function cantidadCarrito() {
  return obtenerCarrito().reduce((sum, i) => sum + i.cantidad, 0);
}

function actualizarBadge() {
  const badge = document.querySelector('.badge-carrito');
  if (!badge) return;
  const n = cantidadCarrito();
  badge.textContent = n;
  badge.classList.toggle('oculto', n === 0);
}

// ===== TOAST =====
function mostrarToast(msg, tipo) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = 'toast show ' + (tipo || '');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.className = 'toast', 2800);
}

// ===== NAVBAR =====
function renderNavbar(paginaActiva) {
  const sesion = obtenerUsuarioActual();
  const n = cantidadCarrito();

  document.getElementById('nav-container').innerHTML = `
    <nav class="navbar">
      <a href="index.html" class="logo">AURE<span>LIX</span></a>
      <ul class="nav-links">
        <li><a href="landing.html">Principal</a></li>
        <li><a href="index.html" class="${paginaActiva === 'inicio' ? 'activo' : ''}">Catálogo</a></li>
        <li><a href="index.html?cat=arabes" class="${paginaActiva === 'arabes' ? 'activo' : ''}">Árabes</a></li>
        <li><a href="index.html?cat=americanos" class="${paginaActiva === 'americanos' ? 'activo' : ''}">Americanos</a></li>
        <li><a href="index.html?cat=yambal" class="${paginaActiva === 'yambal' ? 'activo' : ''}">Yambal</a></li>
        <li><a href="index.html?cat=avon" class="${paginaActiva === 'avon' ? 'activo' : ''}">Avon</a></li>
      </ul>
      <div class="nav-acciones">
        <button class="btn-mis-pedidos" onclick="window.location.href='mis-pedidos.html'">
          Mis pedidos
        </button>
        <button class="btn-carrito" onclick="window.location.href='carrito.html'">
          🛒
          <span class="badge-carrito ${n === 0 ? 'oculto' : ''}">${n}</span>
        </button>
        <div class="nav-usuario">
          <span>${sesion}</span>
          <button class="btn-salir" onclick="cerrarSesion()">Salir</button>
        </div>
      </div>
    </nav>
  `;
}