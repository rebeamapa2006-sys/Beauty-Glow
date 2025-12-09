const contenedor = document.getElementById("contenedorProductos");
const filtro = document.getElementById("filtroOcasion");
const listaCarrito = document.getElementById("listaCarrito");
const btnEliminar = document.getElementById("btnEliminar");
const alertaAccion = document.getElementById("alertaAccion");

let carrito = [];

// Relación OCASIÓN → TIPO DE PRODUCTO EN LA API
const recomendaciones = {
  diario: "mascara",
  fiesta: "eyeliner",
  boda: "lipstick",
  trabajo: "foundation"
};

async function cargarProductosPorOcasion(ocasion) {
  contenedor.innerHTML = "<p class='text-center'>Cargando recomendaciones...</p>";

  const tipoProducto = recomendaciones[ocasion];

  try {
    const respuesta = await fetch(
      `https://makeup-api.herokuapp.com/api/v1/products.json?product_type=${tipoProducto}`
    );

    const datos = await respuesta.json();
    mostrarProductos(datos.slice(0, 9)); // SOLO 9 CARDS
  } catch (error) {
    contenedor.innerHTML = "<p class='text-center text-danger'>Error al cargar productos</p>";
  }
}

function mostrarProductos(productos) {
  contenedor.innerHTML = "";

  productos.forEach((producto) => {
    contenedor.innerHTML += `
      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          <img src="${producto.image_link ? producto.image_link : 'img/no-image.jpeg'}" 
          class="card-img-top" 
          alt="${producto.name}"
          onerror="this.src='img/no-image.jpeg'">

          <div class="card-body text-center">
            <h5 class="card-title">${producto.name}</h5>
            <p class="fw-bold">$${producto.price} USD</p>

            <button class="btn btn-primary btn-sm" onclick="agregarProducto('${producto.name}', this)">
              Agregar
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

// ✅ FUNCIÓN AGREGAR
function agregarProducto(nombre, boton) {
  carrito.push(nombre);

  const item = document.createElement("li");
  item.className = "list-group-item";
  item.textContent = nombre;
  listaCarrito.appendChild(item);

  // Cambio color botón → VERDE
  boton.classList.remove("btn-primary");
  boton.classList.add("btn-success");
  boton.textContent = "Agregado";

  // Alerta verde
  alertaAccion.innerHTML = `
    <div class="alert alert-success">✅ Producto agregado al carrito</div>
  `;
}

// ✅ FUNCIÓN ELIMINAR ÚLTIMO
btnEliminar.addEventListener("click", () => {
  if (carrito.length === 0) {
    alertaAccion.innerHTML = `
      <div class="alert alert-warning">⚠️ El carrito está vacío</div>
    `;
    return;
  }

  carrito.pop();
  listaCarrito.lastChild.remove();

  // Alerta roja
  alertaAccion.innerHTML = `
    <div class="alert alert-danger">❌ Producto eliminado del carrito</div>
  `;
});

// Cambia productos por ocasión
filtro.addEventListener("change", () => {
  cargarProductosPorOcasion(filtro.value);
});

// Carga inicial
cargarProductosPorOcasion("diario");
