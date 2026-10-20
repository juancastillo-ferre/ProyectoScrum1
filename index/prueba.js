const categorias = {
    people: "Personajes",
    films: "Películas",
    planets: "Planetas",
    species: "Especies",
    vehicles: "Vehículos",
    starships: "Naves"
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
const selectorCategoria = document.getElementById("selectorCategoria")

// Sección que contiene los filtros
const filtrosSection = document.getElementById("filtrosSection")

// Div donde el JS crea y coloca los filtros
const filtrosContainer = document.getElementById("filtrosContainer")

// Título de la sección de filtros
const filtrosTitle = document.getElementById("filtrosTitle")

// Filtros como tal (En la web, lo de la API lo hace el Jason)


function crearFiltros(categoria) {
    filtrosContainer.innerHTML = ""

    const filtros = filtrosCategorias[categoria] || [] // Esto nos da todos los filtros de la categoria (Si no existe [] (lista sin nada))

    // Si no hay filtros oculta el apartado del HTML
    if (!filtros.length) {
        filtrosSection.hidden = true
        return
    }
    
    filtrosSection.hidden = false; // Nos aseguramos de que se vea
    filtrosTitle.textContent = `Filtros de ${categorias[categoria].toLowerCase()}` // Titulo del apartado

    // Pasamos por todos los filtros que tenga nuestra categoria (la i es el filtro en el que está (1, 2, 3, etc))
    filtros.forEach((filtro, i) => {

        // le hacemos un div al filtro (para formatear)
        const grupo = document.createElement("div") 

        // clase del div
        grupo.className = "field" /* Poner Bien en el CSS */

        // creamos su id "filtro-people-1" (primer filtro de la categoria "people")
        const id = `filtro-${categoria}-${i}`

        // creamos una etiqueta usando la id (for=) y el nombre del filtro (Lo que se verá)
        const etiqueta = document.createElement("label") 
        etiqueta.htmlFor = id
        etiqueta.textContent = filtro.name
        grupo.appendChild(etiqueta) // <label for="filtro-people-0"> "nombre del filtro" </label>



        let control

        // comprobamos si el filtro es de tipo select (seleccionar opciones)
        if (filtro.type === "select") {

            // Hacemos el select para poner las opciones dentro
            control = document.createElement("select")

            // Pasamos por todas las opciones del filtro (valor = nombre API y texto = nombre que quiero mostrar)
            filtro.options.forEach(([valor, texto]) => {

                // Creamos la opcion usando el valor y el texto
                const opcion = document.createElement("option")
                opcion.value = valor
                opcion.textContent = texto
                control.appendChild(opcion) // <option value="male"> Masculino </option>
            })
        } else { // No es un select

            // Creamos el input para poner el filtro (para que lo escriban)
            control = document.createElement("input")
            control.type = "search"
            control.placeholder = filtro.placeholder || "" // Si no tiene placeholder asignado no pone nada

            // Si el filtro es de tipo numero hacemos que solo puedas escribir numeros
            if (filtro.type === "number") {
                control.inputMode = "numeric"
            } // <input type="search" placeholder="Ej. 172"></input>

            
        }

        // Variables de control (Para leer los filtros)
        control.id = id
        control.dataset.filterKey = filtro.key
        grupo.appendChild(control)

        // Si el filtro tiene su contenido en ingles muestra un aviso
        if (filtro.english) {

            // Creamos el texto de aviso
            const aviso = document.createElement("p")

            // Clase del <p> de aviso
            aviso.className = "filter-hint" /* Poner Bien en el CSS */

            aviso.innerHTML = "<strong>Escribe en inglés.</strong> Los valores de SWAPI están en inglés."
            grupo.appendChild(aviso) // <p class="filter-hint" >Escribe en inglés. Los valores de SWAPI están en inglés.</p>
        }

        // Aqui añadimos todo lo del filtro al div
        filtrosContainer.appendChild(grupo)
    })
}


// Leemos lo que hayan escrito en los filtros

function leerFiltros() {
    const filtros = {}

    // Leemos todos los elementos con "[data-filter-key]" (asignado en las bariables de control)
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

selectorCategoria.addEventListener("change", () => {
    crearFiltros(selectorCategoria.value)
})


// Filtro por defecto (Se ejecutal cuando carga el JS)

crearFiltros("people")

// Función principal para procesar y mostrar los resultados
async function main(categoria, valorBusqueda) {
    fichasContainer.innerHTML = '<p class="mensaje">Consultando los Archivos de Lothal...</p>';

    let resultados = await atacarApi(categoria, valorBusqueda);
    const filtrosAplicados = leerFiltros();

    // Filtra los datos obtenidos en el cliente según los controles secundarios
    if (resultados.length > 0 && Object.keys(filtrosAplicados).length > 0) {
        resultados = resultados.filter(item => {
            return Object.entries(filtrosAplicados).every(([clave, valorFiltro]) => {
                if (item[clave] === undefined || item[clave] === null) return false;
                return String(item[clave]).toLowerCase().includes(valorFiltro);
            });
        });
    }

    // Limpia el mensaje de carga
    fichasContainer.innerHTML = "";

    // Muestra mensaje si no hay resultados
    if (!resultados || resultados.length === 0) {
        fichasContainer.innerHTML = '<p class="mensaje">No se encontraron registros que coincidan con los criterios.</p>';
        return;
    }

    // Genera y añade cada tarjeta al contenedor de fichas (#fichasContainer)
    resultados.forEach(item => {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta-personaje");

        // SWAPI usa 'title' para películas y 'name' para el resto
        const titulo = item.name || item.title || "Sin nombre";

        tarjeta.innerHTML = `
            <h3>${titulo}</h3>
            <div class="datos-elemento">
                ${obtenerResumenHtml(categoria, item)}
            </div>
        `;

        // Evento para abrir el modal al hacer clic en la tarjeta
        tarjeta.addEventListener("click", () => abrirModal(titulo, item));

        fichasContainer.appendChild(tarjeta);
    });
}

// Genera las etiquetas HTML internas de cada tarjeta según la categoría
function obtenerResumenHtml(categoria, item) {
    switch (categoria) {
        case "people":
            return `
                <p><strong>Altura:</strong> ${item.height} cm</p>
                <p><strong>Peso:</strong> ${item.mass} kg</p>
                <p><strong>Género:</strong> ${item.gender}</p>
            `;
        case "planets":
            return `
                <p><strong>Clima:</strong> ${item.climate}</p>
                <p><strong>Terreno:</strong> ${item.terrain}</p>
                <p><strong>Población:</strong> ${item.population}</p>
            `;
        case "films":
            return `
                <p><strong>Episodio:</strong> ${item.episode_id}</p>
                <p><strong>Director:</strong> ${item.director}</p>
                <p><strong>Lanzamiento:</strong> ${item.release_date}</p>
            `;
        case "species":
            return `
                <p><strong>Clasificación:</strong> ${item.classification}</p>
                <p><strong>Designación:</strong> ${item.designation}</p>
                <p><strong>Idioma:</strong> ${item.language}</p>
            `;
        case "vehicles":
        case "starships":
            return `
                <p><strong>Modelo:</strong> ${item.model}</p>
                <p><strong>Clase:</strong> ${item.starship_class || item.vehicle_class}</p>
                <p><strong>Fabricante:</strong> ${item.manufacturer}</p>
            `;
        default:
            return `<p>Registro del archivo Lothal.</p>`;
    }
}