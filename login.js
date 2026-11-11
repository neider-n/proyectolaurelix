// ===== UTILIDADES =====
function mostrarVista(id) {
  document.querySelectorAll('.vista').forEach(v => v.classList.remove('activa'));
  document.getElementById(id).classList.add('activa');
}

function toast(msg, tipo) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + (tipo || '');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.className = 'toast', 3000);
}

function marcarError(inputId, spanId, msg) {
  document.getElementById(inputId).classList.add('invalid');
  document.getElementById(spanId).textContent = msg;
}

function limpiarError(inputId, spanId) {
  document.getElementById(inputId).classList.remove('invalid');
  document.getElementById(spanId).textContent = '';
}

// ===== USUARIOS =====
function getUsuarios() {
  return JSON.parse(localStorage.getItem('usuarios') || '[]');
}

function setUsuarios(lista) {
  localStorage.setItem('usuarios', JSON.stringify(lista));
}

function buscarUsuario(nombre) {
  return getUsuarios().find(u => u.usuario.toLowerCase() === nombre.toLowerCase());
}

// ===== NAVEGACION =====
document.getElementById('irRegistro').addEventListener('click', () => {
  ['regUsuario','regEmail','regPassword','regConfirm'].forEach(id => {
    document.getElementById(id).value = '';
    document.getElementById(id).classList.remove('invalid');
  });
  ['errRegUsuario','errRegEmail','errRegPassword','errRegConfirm'].forEach(id => {
    document.getElementById(id).textContent = '';
  });
  mostrarVista('vistaRegistro');
});

document.getElementById('irLogin').addEventListener('click', () => {
  mostrarVista('vistaLogin');
});

// ===== LOGIN =====
document.getElementById('btnLogin').addEventListener('click', () => {
  const usuario  = document.getElementById('loginUsuario').value.trim();
  const password = document.getElementById('loginPassword').value;
  let ok = true;

  if (!usuario) {
    marcarError('loginUsuario', 'errLoginUsuario', 'Ingresa tu usuario');
    ok = false;
  } else {
    limpiarError('loginUsuario', 'errLoginUsuario');
  }

  if (!password) {
    marcarError('loginPassword', 'errLoginPassword', 'Ingresa tu contrasena');
    ok = false;
  } else {
    limpiarError('loginPassword', 'errLoginPassword');
  }

  if (!ok) return;

  const found = buscarUsuario(usuario);
  const esAdministrador = usuario.toLowerCase() === 'admin' && password === 'admin123';

  if (!found && !esAdministrador) {
    marcarError('loginUsuario', 'errLoginUsuario', 'Usuario no encontrado');
    return;
  }

  if (!esAdministrador && found.password !== password) {
    marcarError('loginPassword', 'errLoginPassword', 'Contrasena incorrecta');
    return;
  }

  if (document.getElementById('recuerdame').checked) {
    localStorage.setItem('recordarUsuario', usuario);
  } else {
    localStorage.removeItem('recordarUsuario');
  }

  const btn = document.getElementById('btnLogin');
  btn.disabled = true;
  btn.textContent = 'Ingresando...';

  setTimeout(() => {
    if (esAdministrador) {
      localStorage.setItem('sesionAdmin', 'true');
      localStorage.setItem('sesionActiva', 'admin');
      window.location.href = 'admin.html';
      return;
    }

    localStorage.removeItem('sesionAdmin');
    localStorage.setItem('sesionActiva', found.usuario);
    window.location.href = 'index.html';
  }, 900);
});

// ===== REGISTRO =====
document.getElementById('btnRegistro').addEventListener('click', () => {
  const usuario = document.getElementById('regUsuario').value.trim();
  const email   = document.getElementById('regEmail').value.trim();
  const pass    = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let ok = true;

  if (!usuario || usuario.length < 3) {
    marcarError('regUsuario', 'errRegUsuario', 'Minimo 3 caracteres');
    ok = false;
  } else if (buscarUsuario(usuario)) {
    marcarError('regUsuario', 'errRegUsuario', 'Ese usuario ya existe');
    ok = false;
  } else {
    limpiarError('regUsuario', 'errRegUsuario');
  }

  if (!email || !emailReg.test(email)) {
    marcarError('regEmail', 'errRegEmail', 'Correo invalido');
    ok = false;
  } else {
    limpiarError('regEmail', 'errRegEmail');
  }

  if (!pass || pass.length < 6) {
    marcarError('regPassword', 'errRegPassword', 'Minimo 6 caracteres');
    ok = false;
  } else {
    limpiarError('regPassword', 'errRegPassword');
  }

  if (!confirm || pass !== confirm) {
    marcarError('regConfirm', 'errRegConfirm', 'Las contrasenas no coinciden');
    ok = false;
  } else {
    limpiarError('regConfirm', 'errRegConfirm');
  }

  if (!ok) return;

  const btn = document.getElementById('btnRegistro');
  btn.disabled = true;
  btn.textContent = 'Creando cuenta...';

  setTimeout(() => {
    const usuarios = getUsuarios();
    usuarios.push({ usuario, email, password: pass });
    setUsuarios(usuarios);
    btn.disabled = false;
    btn.textContent = 'Crear cuenta';
    toast('Cuenta creada. Inicia sesion.', 'exito');
    document.getElementById('loginUsuario').value = usuario;
    mostrarVista('vistaLogin');
  }, 900);
});

// ===== AL CARGAR =====
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('sesionActiva')) {
    window.location.href = localStorage.getItem('sesionAdmin') === 'true' ? 'admin.html' : 'index.html';
    return;
  }
  const recordado = localStorage.getItem('recordarUsuario');
  if (recordado) {
    document.getElementById('loginUsuario').value = recordado;
    document.getElementById('recuerdame').checked = true;
  }
});

// Limpiar errores al escribir
['loginUsuario','loginPassword'].forEach((id, i) => {
  const spans = ['errLoginUsuario','errLoginPassword'];
  document.getElementById(id).addEventListener('input', () => {
    document.getElementById(id).classList.remove('invalid');
    document.getElementById(spans[i]).textContent = '';
  });
});

['regUsuario','regEmail','regPassword','regConfirm'].forEach((id, i) => {
  const spans = ['errRegUsuario','errRegEmail','errRegPassword','errRegConfirm'];
  document.getElementById(id).addEventListener('input', () => {
    document.getElementById(id).classList.remove('invalid');
    document.getElementById(spans[i]).textContent = '';
  });
});