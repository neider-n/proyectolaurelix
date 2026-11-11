function cerrarSesionAdmin() {
  localStorage.removeItem('sesionAdmin');
  localStorage.removeItem('sesionActiva');
  window.location.href = 'login.html';
}

if (localStorage.getItem('sesionAdmin') !== 'true') {
  window.location.href = 'login.html';
}

document.getElementById('btnAdminSalir').addEventListener('click', cerrarSesionAdmin);

// ===== INICIO =====

let productoAEliminar = null;

// ===== SECCIONES =====
function mostrarSeccion(seccion) {
  document.getElementById('secProductos').style.display = 'none';
  document.getElementById('secAgregar').style.display = 'none';
  document.getElementById('secCompras').style.display = 'none';

  document.getElementById('linkProductos').classList.remove('activo');
  document.getElementById('linkAgregar').classList.remove('activo');
  document.getElementById('linkCompras').classList.remove('activo');

  if (seccion === 'productos') {
    document.getElementById('secProductos').style.display = 'block';
    document.getElementById('linkProductos').classList.add('activo');
    renderTabla();
  } else if (seccion === 'agregar') {
    document.getElementById('secAgregar').style.display = 'block';
    document.getElementById('linkAgregar').classList.add('activo');
    limpiarFormulario();
    document.getElementById('tituloFormulario').textContent = 'Publicar producto';
    document.getElementById('productoId').value = '';
  } else if (seccion === 'compras') {
    document.getElementById('secCompras').style.display = 'block';
    document.getElementById('linkCompras').classList.add('activo');
    renderCompras();
  }
}

function obtenerCompras() {
  return JSON.parse(localStorage.getItem('compras') || '[]');
}

function guardarCompras(compras) {
  localStorage.setItem('compras', JSON.stringify(compras));
}

function renderCompras() {
  const compras = obtenerCompras();
  const contenedor = document.getElementById('tablaCompras');

  if (compras.length === 0) {
    contenedor.innerHTML = '<div class="vacio"><p>Aun no hay compras registradas.</p></div>';
    return;
  }

  contenedor.innerHTML = `
    <table class="tabla tabla-compras">
      <thead><tr><th>Pedido</th><th>Cliente</th><th>Entrega</th><th>Productos</th><th>Total</th><th>Fecha</th><th>Estado</th></tr></thead>
      <tbody>
        ${compras.map(compra => `
          <tr>
            <td>#${compra.id}</td>
            <td>${compra.cliente}<br><small>${compra.telefono}</small></td>
            <td>${compra.direccion}</td>
            <td>${compra.items.map(item => `${item.nombre} x${item.cantidad}`).join('<br>')}</td>
            <td>$${compra.total.toFixed(2)}</td>
            <td>${new Date(compra.fecha).toLocaleDateString('es-CO')}</td>
            <td>
              <select class="estado-compra" onchange="actualizarEstadoCompra('${compra.id}', this.value)">
                ${['Pendiente','En preparacion','Enviado','Entregado','Cancelado'].map(estado => `<option ${compra.estado === estado ? 'selected' : ''}>${estado}</option>`).join('')}
              </select>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function actualizarEstadoCompra(id, estado) {
  const compras = obtenerCompras();
  const compra = compras.find(item => item.id === id);
  if (!compra) return;
  compra.estado = estado;
  guardarCompras(compras);
  mostrarToast('Estado de compra actualizado', 'exito');
}

// ===== TABLA =====
function renderTabla() {
  const productos = obtenerProductos();
  const contenedor = document.getElementById('tablaProductos');

  if (productos.length === 0) {
    contenedor.innerHTML = `<div class="vacio"><p>No hay productos cargados.</p></div>`;
    return;
  }

  contenedor.innerHTML = `
    <table class="tabla">
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Nombre</th>
          <th>Marca</th>
          <th>Categoria</th>
          <th>Precio</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${productos.map(p => `
          <tr>
            <td><img src="${p.imagen}" alt="${p.nombre}" /></td>
            <td>${p.nombre}</td>
            <td>${p.marca}</td>
            <td><span class="tag-categoria">${p.categoria}</span></td>
            <td>$${p.precio.toFixed(2)}</td>
            <td>
              <div class="acciones-tabla">
                <button class="btn-editar" onclick="editarProducto(${p.id})">Editar</button>
                <button class="btn-eliminar" onclick="pedirEliminar(${p.id})">Eliminar</button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// ===== FORMULARIO =====
function limpiarFormulario() {
  ['fNombre','fMarca','fPrecio','fImagen','fPresentaciones','fBeneficios','fDescripcion'].forEach(id => {
    const el = document.getElementById(id);
    el.value = '';
    el.classList.remove('invalid');
  });
  document.getElementById('fImagenArchivo').value = '';
  document.getElementById('vistaPreviaImagen').removeAttribute('src');
  document.getElementById('vistaPreviaImagen').classList.remove('visible');
  document.getElementById('fCategoria').value = '';
  document.getElementById('fCategoria').classList.remove('invalid');
  ['eFNombre','eFMarca','eFPrecio','eFCategoria','eFImagen','eFPresentaciones','eFBeneficios','eFDescripcion'].forEach(id => {
    document.getElementById(id).textContent = '';
  });
}

function editarProducto(id) {
  const p = obtenerProductoPorId(id);
  if (!p) return;

  mostrarSeccion('agregar');
  document.getElementById('tituloFormulario').textContent = 'Editar producto';
  document.getElementById('productoId').value = p.id;
  document.getElementById('fNombre').value = p.nombre;
  document.getElementById('fMarca').value = p.marca;
  document.getElementById('fPrecio').value = p.precio;
  document.getElementById('fCategoria').value = p.categoria;
  document.getElementById('fImagen').value = p.imagen;
  document.getElementById('fImagenArchivo').value = '';
  document.getElementById('vistaPreviaImagen').src = p.imagen;
  document.getElementById('vistaPreviaImagen').classList.add('visible');
  document.getElementById('fPresentaciones').value = (p.presentaciones || []).join(',');
  document.getElementById('fBeneficios').value = (p.beneficios || []).join(',');
  document.getElementById('fDescripcion').value = p.descripcion;
}

// ===== VALIDAR Y GUARDAR =====
document.getElementById('fImagenArchivo').addEventListener('change', () => {
  const archivo = document.getElementById('fImagenArchivo').files[0];
  const vistaPrevia = document.getElementById('vistaPreviaImagen');

  if (!archivo) return;

  if (!['image/jpeg', 'image/png'].includes(archivo.type) || archivo.size > 2 * 1024 * 1024) {
    document.getElementById('eFImagen').textContent = 'Selecciona un JPG, JPEG o PNG de maximo 2 MB';
    document.getElementById('fImagenArchivo').classList.add('invalid');
    vistaPrevia.classList.remove('visible');
    return;
  }

  document.getElementById('eFImagen').textContent = '';
  document.getElementById('fImagenArchivo').classList.remove('invalid');
  vistaPrevia.src = URL.createObjectURL(archivo);
  vistaPrevia.classList.add('visible');
});

document.getElementById('btnGuardar').addEventListener('click', async () => {
  const nombre      = document.getElementById('fNombre').value.trim();
  const marca       = document.getElementById('fMarca').value.trim();
  const precio      = document.getElementById('fPrecio').value.trim();
  const categoria   = document.getElementById('fCategoria').value;
  let imagen       = document.getElementById('fImagen').value.trim();
  const archivoImagen = document.getElementById('fImagenArchivo').files[0];
  const presentacionesRaw = document.getElementById('fPresentaciones').value.trim();
  const beneficiosRaw = document.getElementById('fBeneficios').value.trim();
  const descripcion = document.getElementById('fDescripcion').value.trim();
  let ok = true;

  function marcar(inputId, spanId, msg) {
    document.getElementById(inputId).classList.add('invalid');
    document.getElementById(spanId).textContent = msg;
    ok = false;
  }

  function limpiar(inputId, spanId) {
    document.getElementById(inputId).classList.remove('invalid');
    document.getElementById(spanId).textContent = '';
  }

  if (!nombre)      marcar('fNombre','eFNombre','Campo obligatorio');
  else              limpiar('fNombre','eFNombre');

  if (!marca)       marcar('fMarca','eFMarca','Campo obligatorio');
  else              limpiar('fMarca','eFMarca');

  if (!precio || isNaN(precio) || parseFloat(precio) <= 0)
                    marcar('fPrecio','eFPrecio','Ingresa un precio valido');
  else              limpiar('fPrecio','eFPrecio');

  if (!categoria)   marcar('fCategoria','eFCategoria','Selecciona una categoria');
  else              limpiar('fCategoria','eFCategoria');

  if (!imagen && !archivoImagen) marcar('fImagen','eFImagen','Selecciona una imagen o ingresa una URL');
  else              limpiar('fImagen','eFImagen');

  if (archivoImagen && (!['image/jpeg', 'image/png'].includes(archivoImagen.type) || archivoImagen.size > 2 * 1024 * 1024)) {
    marcar('fImagenArchivo', 'eFImagen', 'Selecciona un JPG, JPEG o PNG de maximo 2 MB');
  }

  if (!presentacionesRaw) marcar('fPresentaciones','eFPresentaciones','Ingresa al menos una presentacion');
  else                    limpiar('fPresentaciones','eFPresentaciones');

  if (!beneficiosRaw) marcar('fBeneficios','eFBeneficios','Ingresa al menos un beneficio');
  else                limpiar('fBeneficios','eFBeneficios');

  if (!descripcion) marcar('fDescripcion','eFDescripcion','Campo obligatorio');
  else              limpiar('fDescripcion','eFDescripcion');

  if (!ok) return;

  if (archivoImagen) {
    imagen = await new Promise((resolver, rechazar) => {
      const lector = new FileReader();
      lector.onload = () => resolver(lector.result);
      lector.onerror = rechazar;
      lector.readAsDataURL(archivoImagen);
    });
  }

  const presentaciones = presentacionesRaw.split(',').map(item => item.trim()).filter(item => item !== '');
  const beneficios = beneficiosRaw.split(',').map(item => item.trim()).filter(item => item !== '');

  const idExistente = document.getElementById('productoId').value;
  const productos = obtenerProductos();

  if (idExistente) {
    // Editar
    const index = productos.findIndex(p => p.id === parseInt(idExistente));
    if (index !== -1) {
      productos[index] = {
        ...productos[index],
        nombre, marca, precio: parseFloat(precio),
        categoria, imagen, presentaciones, beneficios, descripcion
      };
    }
    guardarProductos(productos);
    mostrarToast('Producto actualizado', 'exito');
  } else {
    // Agregar nuevo
    const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
    productos.push({
      id: nuevoId, nombre, marca,
      precio: parseFloat(precio),
      categoria, imagen, presentaciones, beneficios, descripcion
    });
    guardarProductos(productos);
    mostrarToast('Producto agregado', 'exito');
  }

  mostrarSeccion('productos');
});

// ===== ELIMINAR =====
function pedirEliminar(id) {
  productoAEliminar = id;
  document.getElementById('modalEliminar').classList.add('abierto');
}

function cerrarModal() {
  productoAEliminar = null;
  document.getElementById('modalEliminar').classList.remove('abierto');
}

document.getElementById('btnConfirmarEliminar').addEventListener('click', () => {
  if (!productoAEliminar) return;
  const productos = obtenerProductos().filter(p => p.id !== productoAEliminar);
  guardarProductos(productos);
  cerrarModal();
  renderTabla();
  mostrarToast('Producto eliminado', 'exito');
});

// ===== CARGAR =====
mostrarSeccion('productos');