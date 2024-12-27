// Selecciona el elemento HTML donde se mostrarán los Pokémon
const listaPokemon = document.querySelector("#listaPokemon");

// Selecciona todos los botones del encabezado con la clase 'btn-header'
const botonesHeader = document.querySelectorAll(".btn-header");

// Define la URL base de la API de Pokémon
let URL = "https://pokeapi.co/api/v2/pokemon/";

// Realiza una solicitud a la API para obtener información de los primeros 151 Pokémon
for (let i = 1; i <= 151; i++) {
    fetch(URL + i) // Realiza una solicitud a la URL con el número del Pokémon
        .then((response) => response.json()) // Convierte la respuesta en un objeto JSON
        .then(data => mostrarPokemon(data)); // Llama a la función 'mostrarPokemon' con los datos obtenidos
}

// Función para mostrar la información de un Pokémon en el DOM
function mostrarPokemon(poke) {

    // Obtiene los tipos del Pokémon y los formatea en etiquetas HTML
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join(''); // Convierte el array de tipos en una cadena de texto

    // Formatea el ID del Pokémon para que tenga 3 dígitos (ejemplo: 001, 010, 100)
    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    // Crea un contenedor (div) para mostrar la información del Pokémon
    const div = document.createElement("div");
    div.classList.add("pokemon"); // Agrega la clase 'pokemon' al div
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p> <!-- Muestra el ID del Pokémon -->
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}"> <!-- Imagen del Pokémon -->
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p> <!-- ID del Pokémon -->
                <h2 class="pokemon-nombre">${poke.name}</h2> <!-- Nombre del Pokémon -->
            </div>
            <div class="pokemon-tipos">
                ${tipos} <!-- Tipos del Pokémon -->
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}m</p> <!-- Altura del Pokémon -->
                <p class="stat">${poke.weight}kg</p> <!-- Peso del Pokémon -->
            </div>
        </div>
    `;

    // Agrega el contenedor del Pokémon al listado en el DOM
    listaPokemon.append(div);
}

// Agrega eventos a los botones para filtrar Pokémon por tipo
botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id; // Obtiene el ID del botón que fue clickeado

    listaPokemon.innerHTML = ""; // Limpia el listado actual de Pokémon

    // Realiza nuevamente las solicitudes para los primeros 151 Pokémon
    for (let i = 1; i <= 151; i++) {
        fetch(URL + i)
            .then((response) => response.json()) // Convierte la respuesta en un objeto JSON
            .then(data => {
                // Si se selecciona 'ver-todos', muestra todos los Pokémon
                if (botonId === "ver-todos") {
                    mostrarPokemon(data);
                } else {
                    // Obtiene los tipos del Pokémon y verifica si coinciden con el ID del botón
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) { 
                        mostrarPokemon(data); // Muestra solo los Pokémon del tipo seleccionado
                    }
                }
            });
    }
}));
