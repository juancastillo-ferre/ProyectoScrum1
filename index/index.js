/* NOTA PARA MIS COMPAÑEROS 
    Hay notitas para css y html, busca HTML o CSS para encontrarlas
    Si quieres entender el codigo he puesto notas en los metodos principales
*/

/* APARTADO DE FILTRADO */

// Nombres (Cosas de la api)

const traductorCategorias = {
    Personajes: "people",
    Películas: "films",
    Planetas: "planets",
    Especies: "species",
    Vehículos: "vehicles",
    "Naves Estelares": "starships",
};

const filtrosCategorias = {
    people: [
        {
            key: "height",
            name: "Altura (cm)",
            placeholder: "Ej. 172",
            type: "number",
        },
        {
            key: "mass",
            name: "Peso (kg)",
            placeholder: "Ej. 77",
            type: "number",
        },
        {
            key: "gender",
            name: "Género",
            type: "select",
            options: [
                ["", "Cualquiera"],
                ["male", "Masculino"],
                ["female", "Femenino"],
                ["n/a", "No aplicable"],
                ["hermaphrodite", "Hermafrodita"],
            ],
        },
    ],

    planets: [
        {
            key: "climate",
            name: "Clima",
            placeholder: "Ej. Arid",
            english: true,
        },
        {
            key: "terrain",
            name: "Terreno",
            placeholder: "Ej. Desert",
            english: true,
        },
        {
            key: "population",
            name: "Población",
            placeholder: "Ej. 200000",
            type: "number",
        },
    ],

    films: [
        { key: "director", name: "Director", placeholder: "Ej. George Lucas" },
        {
            key: "producer",
            name: "Productor",
            placeholder: "Ej. Rick McCallum",
        },
        {
            key: "episode_id",
            name: "Número del episodio",
            placeholder: "Ej. 4",
            type: "number",
        },
    ],

    species: [
        {
            key: "classification",
            name: "Clasificación biológica",
            placeholder: "Ej. Mammal",
            english: true,
        },
        {
            key: "language",
            name: "Idioma",
            placeholder: "Ej. Shyriiwook",
            english: true,
        },
        {
            key: "designation",
            name: "Designación",
            placeholder: "Ej. Sentient",
            english: true,
        },
    ],

    vehicles: [
        {
            key: "vehicle_class",
            name: "Clase de vehículo",
            placeholder: "Ej. Wheeled",
            english: true,
        },
        {
            key: "manufacturer",
            name: "Fabricante",
            placeholder: "Ej. Incom Corporation",
        },
        { key: "crew", name: "Número de tripulantes", placeholder: "Ej. 2" },
    ],

    starships: [
        {
            key: "starship_class",
            name: "Clase de nave",
            placeholder: "Ej. Starfighter",
            english: true,
        },
        {
            key: "manufacturer",
            name: "Fabricante",
            placeholder: "Ej. Incom Corporation",
        },
        { key: "crew", name: "Número de tripulantes", placeholder: "Ej. 4" },
    ],
};

// Cosas del HTML

// Sección que contiene los filtros
const filtrosSection = document.getElementById("filtrosSection");

// Div donde el JS crea y coloca los filtros
const filtrosContainer = document.getElementById("filtrosContainer");

// Título de la sección de filtros
const filtrosTitle = document.getElementById("filtrosTitle");

const selectorCategoria = document.getElementById("selectorCategoria");

function obtenerCategoria() {
    const categoria = selectorCategoria.value || "people"; // Si no hay valor pone "people"

    return traductorCategorias[categoria];
}

function obtenerValorBusqueda() {
    const inputBusqueda = document.getElementById("inputBusqueda");
    return inputBusqueda.value.trim(); // Lo que ha puesto el usuario (sin espacios a los bordes)
}

const botonBusqueda = (document.getElementById("botonBusqueda").onclick =
    () => {
        main(obtenerCategoria(), obtenerValorBusqueda());
    });

// Leemos lo que hayan escrito en los filtros
function obtenerFiltros(categoria) {
    const filtros = [];

    filtrosCategorias[categoria].forEach((filtro) => {
        console.log(filtro);
        filtros.push({
            filtro, 
        });
    });

    console.log(filtros); // Para ver los filtros en la consola

    return filtros;
}

//carga filtros al cambio de categoria
selectorCategoria.addEventListener("change", () => {
    mostrarFiltros(obtenerCategoria());
});

function mostrarFiltros() {
    const selectorFiltro = document.getElementById("selectorFiltro");
    selectorFiltro.innerHTML = ""; // Limpiamos los filtros anteriores
    const obteniendoFiltros = obtenerFiltros(obtenerCategoria());

    obteniendoFiltros.forEach((filtro) => {
        const label = document.createElement("label");
        label.textContent = filtro.filtro.name;
        selectorFiltro.appendChild(label);
        if (filtro.type === "select") {
            const select = document.createElement("select");
            select.name = filtro.filtro.name;
            select.id = filtro.filtro.key;

            filtro.options.forEach(([value, text]) => {
                const option = document.createElement("option");
                option.value = value;
                option.textContent = text;
                select.appendChild(option);
            });

        } else {
            const input = document.createElement("input");
            input.type = filtro.type === "number" ? "number" : "search";
            input.placeholder = filtro.filtro.placeholder || "";
            input.name = filtro.filtro.name;
            input.id = filtro.filtro.key;
            if (filtro.type === "number") {
                input.min = "0"; // Establece el valor mínimo para el input de tipo number
                input.step = "any"; // Permite decimales
            }
            selectorFiltro.appendChild(input);
        }
    });
}

function filtrarResultados(resultado) {
    const inputs = document.querySelectorAll("#filtros input");
    let resultadoFiltrado = {};
    let filtros = obtenerFiltros(obtenerCategoria());

    return resultado.filter((item) => {
        return [...filtros].every((filtro, i) => {
            if (inputs[i].value) {
                if (input === "") {
                    return true;
                }
            }

            return item[filtro.filtro.key]
                .toString()
                .toLowerCase()
                .includes(inputs[i].value.toLowerCase());
        });
    });
}

// Filtro por defecto (Se ejecutal cuando carga el JS)

async function atacarApi(filtro, nombre) {
    let data;
    if (nombre !== undefined) {
        try {
            const response = await fetch(
                `https://swapi.dev/api/${filtro}/?search=${nombre}`,
            );
            data = await response.json();
        } catch (error) {
            console.error("Error al atacar la API:", error);
        }
    } else {
        try {
            const response = await fetch(`https://swapi.dev/api/${filtro}`);
            data = await response.json();
        } catch (error) {
            console.error("Error al atacar la API:", error);
        }
    }

    return data.results || [];
}


async function main(categoria, valorBusqueda) {
    const contenedor = document.getElementById("contenedor-resultados");
    contenedor.innerHTML = "<p>Cargando datos...</p>";

    const resultado = await atacarApi(categoria, valorBusqueda);
    contenedor.innerHTML = "";

    if (!resultado || resultado.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron resultados.</p>";
        return;
    }

    resultado.forEach((personaje) => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-personaje");

        tarjeta.innerHTML = `
            <h3>${personaje.name}</h3>
            <p><strong>Altura:</strong> ${personaje.height} cm</p>
            <p><strong>Peso:</strong> ${personaje.mass} kg</p>
            <p><strong>Color de cabello:</strong> ${personaje.hair_color}</p>
            <p><strong>Color de piel:</strong> ${personaje.skin_color}</p>
            <p><strong>Color de ojos:</strong> ${personaje.eye_color}</p>
            <p><strong>Año de nacimiento:</strong> ${personaje.birth_year}</p>
            <p><strong>Género:</strong> ${personaje.gender}</p>
            <hr>
        `;

        contenedor.appendChild(tarjeta);
    });
}


selectorCategoria.value = "Personajes"; // Establece el valor por defecto del selector de categoría
mostrarFiltros(); // Muestra los filtros al cargar la pagina