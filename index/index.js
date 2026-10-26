
/* =========================
   CONFIGURACIÓN
========================= */

const API = "https://swapi.dev/api/";

const categorias = {
    people: "Personajes",
    films: "Películas",
    planets: "Planetas",
    species: "Especies",
    vehicles: "Vehículos",
    starships: "Naves"
};

/* =========================
   CONFIGURACIÓN DE FILTROS
========================= */

const filtrosCategorias = {
    people: [
        { key: "height", name: "Altura (cm)", placeholder: "Ej. 172", type: "number" },
        { key: "mass", name: "Peso (kg)", placeholder: "Ej. 77", type: "number" },
        {
            key: "gender",
            name: "Género",
            type: "select",
            options: [
                ["", "Cualquiera"],
                ["male", "Masculino"],
                ["female", "Femenino"],
                ["n/a", "No aplicable"],
                ["hermaphrodite", "Hermafrodita"]
            ]
        }
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
};

/* =========================
   DATOS PARA LAS FICHAS
========================= */

const infoDetallada = {
    people: [
        ["Altura (cm)", "height"],
        ["Peso (kg)", "mass"],
        ["Género", "gender"],
        ["Color de pelo", "hair_color"],
        ["Color de ojos", "eye_color"],
        ["Color de piel", "skin_color"],
        ["Año de nacimiento", "birth_year"]
    ],

    planets: [
        ["Clima", "climate"],
        ["Terreno", "terrain"],
        ["Población", "population"],
        ["Diámetro (km)", "diameter"],
        ["Gravedad", "gravity"],
        ["Periodo de rotación", "rotation_period"],
        ["Periodo orbital", "orbital_period"],
        ["Agua superficial (%)", "surface_water"]
    ],

    films: [
        ["Episodio", "episode_id"],
        ["Director", "director"],
        ["Fecha de estreno", "release_date"],
        ["Productor", "producer"],
        ["Texto de apertura", "opening_crawl"]
    ],

    species: [
        ["Clasificación", "classification"],
        ["Designación", "designation"],
        ["Idioma", "language"],
        ["Esperanza de vida media", "average_lifespan"],
        ["Altura media (cm)", "average_height"],
        ["Color de piel", "skin_colors"],
        ["Color de pelo", "hair_colors"],
        ["Color de ojos", "eye_colors"]
    ],

    vehicles: [
        ["Modelo", "model"],
        ["Clase de vehículo", "vehicle_class"],
        ["Fabricante", "manufacturer"],
        ["Tripulación", "crew"],
        ["Pasajeros", "passengers"],
        ["Velocidad máxima", "max_atmosphering_speed"],
        ["Coste en créditos", "cost_in_credits"],
        ["Longitud (m)", "length"]
    ],

    starships: [
        ["Modelo", "model"],
        ["Clase de nave", "starship_class"],
        ["Fabricante", "manufacturer"],
        ["Tripulación", "crew"],
        ["Pasajeros", "passengers"],
        ["Velocidad máxima", "max_atmosphering_speed"],
        ["Coste en créditos", "cost_in_credits"],
        ["Longitud (m)", "length"],
        ["Hiperimpulsor", "hyperdrive_rating"],
        ["MGLT", "MGLT"]
    ]
};

const traducciones = {
    gender: {
        male: "Masculino",
        female: "Femenino",
        "n/a": "No aplicable",
        hermaphrodite: "Hermafrodita"
    }
};

/* =========================
   ELEMENTOS DEL HTML
========================= */

// Formulario y búsqueda
const formulario = document.getElementById("formulario");
const selectorCategoria = document.getElementById("selectorCategoria");
const campoBusqueda = document.getElementById("busqueda");

// Filtros
const filtrosSection = document.getElementById("filtrosSection");
const filtrosContainer = document.getElementById("filtrosContainer");
const filtrosTitle = document.getElementById("filtrosTitle");

// Resultados
const fichasContainer = document.getElementById("fichasContainer");
const resultadosTitle = document.querySelector(".resultados h2");

// Modal
const modal = document.getElementById("modalFons");
const modalTitle = document.getElementById("nombreElemento");
const modalBody = document.getElementById("llistaDades");
const modalImagen = document.getElementById("imagenElemento");

// Caché para no volver a consultar relaciones ya resueltas
const cacheNombres = new Map();

// Estado de la aplicación
let resultadosActuales = [];
let categoriaActual = "people";
let filtrosActuales = {};

/* =========================
   FUNCIONES AUXILIARES
========================= */

function escaparHTML(valor) {
    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function obtenerNombre(item) {
    return item.name || item.title || "Sin nombre";
}

function traducirValor(campo, valor) {
    if (valor === undefined || valor === null || valor === "") {
        return "Sin datos";
    }

    const texto = String(valor);

    return traducciones[campo]?.[texto] || texto;
}

async function obtenerJSON(url) {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        throw new Error(`Error al consultar la API: ${respuesta.status}`);
    }

    return respuesta.json();
}

/* =========================
   CREACIÓN DE FILTROS
========================= */

function crearFiltros(categoria) {
    filtrosContainer.innerHTML = "";

    const definiciones = filtrosCategorias[categoria] || [];

    filtrosSection.hidden = definiciones.length === 0;

    filtrosTitle.textContent =
        `Filtros de ${(categorias[categoria] || "").toLowerCase()}`;

    definiciones.forEach((filtro, indice) => {
        const grupo = document.createElement("div");
        grupo.className = "field";

        const id = `filtro-${categoria}-${indice}`;

        const etiqueta = document.createElement("label");
        etiqueta.htmlFor = id;
        etiqueta.textContent = filtro.name;
        grupo.appendChild(etiqueta);

        let control;

        if (filtro.type === "select") {
            control = document.createElement("select");

            filtro.options.forEach(([valor, texto]) => {
                const opcion = document.createElement("option");
                opcion.value = valor;
                opcion.textContent = texto;
                control.appendChild(opcion);
            });
        } else {
            control = document.createElement("input");

            // El tipo number permite introducir valores numéricos.
            control.type = filtro.type === "number" ? "number" : "search";
            control.placeholder = filtro.placeholder || "";

            if (filtro.type === "number") {
                control.min = "0";
                control.step = "any";
            }
        }

        control.id = id;
        control.dataset.filterKey = filtro.key;

        grupo.appendChild(control);

        if (filtro.english) {
            const aviso = document.createElement("p");
            aviso.className = "filter-hint";
            aviso.innerHTML =
                "<strong>Escribe en inglés.</strong> Los datos de SWAPI están en inglés.";
            grupo.appendChild(aviso);
        }

        filtrosContainer.appendChild(grupo);
    });
}

function leerFiltros() {
    const filtros = {};

    filtrosContainer.querySelectorAll("[data-filter-key]").forEach(control => {
        const valor = control.value.trim();

        if (valor !== "") {
            filtros[control.dataset.filterKey] = valor.toLowerCase();
        }
    });

    return filtros;
}

/* =========================
   BÚSQUEDA EN SWAPI
========================= */

async function buscarEnAPI(categoria, busqueda) {
    const url = new URL(`${API}${categoria}/`);

    if (busqueda) {
        url.searchParams.set("search", busqueda);
    }

    const datos = await obtenerJSON(url.toString());

    // Guardamos la categoría para saber qué datos mostrar.
    return datos.results.map(item => ({
        ...item,
        _categoria: categoria
    }));
}

/* =========================
   APLICAR FILTROS
========================= */

function coincideFiltro(item, campo, valor) {
    const dato = item[campo];

    if (dato === undefined || dato === null) {
        return false;
    }

    return String(dato).toLowerCase().includes(valor);
}

function aplicarFiltrosYMostrar() {
    const resultadosFiltrados = resultadosActuales.filter(item => {
        const definiciones = filtrosCategorias[item._categoria] || [];

        return definiciones.every(filtro => {
            const valor = filtrosActuales[filtro.key];

            if (!valor) {
                return true;
            }

            return coincideFiltro(item, filtro.key, valor);
        });
    });

    mostrarResultados(resultadosFiltrados);
}

/* =========================
   MOSTRAR TARJETAS
========================= */

function crearTarjeta(item) {
    const categoria = item._categoria;
    const tarjeta = document.createElement("button");

    tarjeta.type = "button";
    tarjeta.className = "result-card";

    const detalles = infoDetallada[categoria] || [];

    let contenido = `
        <span class="card-category">
            ${escaparHTML(categorias[categoria])}
        </span>
        <h3>${escaparHTML(obtenerNombre(item))}</h3>
        <div class="card-details">
    `;

    detalles.slice(0, 3).forEach(([etiqueta, campo]) => {
        if (item[campo] !== undefined && item[campo] !== "") {
            contenido += `
                <div>
                    <strong>${escaparHTML(etiqueta)}:</strong>
                    ${escaparHTML(traducirValor(campo, item[campo]))}
                </div>
            `;
        }
    });

    contenido += "</div>";

    tarjeta.innerHTML = contenido;

    tarjeta.addEventListener("click", () => {
        abrirDetalles(item);
    });

    return tarjeta;
}

function mostrarResultados(lista) {
    fichasContainer.innerHTML = "";

    if (lista.length === 0) {
        fichasContainer.textContent =
            "No se han encontrado resultados con esos criterios.";
    } else {
        lista.forEach(item => {
            fichasContainer.appendChild(crearTarjeta(item));
        });
    }

    resultadosTitle.textContent =
        `${categorias[categoriaActual]} encontrados (${lista.length})`;
}

/* =========================
   DETALLES Y RELACIONES
========================= */

async function resolverValor(valor) {
    if (Array.isArray(valor)) {
        const resultados = await Promise.all(
            valor.map(resolverValor)
        );

        return resultados.join(", ") || "Sin datos";
    }

    if (typeof valor === "string" && /^https?:\/\//i.test(valor)) {
        if (cacheNombres.has(valor)) {
            return cacheNombres.get(valor);
        }

        try {
            const datos = await obtenerJSON(valor);
            const nombre = obtenerNombre(datos);

            cacheNombres.set(valor, nombre);

            return nombre;
        } catch {
            return "No disponible";
        }
    }

    return traducirValor("", valor);
}

async function abrirDetalles(item) {
    modal.hidden = false;
    document.body.style.overflow = "hidden";

    modalTitle.textContent = obtenerNombre(item);
    modalBody.innerHTML = "";

    // SWAPI no proporciona imágenes de los personajes o planetas.
    modalImagen.hidden = true;
    modalImagen.removeAttribute("src");

    const categoria = item._categoria;
    const campos = infoDetallada[categoria] || [];

    const liCarga = document.createElement("li");
    liCarga.textContent = "Cargando detalles...";
    modalBody.appendChild(liCarga);

    try {
        const detalles = [];

        for (const [etiqueta, campo] of campos) {
            const valor = item[campo];

            if (valor !== undefined && valor !== null && valor !== "") {
                detalles.push([
                    etiqueta,
                    await resolverValor(valor)
                ]);
            }
        }

        const relaciones = {
            homeworld: "Planeta de origen",
            films: "Películas",
            species: "Especies",
            vehicles: "Vehículos",
            starships: "Naves",
            people: "Personajes",
            residents: "Habitantes",
            pilots: "Pilotos",
            characters: "Personajes",
            planets: "Planetas"
        };

        for (const [campo, etiqueta] of Object.entries(relaciones)) {
            if (
                item[campo] &&
                !campos.some(([, clave]) => clave === campo)
            ) {
                detalles.push([
                    etiqueta,
                    await resolverValor(item[campo])
                ]);
            }
        }

        modalBody.innerHTML = "";

        if (detalles.length === 0) {
            const li = document.createElement("li");
            li.textContent = "No hay detalles disponibles.";
            modalBody.appendChild(li);
        } else {
            detalles.forEach(([etiqueta, valor]) => {
                const li = document.createElement("li");
                const strong = document.createElement("strong");

                strong.textContent = `${etiqueta}: `;
                li.appendChild(strong);
                li.appendChild(document.createTextNode(valor));

                modalBody.appendChild(li);
            });
        }
    } catch (error) {
        console.error(error);
        modalBody.innerHTML = "";

        const li = document.createElement("li");
        li.textContent = "No se han podido cargar los detalles.";
        modalBody.appendChild(li);
    }
}

/* =========================
   CERRAR MODAL
========================= */

// Estas funciones también permiten usar los onclick de tu HTML.
function tancarModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
}

function tancarModalExtern(event) {
    if (event.target === modal) {
        tancarModal();
    }
}

document.getElementById("cerrarModal").addEventListener("click", tancarModal);

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modal.hidden) {
        tancarModal();
    }
});

/* =========================
   EVENTOS DEL FORMULARIO
========================= */

selectorCategoria.addEventListener("change", () => {
    categoriaActual = selectorCategoria.value;

    crearFiltros(categoriaActual);
    fichasContainer.innerHTML = "";
});

formulario.addEventListener("submit", async event => {
    event.preventDefault();

    categoriaActual = selectorCategoria.value;

    if (!categoriaActual || !categorias[categoriaActual]) {
        fichasContainer.textContent =
            "Selecciona una categoría antes de buscar.";
        return;
    }

    const busqueda = campoBusqueda.value.trim();

    filtrosActuales = leerFiltros();
    fichasContainer.textContent = "Cargando resultados...";

    try {
        resultadosActuales = await buscarEnAPI(
            categoriaActual,
            busqueda
        );

        aplicarFiltrosYMostrar();
    } catch (error) {
        console.error(error);

        fichasContainer.textContent =
            "No se han podido cargar los resultados. Comprueba tu conexión e inténtalo de nuevo.";
    }
});

/* =========================
   INICIO
========================= */

// Ocultamos el modal al cargar la página.
modal.hidden = true;

// Seleccionamos Personajes como categoría inicial.
selectorCategoria.value = "people";
categoriaActual = "people";

crearFiltros(categoriaActual);