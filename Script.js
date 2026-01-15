
// Archivo JS corregido. Ajustado para evitar errores de referencia y duplicados.
let precioBase = 0;
let precioFinal = 0;
let esEstudiante = false;

// ------------------ CONFIGURACIÓN DE PRODUCTOS ------------------
const productos = [
  { categoria: 'anillos', nombre: 'Anillo Pierina', precio: 159, descripcion: 'Anillo de plata 950 con piedra brillante.', imagen: 'img/anillo1.png', video: 'videos/anillo1.mp4' },
  { categoria: 'anillos', nombre: 'Anillo Luna', precio: 139, descripcion: 'Diseño elegante inspirado en la luna.', imagen: 'img/anillo2.png' },
  { categoria: 'pulseras', nombre: 'Pulsera Estrella', precio: 129, descripcion: 'Pulsera delicada con diseño de estrella.', imagen: 'img/pulsera1.png' },
  { categoria: 'pulseras', nombre: 'Pulsera Amor', precio: 119, descripcion: 'Pulsera símbolo del amor eterno.', imagen: 'img/pulsera2.jpeg' },
  { categoria: 'collares', nombre: 'Collar Aurora', precio: 179, descripcion: 'Collar de plata con brillo celestial.', imagen: 'img/collar1.png' },
  { categoria: 'collares', nombre: 'Collar Corazón', precio: 169, descripcion: 'Collar con dije de corazón.', imagen: 'img/collar2.jpeg' }
];

const grid = document.getElementById('productGrid');
let productoActual = null;

// ------------------ MOSTRAR PRODUCTOS ------------------
function mostrarProductos(categoria = 'todos') {
  grid.innerHTML = '';
  const filtrados = categoria === 'todos' ? productos : productos.filter(p => p.categoria === categoria);
  filtrados.forEach(p => {
    const card = document.createElement('div');
    card.classList.add('product-card');

    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p class="price">S/ ${p.precio.toFixed(2)}</p>
    `;

    card.onclick = () => abrirDetalle(p);
    grid.appendChild(card);
  });
}
mostrarProductos();

// Botones de categorías
if (document.querySelectorAll('.category-btn')) {
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => mostrarProductos(btn.dataset.category));
  });
}

// ------------------ DETALLE DE PRODUCTO ------------------
const seccionCatalogo = document.querySelector('.product-section');
const seccionDetalle = document.getElementById('detalleProducto');
const detalleTitulo = document.getElementById('detalleTitulo');
const detallePrecio = document.getElementById('detallePrecio');
const detalleDescripcion = document.getElementById('detalleDescripcion');

const videoContenedor = document.getElementById('detalleVideoContainer');
const videoElemento = document.getElementById('detalleVideo');
const imgContainer = document.getElementById('detalleImagenContainer');
const imgElement = document.getElementById('detalleImagen');

function abrirDetalle(p) {

    limpiarDatosCheckout(); // 🔥 LIMPIA TODO

  productoActual = p;
  seccionCatalogo.style.display = 'none';
  seccionDetalle.style.display = 'block';

  // Mostrar video si existe
  if (p.video) {
    videoContenedor.style.display = 'block';
    videoElemento.querySelector('source').src = p.video;
    videoElemento.load();
    imgContainer.style.display = 'none';
  } else {
    videoContenedor.style.display = 'none';
    imgContainer.style.display = 'block';
    imgElement.src = p.imagen;
  }

  detalleTitulo.textContent = p.nombre;
  detallePrecio.textContent = `S/ ${p.precio.toFixed(2)}`;
  detalleDescripcion.textContent = p.descripcion;

  mostrarRecomendados(p);

  // Mostrar grabado
  document.getElementById('grabado-info').style.display = 'flex';
}

// ------------------ RECOMENDADOS ------------------
function mostrarRecomendados(p) {
  const cont = document.getElementById('recomendadosGrid');
  cont.innerHTML = '';

  const recomendados = productos
    .filter(item => item.categoria === p.categoria && item.nombre !== p.nombre)
    .slice(0, 3);

  recomendados.forEach(r => {
    const div = document.createElement('div');
    div.classList.add('recomendados-card');
    div.innerHTML = `
      <img src="${r.imagen}" alt="${r.nombre}">
      <h4>${r.nombre}</h4>
      <p>S/ ${r.precio.toFixed(2)}</p>
    `;
    div.onclick = () => abrirDetalle(r);
    cont.appendChild(div);
  });
}

// ------------------ VOLVER ------------------
const btnVolver = document.getElementById('btnVolverCatalogo');
btnVolver.onclick = () => {
    limpiarDatosCheckout(); // 🔥 LIMPIA TODO

  seccionDetalle.style.display = 'none';
  document.getElementById('grabado-info').style.display = 'none';
  seccionCatalogo.style.display = 'block';
};

// ------------------ FORMULARIO DE PAGO ------------------
const pagoModal = document.getElementById('pagoModal');
const cerrarPago = document.getElementById('cerrarPago');
const formPago = document.getElementById('formPago');
const pagoImg = document.getElementById('pagoImg');
const pagoNombre = document.getElementById('pagoNombre');
const pagoPrecio = document.getElementById('pagoPrecio');
const subtotalEl = document.getElementById('subtotal');
const totalEl = document.getElementById('total');

function abrirFormularioPago() {
  if (!productoActual) return;

  pagoImg.src = productoActual.imagen;
  pagoNombre.textContent = productoActual.nombre;
  pagoPrecio.textContent = `S/ ${productoActual.precio.toFixed(2)}`;
  subtotalEl.textContent = `S/ ${productoActual.precio.toFixed(2)}`;

  actualizarEnvio(); // 👈 AQUI SE AGREGA

  pagoModal.style.display = 'flex';
}


document.getElementById('btnDetalleEntrega').onclick = abrirFormularioPago;
document.getElementById('btnDetalleComprar').onclick = abrirFormularioPago;

cerrarPago.onclick = () => pagoModal.style.display = 'none';
window.onclick = e => { if (e.target === pagoModal) pagoModal.style.display = 'none'; };

formPago.onsubmit = e => {
  e.preventDefault();

  const nombre = document.getElementById('nombrePago').value;
  const apellido = document.getElementById('apellidoPago').value;
  const telefono = document.getElementById('telefonoPago').value;
  const direccion = document.getElementById('direccionPago').value;
  const ciudad = document.getElementById('ciudadPago').value;
  const provincia = document.getElementById('provinciaPago').value;
  const correo = document.getElementById('correoPago').value;

  const msg = `
💎 *Nuevo Pedido - Pago Contra Entrega*
🛍 Producto: ${productoActual.nombre}
💰 Precio: S/ ${productoActual.precio.toFixed(2)}
👤 Cliente: ${nombre} ${apellido}
📞 Teléfono: ${telefono}
🏠 Dirección: ${direccion}, ${ciudad}, ${provincia}
📧 Correo: ${correo}
`;

  window.open(`https://wa.me/51912155608?text=${encodeURIComponent(msg)}`, '_blank');
  pagoModal.style.display = 'none';
  formPago.reset();
};

// ------------------ ZOOM ------------------
const zoomImg = document.getElementById("detalleImagen");
const zoomLens = document.getElementById("zoomLens");

zoomImg?.addEventListener("mousemove", moverZoom);
zoomImg?.addEventListener("mouseenter", () => zoomLens.style.opacity = 1);
zoomImg?.addEventListener("mouseleave", () => zoomLens.style.opacity = 0);

function moverZoom(e) {
  const rect = zoomImg.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const posX = (x / rect.width) * 100;
  const posY = (y / rect.height) * 100;

  zoomLens.style.left = `${x - zoomLens.offsetWidth / 2}px`;
  zoomLens.style.top = `${y - zoomLens.offsetHeight / 2}px`;

  zoomLens.style.backgroundImage = `url(${zoomImg.src})`;
  zoomLens.style.backgroundPosition = `${posX}% ${posY}%`;
}
// DETECTAR CLIC EN CADA TARJETA DE PRODUCTO
document.addEventListener("click", function (e) {
  const card = e.target.closest(".product-card");
  if (!card) return;

  const productId = card.dataset.id;
  openProductDetail(productId);
});

// FUNCIÓN PARA MOSTRAR DETALLE
function openProductDetail(id) {
  const product = products.find(p => p.id == id);
  if (!product) return;

  document.getElementById("productos").style.display = "none";
  document.getElementById("productDetail").style.display = "flex";

  document.getElementById("detailImage").src = product.image;
  document.getElementById("detailTitle").textContent = product.name;
  document.getElementById("detailPrice").textContent = "S/ " + product.price;
  document.getElementById("detailDescription").textContent = product.description;
}

// BOTÓN VOLVER
function volverCatalogo() {
  document.getElementById("productDetail").style.display = "none";
  document.getElementById("productos").style.display = "block";
}
// ------------------ ENVÍO LIMA / PROVINCIA ------------------

const regionSelect = document.getElementById("checkoutRegion");
const envioForm = document.getElementById("envioTexto"); // izquierda
const envioResumen = document.getElementById("envioTextoResumen"); // derecha
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutAdelanto = document.getElementById("checkoutAdelanto");

function actualizarEnvioCheckout() {
  if (!productoActual) return;

  const subtotal = productoActual.precio;

  if (regionSelect.value === "lima") {
    envioForm.textContent = "GRATIS 🚚";
    envioResumen.textContent = "GRATIS";

    checkoutSubtotal.textContent = `S/ ${subtotal.toFixed(2)}`;
    checkoutTotal.textContent = `S/ ${subtotal.toFixed(2)}`;
    checkoutAdelanto.textContent = "(Adelanto S/ 20)";
  }

  if (regionSelect.value === "provincia") {
    envioForm.textContent = "S/ 10.00 🚚";
    envioResumen.textContent = "S/ 10.00";

    checkoutSubtotal.textContent = `S/ ${subtotal.toFixed(2)}`;
    checkoutTotal.textContent = `S/ ${(subtotal + 10).toFixed(2)}`;
    checkoutAdelanto.textContent = "(Adelanto S/ 30)";
  }
}

// Detectar cambio de zona
regionSelect.addEventListener("change", actualizarEnvioCheckout);
document.addEventListener("DOMContentLoaded", () => {

  const regionSelect = document.getElementById("checkoutRegion");
  const envioForm = document.getElementById("envioTexto");
  const envioResumen = document.getElementById("envioTextoResumen");
  const checkoutSubtotal = document.getElementById("checkoutSubtotal");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const checkoutAdelanto = document.getElementById("checkoutAdelanto");

  regionSelect.addEventListener("change", () => {
    const subtotal = parseFloat(
      checkoutSubtotal.textContent.replace("S/ ", "")
    );

    if (regionSelect.value === "lima") {
      envioForm.textContent = "GRATIS 🚚";
      envioResumen.textContent = "GRATIS";
      checkoutTotal.textContent = `S/ ${subtotal.toFixed(2)}`;
      checkoutAdelanto.textContent = "(Adelanto S/ 20)";
    }

    if (regionSelect.value === "provincia") {
      envioForm.textContent = "S/ 10.00 🚚";
      envioResumen.textContent = "S/ 10.00";
      checkoutTotal.textContent = `S/ ${(subtotal + 10).toFixed(2)}`;
      checkoutAdelanto.textContent = "(Adelanto S/ 30)";
    }
  });

});

// ================== CHECKOUT RESUMEN ==================

function actualizarResumenCheckout() {
  if (!productoActual) return;

  const provincia = document.getElementById("provinciaPago")?.value || "";
  const metodoPago = document.querySelector('input[name="pago"]:checked')?.value || "-";

  let zona = "Lima";
  let envio = 0;
  let adelanto = 20;

  if (provincia && provincia.toLowerCase() !== "lima") {
    zona = "Provincia";
    envio = 10;
    adelanto = 30;
  }

  const subtotal = productoActual.precio;
  const total = subtotal + envio;

  document.getElementById("checkoutZona").textContent = zona;
  document.getElementById("checkoutMetodoPago").textContent =
    metodoPago.charAt(0).toUpperCase() + metodoPago.slice(1);

  document.getElementById("checkoutSubtotal").textContent = `S/ ${subtotal.toFixed(2)}`;
  document.getElementById("envioTextoResumen").textContent =
    envio === 0 ? "GRATIS" : `S/ ${envio.toFixed(2)}`;

  document.getElementById("checkoutTotal").textContent = `S/ ${total.toFixed(2)}`;
  document.getElementById("checkoutAdelanto").textContent = `S/ ${adelanto}`;
}

// Detectar cambios
document.getElementById("provinciaPago")?.addEventListener("change", actualizarResumenCheckout);
document.querySelectorAll('input[name="pago"]').forEach(el => {
  el.addEventListener("change", actualizarResumenCheckout);
});

// ================== WHATSAPP ==================

document.getElementById("btnFinalizarWhatsApp")?.addEventListener("click", () => {
  if (!productoActual) return;

const zona = document.getElementById("checkoutZona").textContent;
  const metodo = document.getElementById("checkoutMetodoPago").textContent;
  const total = document.getElementById("checkoutTotal").textContent;
  const adelanto = document.getElementById("checkoutAdelanto").textContent;
  const talla = document.getElementById("checkoutTalla").textContent;


  const mensaje = `Hola 👋 quiero realizar mi pedido:

🛍 Producto: ${productoActual.nombre}
💍 Talla: ${talla}
📍 Zona: ${zona}
🚚 Envío: ${zona === "Lima" ? "GRATIS" : "S/ 10"}
💳 Método de pago: ${metodo}
💰 Total: ${total}
🔐 Adelanto: S/ ${adelanto}

Quedo atento(a) 😊`;

  const telefono = "51912155608"; // TU NÚMERO
  window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, "_blank");
});
// ================== TALLA EN RESUMEN ==================
function actualizarTallaResumen() {
  const tallaHombre = document.getElementById("tallaHombre")?.value;
  const tallaMujer = document.getElementById("tallaMujer")?.value;

  let tallaFinal = "-";

  if (tallaHombre && tallaMujer) {
    tallaFinal = `H ${tallaHombre} / M ${tallaMujer}`;
  } else if (tallaHombre) {
    tallaFinal = tallaHombre;
  } else if (tallaMujer) {
    tallaFinal = tallaMujer;
  }

  document.getElementById("checkoutTalla").textContent = tallaFinal;
}

// Detectar cambio de talla
document.getElementById("tallaHombre")?.addEventListener("change", actualizarTallaResumen);
document.getElementById("tallaMujer")?.addEventListener("change", actualizarTallaResumen);

function limpiarDatosCheckout() {
  console.log("🧹 LIMPIANDO TODO");

  // -------- INPUTS TEXTO --------
  document.querySelectorAll(
    "input[type='text'], input[type='email'], input[type='tel']"
  ).forEach(i => i.value = "");

  // -------- SELECTS --------
  document.querySelectorAll("select").forEach(s => s.selectedIndex = 0);

  // -------- RADIOS --------
  document.querySelectorAll("input[type='radio']").forEach(r => r.checked = false);

  // -------- RESUMEN --------
  const limpiar = id => {
    const el = document.getElementById(id);
    if (el) el.textContent = "-";
  };

  limpiar("checkoutTalla");
  limpiar("checkoutZona");
  limpiar("checkoutMetodoPago");
  limpiar("checkoutSubtotal");
  limpiar("checkoutTotal");

  const envio = document.getElementById("envioTextoResumen");
  if (envio) envio.textContent = "GRATIS";

  const adelanto = document.getElementById("checkoutAdelanto");
  if (adelanto) adelanto.textContent = "S/ 20";
}
