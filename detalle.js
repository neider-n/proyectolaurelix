verificarSesion();
renderNavbar('');

const idProducto = new URLSearchParams(window.location.search).get('id');
const producto = obtenerProductoPorId(idProducto);
const contenedorDetalle = document.getElementById('detalleProducto');

registrarProductoVisto(idProducto);

if (!producto) {
  contenedorDetalle.innerHTML = `
    <div class="detalle-vacio">
      <h1>Producto no encontrado</h1>
      <a class="btn btn-rojo" href="index.html">Volver al catalogo</a>
    </div>
  `;
} else {
  contenedorDetalle.innerHTML = `
    <a class="detalle-volver" href="index.html">&larr; Volver al catalogo</a>
    <section class="detalle-producto">
      <div class="detalle-imagen"><img src="${producto.imagen}" alt="${producto.nombre}" /></div>
      <div class="detalle-info">
        <p class="producto-marca">${producto.marca}</p>
        <h1>${producto.nombre}</h1>
        <p class="detalle-precio">$${producto.precio.toFixed(2)}</p>
        <p class="detalle-descripcion">${producto.descripcion}</p>
        <div class="detalle-lista">
          <p><strong>Presentaciones:</strong> ${(producto.presentaciones || []).join(', ')}</p>
          <p><strong>Beneficios:</strong> ${(producto.beneficios || []).join(', ')}</p>
          <p><strong>Categoria:</strong> ${producto.categoria}</p>
        </div>
        <button class="btn btn-rojo" onclick="agregarAlCarrito(${producto.id}, '${producto.presentaciones[0]}', '${producto.beneficios[0]}')">Agregar al carrito</button>
      </div>
    </section>
  `;
}