let data = []; // Variable global para almacenar todos los libros
const contenedorResultados = document.getElementById("book-container");
const pagesRange = document.getElementById("pagesRange");
const rangeValue = document.getElementById("rangeValue");
const filtro = document.getElementById("Filtro");
const contador = document.getElementById("contador");

// Almacenar los libros favoritos y sus índices originales
let favoritos = [];
let favoritosIndices = [];

// Cargar datos desde el archivo JSON
const getData = async () => {
  try {
    const response = await fetch("./libros.json");
    const jsonData = await response.json();
    data = jsonData.library; // Guardar los datos globalmente
    console.log("Datos cargados:", data); // Verifica que los datos se cargan correctamente
    actualizarContador(data); // Pasar el array completo de libros a la función actualizarContador
    renderizar(data); // Pasar el array completo de libros a la función renderizar
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
};

getData();

// Renderizar los libros en el contenedor
const renderizar = (data) => {
  contenedorResultados.innerHTML = ""; // Limpiar el contenido previo

  data.forEach((item, index) => {
    contenedorResultados.innerHTML += `
      <div class="libro" data-index="${index}">
        <h2>${item.book.title}</h2>
        <img src="${item.book.cover}" alt="${item.book.title}" />
        <p><strong>Autor:</strong> ${item.book.author.name}</p>
        <p><strong>Páginas:</strong> ${item.book.pages}</p>
        <p><strong>Género:</strong> ${item.book.genre}</p>
        <p><strong>Descripción:</strong> ${item.book.synopsis}</p>
        <p><strong>Año:</strong> ${item.book.year}</p>
        <p><strong>ISBN:</strong> ${item.book.ISBN}</p>
        <button class="btn btn-primary" data-index="${index}">Agregar a favoritos</button>
      </div>
    `;
  });

  // Agregar eventos a los botones "Agregar a favoritos"
  const botones = contenedorResultados.querySelectorAll("button");
  botones.forEach((boton) => {
    boton.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      agregarAFavoritos(index);
    });
  });
};

// Actualizar el contador de libros
const actualizarContador = (filteredData) => {
  contador.textContent = `${filteredData.length} libros`;
};

// Agregar libro a favoritos
const agregarAFavoritos = (index) => {
  const libroFavorito = data.splice(index, 1)[0]; // Eliminar libro de data y agregarlo a favoritos
  favoritos.push(libroFavorito);
  favoritosIndices.push(parseInt(index, 10)); // Guardar el índice original
  renderizar(data); // Volver a renderizar la lista de libros disponibles
  renderizarFavoritos(); // Renderizar la lista de favoritos
  actualizarContador(data); // Actualizar contador con la lista de libros filtrados
};

// Eliminar libro de favoritos y devolverlo a la lista principal en su posición original
const eliminarDeFavoritos = (index) => {
  const libro = favoritos.splice(index, 1)[0]; // Eliminar libro de favoritos
  const originalIndex = favoritosIndices.splice(index, 1)[0]; // Obtener el índice original
  data.splice(originalIndex, 0, libro); // Insertar el libro en su posición original
  renderizar(data); // Volver a renderizar la lista de libros disponibles
  renderizarFavoritos(); // Renderizar la lista de favoritos
  actualizarContador(data); // Actualizar contador con la lista de libros filtrados
};

// Renderizar los favoritos en el aside
const renderizarFavoritos = () => {
  const aside = document.querySelector("aside");
  aside.innerHTML = ""; // Limpiar el contenido previo

  favoritos.forEach((item, index) => {
    const contenedorFavoritos = document.createElement("div");
    contenedorFavoritos.innerHTML = `
      <h2>${item.book.title}</h2>
      <img src="${item.book.cover}" alt="${item.book.title}" />
      <p><strong>Autor:</strong> ${item.book.author.name}</p>
      <p><strong>Páginas:</strong> ${item.book.pages}</p>
      <p><strong>Género:</strong> ${item.book.genre}</p>
      <p><strong>Descripción:</strong> ${item.book.synopsis}</p>
      <p><strong>Año:</strong> ${item.book.year}</p>
      <p><strong>ISBN:</strong> ${item.book.ISBN}</p>
      <button class="btn btn-primary" data-index="${index}">Eliminar de favoritos</button>
    `;

    aside.appendChild(contenedorFavoritos);

    // Agregar evento al botón "Eliminar de favoritos"
    const eliminarBoton = contenedorFavoritos.querySelector("button");
    eliminarBoton.addEventListener("click", () => {
      eliminarDeFavoritos(index);
    });
  });
};

// Manejar el cambio en el rango
const handleRangeChange = () => {
  const maxPages = parseInt(pagesRange.value, 10);
  rangeValue.textContent = maxPages;

  let filtrado = data;

  // Filtrar los libros por el número de páginas solo si el rango no es 0
  if (maxPages > 0) {
    filtrado = data.filter((item) => item.book.pages <= maxPages);
  }

  // Aplicar también el filtro por género
  filtrado = applyGenreFilter(filtrado);

  // Actualizar el contador con los datos filtrados
  actualizarContador(filtrado);
};

// Manejar el cambio en el select
const handleSelectChange = () => {
  console.log("Valor del filtro seleccionado:", filtro.value); // Verifica el valor seleccionado

  // Aplicar filtro por género y número de páginas
  handleRangeChange(); // Reaplicar el filtro de rango
};

// Aplicar filtro por género
const applyGenreFilter = (filteredData) => {
  const selectedGenre = filtro.value;
  let result = filteredData;

  if (selectedGenre !== "Todos") {
    result = filteredData.filter((item) => item.book.genre === selectedGenre);
  }

  console.log("Datos filtrados por género:", result); // Verifica el filtrado por género

  // Renderizar los libros filtrados
  renderizar(result);
  return result;
};

// Agregar event listeners
pagesRange.addEventListener("input", handleRangeChange);
filtro.addEventListener("change", handleSelectChange);

// Inicializar con el rango actual
handleRangeChange();
