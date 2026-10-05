/* NOTA PARA MIS COMPAÑEROS 
    Hay notitas para css y html, busca HTML o CSS para encontrarlas
    Si quieres entender el codigo he puesto notas en los metodos principales
*/

/* APARTADO DE FILTRADO */

// Nombres (Cosas de la api)

const traductorCategorias = {
    "Personajes": "people",
    "Películas": "films",
    "Planetas": "planets",
    "Especies": "species",
    "Vehículos": "vehicles",
    "Naves Estelares": "starships"
}

const filtrosCategorias = {
    people: [
        { key: "height", name: "Altura (cm)", placeholder: "Ej. 172", type: "number" },
        { key: "mass", name: "Peso (kg)", placeholder: "Ej. 77", type: "number" },
        { key: "gender", name: "Género", type: "select",
          options: [["", "Cualquiera"], ["male", "Masculino"], ["female", "Femenino"], ["n/a", "No aplicable"], ["hermaphrodite", "Hermafrodita"]] }
    ],

    planets: [
        { key: "climate", name: "Clima", placeholder: "Ej. Arid", english: true },
        { key: "terrain", name: "Terreno", placeholder: "Ej. Desert", english: true },
        { key: "population", name: "Población", placeholder: "Ej. 200000", type: "number" }
    ],

    films: [
        { key: "director", name: "Director", placeholder: "Ej. George Lucas" },
        { key: "producer", name: "Productor", placeholder: "Ej. Rick McCallum" },
        { key: "episode_id", name: "Número del episodio", placeholder: "Ej. 4", type: "number" }
    ],

    species: [
        { key: "classification", name: "Clasificación biológica", placeholder: "Ej. Mammal", english: true },
        { key: "language", name: "Idioma", placeholder: "Ej. Shyriiwook", english: true },
        { key: "designation", name: "Designación", placeholder: "Ej. Sentient", english: true }
    ],

    vehicles: [
        { key: "vehicle_class", name: "Clase de vehículo", placeholder: "Ej. Wheeled", english: true },
        { key: "manufacturer", name: "Fabricante", placeholder: "Ej. Incom Corporation" },
        { key: "crew", name: "Número de tripulantes", placeholder: "Ej. 2" }
    ],

    starships: [
        { key: "starship_class", name: "Clase de nave", placeholder: "Ej. Starfighter", english: true },
        { key: "manufacturer", name: "Fabricante", placeholder: "Ej. Incom Corporation" },
        { key: "crew", name: "Número de tripulantes", placeholder: "Ej. 4" }
    ]
}


// Cosas del HTML

// Desplegable para seleccionar la categoría (personajes, películas, planetas, etc.)


// Sección que contiene los filtros
const filtrosSection = document.getElementById("filtrosSection")

// Div donde el JS crea y coloca los filtros
const filtrosContainer = document.getElementById("filtrosContainer")

// Título de la sección de filtros
const filtrosTitle = document.getElementById("filtrosTitle")



// Filtros como tal (En la web, lo de la API lo hace Jason)


function obtenerCategoria() {
    const selectorCategoria = document.getElementById("selectorCategoria")
    const categoria = selectorCategoria.value || "people" // Si no hay valor pone "people"

    return traductorCategorias[categoria]
}

function obtenerValorBusqueda() {
    const inputBusqueda = document.getElementById("inputBusqueda")
    return inputBusqueda.value.trim() // Lo que ha puesto el usuario (sin espacios a los bordes)
}

const botonBusqueda = document.getElementById("botonBusqueda").onclick = () => {
    main(obtenerCategoria(), obtenerValorBusqueda());
}

// Leemos lo que hayan escrito en los filtros

function obtenerFiltros() {
    const filtros = {}

    // Leemos todos los elementos con "[data-filter-key]" (asignado en las variables de control)
    filtrosContainer.querySelectorAll("[data-filter-key]").forEach(control => {
        const valor = control.value.trim() // Lo que ha puesto el usuario (sin espacios a los bordes)

        // Si el filtro tiene contenido lo guardamos
        if (valor !== "") {
            filtros[control.dataset.filterKey] = valor.toLowerCase()
        }
    })

    return filtros
}


// Cambio de categoria


// Filtro por defecto (Se ejecutal cuando carga el JS)


async function atacarApi(filtro, nombre) {
    let data;
    if(nombre !== undefined) {
        try {
            const response = await fetch(`https://swapi.dev/api/${filtro}/?search=${nombre}`);
            data = await response.json();
        } catch (error) {
            console.error('Error al atacar la API:', error);
        }
    } else {
        try {
            const response = await fetch(`https://swapi.dev/api/${filtro}`);
            data = await response.json();
        } catch (error) {
            console.error('Error al atacar la API:', error);
        }
    }

    return data.results || [];
}

async function main(categoria, valorBusqueda) {
    const resultado = await atacarApi(categoria, valorBusqueda);
    
    

    resultado.forEach(personaje => {
        console.log(`Nombre: ${personaje.name}`);
        console.log(`Altura: ${personaje.height}`);
        console.log(`Peso: ${personaje.mass}`);
        console.log(`Color de cabello: ${personaje.hair_color}`);
        console.log(`Color de piel: ${personaje.skin_color}`);
        console.log(`Color de ojos: ${personaje.eye_color}`);
        console.log(`Año de nacimiento: ${personaje.birth_year}`);
        console.log(`Género: ${personaje.gender}`);
        console.log('-------------------------');
    });
}
