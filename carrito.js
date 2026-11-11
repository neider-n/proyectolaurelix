verificarSesion();
renderNavbar('');

function renderCarrito() {
  const carrito = obtenerCarrito();
  const contenedor = document.getElementById('carritoContenido');

  if (!carrito.length) {
    contenedor.innerHTML = '<div class="vacio"><p>Tu carrito esta vacio.</p><a class="btn btn-rojo" href="index.html">Ver productos</a></div>';
    return;
  }

  contenedor.innerHTML = `
    <div class="carrito-lista">
      ${carrito.map(item => `
        <article class="carrito-item">
          <img src="${item.imagen}" alt="${item.nombre}" />
          <div><strong>${item.nombre}</strong><p>${item.beneficio} | ${item.presentacion}</p></div>
          <input type="number" min="1" value="${item.cantidad}" onchange="actualizarCantidadCarrito('${item.key}', this.value)" />
          <strong>$${(item.precio * item.cantidad).toFixed(2)}</strong>
          <button class="btn-eliminar" onclick="eliminarItem('${item.key}')">Eliminar</button>
        </article>
      `).join('')}
    </div>
    <section class="checkout glass">
      <h2>Confirmar compra</h2>
      <input id="clienteNombre" placeholder="Nombre completo" />
      <input id="clienteTelefono" placeholder="Telefono" />
      <input id="clienteDireccion" placeholder="Direccion de entrega" />
      <p class="checkout-total">Total: $${totalCarrito().toFixed(2)}</p>
      <button class="btn btn-rojo" onclick="confirmarCompra()">Enviar pedido</button>
      <span id="errorCheckout" class="error-checkout"></span>
    </section>
  `;
}

function actualizarCantidadCarrito(key, cantidad) {
  actualizarCantidad(key, cantidad);
  renderCarrito();
}

function eliminarItem(key) {
  eliminarDelCarrito(key);
  renderCarrito();
}

function confirmarCompra() {
  const cliente = document.getElementById('clienteNombre').value.trim();
  const telefono = document.getElementById('clienteTelefono').value.trim();
  const direccion = document.getElementById('clienteDireccion').value.trim();
  const error = document.getElementById('errorCheckout');

  if (!cliente || !telefono || !direccion) {
    error.textContent = 'Completa todos los datos de entrega';
    return;
  }

  const compras = JSON.parse(localStorage.getItem('compras') || '[]');
  compras.push({
    id: `${Date.now()}`,
    cliente,
    telefono,
    direccion,
    usuario: obtenerUsuarioActual(),
    items: obtenerCarrito(),
    total: totalCarrito(),
    fecha: new Date().toISOString(),
    estado: 'Pendiente'
  });
  localStorage.setItem('compras', JSON.stringify(compras));
  guardarCarrito([]);
  document.getElementById('carritoContenido').innerHTML = '<div class="vacio"><p>Pedido enviado. El administrador gestionara tu compra.</p><a class="btn btn-rojo" href="index.html">Volver a la tienda</a></div>';
}

renderCarrito();