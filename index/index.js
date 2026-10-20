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



// Sección que contiene los filtros
const filtrosSection = document.getElementById("filtrosSection")

// Div donde el JS crea y coloca los filtros
const filtrosContainer = document.getElementById("filtrosContainer")

// Título de la sección de filtros
const filtrosTitle = document.getElementById("filtrosTitle")

const selectorCategoria = document.getElementById("selectorCategoria")

function obtenerCategoria() {
    const categoria = selectorCategoria.value || "people" // Si no hay valor pone "people"

    return traductorCategorias[categoria]
}

function obtenerValorBusqueda() {
    const inputBusqueda = document.getElementById("busqueda")
    return inputBusqueda.value.trim(); // Lo que ha puesto el usuario (sin espacios a los bordes)
}

const botonBusqueda = document.getElementById("boton-buscar").onclick = () => {
    main(obtenerCategoria(), obtenerValorBusqueda());
}

// Leemos lo que hayan escrito en los filtros
function obtenerFiltros(categoria) {
    const filtros = []
    const inputFiltro = document.getElementById("selectorFiltro")


    filtrosCategorias[categoria].forEach(filtro => {
        console.log(filtro)
        filtros.push({
            filtro // Lo que ha puesto el usuario (sin espacios a los bordes)
        })
    })

    console.log(filtros) // Para ver los filtros en la consola

    return filtros
}

//carga filtros al cambio de categoria
selectorCategoria.addEventListener("change", () => {
    mostrarFiltros(obtenerCategoria())
});

function mostrarFiltros() {
    const selectorFiltro = document.getElementById("filtrosSection")
    selectorFiltro.innerHTML = "" // Limpiamos los filtros anteriores
    const obteniendoFiltros = obtenerFiltros(obtenerCategoria())

    obteniendoFiltros.forEach(filtro => {
        const option = document.createElement("option")
        option.value = filtro.filtro.key
        option.textContent = filtro.filtro.name
        selectorFiltro.appendChild(option)
    })
}

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
    
    console.log(resultado);
    
    //prueba de mostrar los resultados en la consola
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

// Listener para controlar el envío del formulario
document.getElementById('formulario').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita que se recargue la página

    const categoria = document.getElementById('selectorCategoria').value;
    const valorBusqueda = document.getElementById('busqueda').value;

    main(categoria, valorBusqueda);
});

// Función principal modificada para renderizar en tu HTML
async function main(categoria, valorBusqueda) {
    const contenedor = document.getElementById('fichasContainer');
    
    // Mensaje de carga mientras se llama a la API
    contenedor.innerHTML = '<p class="mensaje">Buscando en los archivos de Lothal...</p>';

    const resultado = await atacarApi(categoria, valorBusqueda);

    // Limpiamos el contenedor antes de mostrar los nuevos resultados
    contenedor.innerHTML = '';

    // Si no hay resultados o ocurrió un error
    if (!resultado || resultado.length === 0) {
        contenedor.innerHTML = '<p class="mensaje">No se encontraron resultados para tu búsqueda.</p>';
        return;
    }

    // Iteramos e insertamos cada personaje en #fichasContainer
    resultado.forEach(personaje => {
        const tarjeta = document.createElement('article');
        tarjeta.classList.add('tarjeta-personaje');

        // Contenido de la tarjeta con los campos que indicaste
        tarjeta.innerHTML = `
            <h3>${personaje.name}</h3>
            <div class="datos-personaje">
                <p><strong>Altura:</strong> ${personaje.height} cm</p>
                <p><strong>Peso:</strong> ${personaje.mass} kg</p>
                <p><strong>Color de cabello:</strong> ${personaje.hair_color}</p>
                <p><strong>Color de piel:</strong> ${personaje.skin_color}</p>
                <p><strong>Color de ojos:</strong> ${personaje.eye_color}</p>
                <p><strong>Año de nacimiento:</strong> ${personaje.birth_year}</p>
                <p><strong>Género:</strong> ${personaje.gender}</p>
            </div>
        `;

        // Evento opcional: al hacer clic abre el modal detallado
        tarjeta.addEventListener('click', () => abrirModal(personaje));

        contenedor.appendChild(tarjeta);
    });
}

/* ========================================================
   Funciones del Modal (utilizando la estructura de tu HTML)
   ======================================================== */

function abrirModal(personaje) {
    const modal = document.getElementById('modalFons');
    const nombreElemento = document.getElementById('nombreElemento');
    const llistaDades = document.getElementById('llistaDades');

    nombreElemento.textContent = personaje.name;

    llistaDades.innerHTML = `
        <li><strong>Altura:</strong> ${personaje.height} cm</li>
        <li><strong>Masa/Peso:</strong> ${personaje.mass} kg</li>
        <li><strong>Color de cabello:</strong> ${personaje.hair_color}</li>
        <li><strong>Color de piel:</strong> ${personaje.skin_color}</li>
        <li><strong>Color de ojos:</strong> ${personaje.eye_color}</li>
        <li><strong>Año de nacimiento:</strong> ${personaje.birth_year}</li>
        <li><strong>Género:</strong> ${personaje.gender}</li>
    `;

    modal.style.display = 'flex';
}

function tancarModal() {
    document.getElementById('modalFons').style.display = 'none';
}

function tancarModalExtern(event) {
    const modal = document.getElementById('modalFons');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
