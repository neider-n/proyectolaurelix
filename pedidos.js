verificarSesion();
renderNavbar('');

function renderPedidos() {
  const usuario = obtenerUsuarioActual();
  const compras = JSON.parse(localStorage.getItem('compras') || '[]').filter(compra => compra.usuario === usuario);
  const contenedor = document.getElementById('pedidosContenido');

  if (!compras.length) {
    contenedor.innerHTML = `
      <div class="pedido-vacio">
        <p>Aún no tienes compras realizadas.</p>
        <a href="index.html" class="btn btn-rojo">Ver perfumes</a>
      </div>
    `;
    return;
  }

  contenedor.innerHTML = compras.map(compra => `
    <article class="pedido-item">
      <div class="pedido-top">
        <h3>#${String(compra.id).slice(-6)}</h3>
        <span class="pedido-estado">${compra.estado || 'Pendiente'}</span>
      </div>

      <div class="pedido-meta">
        <div>Fecha: ${new Date(compra.fecha).toLocaleDateString('es-CO')}</div>
        <div>Entrega: ${compra.direccion}</div>
        <div>Total: $${Number(compra.total || 0).toFixed(2)}</div>
      </div>

      <ul class="pedido-items">
        ${(compra.items || []).map(item => `
          <li>
            <span>${item.nombre} x${item.cantidad}</span>
            <span>$${(Number(item.precio) * Number(item.cantidad || 1)).toFixed(2)}</span>
          </li>
        `).join('')}
      </ul>
    </article>
  `).join('');
}

renderPedidos();
