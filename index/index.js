const API_BASE = "https://swapi.dev/api/";

const categoryNames = {
    people: "Personajes",
    films: "Películas",
    planets: "Planetas",
    species: "Especies",
    vehicles: "Vehículos",
    starships: "Naves",
};

// Los filtros se definen aquí y se crean dinámicamente en el HTML desde JavaScript.
const filterDefinitions = {
    people: [
        { name: "height", label: "Altura (cm)", placeholder: "Ej. 172" },
        { name: "mass", label: "Peso (kg)", placeholder: "Ej. 77" },
        {
            name: "gender",
            label: "Género",
            type: "select",
            options: ["male", "female", "n/a", "hermaphrodite"],
        },
    ],
    planets: [
        { name: "climate", label: "Clima", placeholder: "Ej. arid" },
        { name: "terrain", label: "Terreno", placeholder: "Ej. desert" },
        { name: "population", label: "Población", placeholder: "Ej. 200000" },
    ],
    films: [
        {
            name: "director",
            label: "Director",
            placeholder: "Ej. George Lucas",
        },
        {
            name: "producer",
            label: "Productor",
            placeholder: "Nombre del productor",
        },
        {
            name: "episode_id",
            label: "Número de episodio",
            placeholder: "Ej. 4",
        },
    ],
    species: [
        {
            name: "classification",
            label: "Clasificación",
            placeholder: "Ej. mammal",
        },
        { name: "language", label: "Idioma", placeholder: "Ej. Shyriiwook" },
        {
            name: "designation",
            label: "Designación",
            placeholder: "Ej. sentient",
        },
    ],
    vehicles: [
        {
            name: "vehicle_class",
            label: "Clase de vehículo",
            placeholder: "Ej. wheeled",
        },
        {
            name: "manufacturer",
            label: "Fabricante",
            placeholder: "Fabricante",
        },
        { name: "crew", label: "Tripulación", placeholder: "Ej. 2" },
    ],
    starships: [
        {
            name: "starship_class",
            label: "Clase de nave",
            placeholder: "Ej. Starfighter",
        },
        {
            name: "manufacturer",
            label: "Fabricante",
            placeholder: "Fabricante",
        },
        { name: "crew", label: "Tripulación", placeholder: "Ej. 4" },
    ],
};

const detailDefinitions = {
    people: [
        ["Altura", "height", " cm"],
        ["Peso", "mass", " kg"],
        ["Género", "gender"],
        ["Color de pelo", "hair_color"],
        ["Color de ojos", "eye_color"],
    ],
    planets: [
        ["Clima", "climate"],
        ["Terreno", "terrain"],
        ["Población", "population"],
        ["Diámetro", "diameter", " km"],
    ],
    films: [
        ["Episodio", "episode_id"],
        ["Director", "director"],
        ["Estreno", "release_date"],
        ["Productor", "producer"],
    ],
    species: [
        ["Clasificación", "classification"],
        ["Designación", "designation"],
        ["Idioma", "language"],
        ["Esperanza de vida", "average_lifespan"],
    ],
    vehicles: [
        ["Modelo", "model"],
        ["Clase", "vehicle_class"],
        ["Fabricante", "manufacturer"],
        ["Tripulación", "crew"],
    ],
    starships: [
        ["Modelo", "model"],
        ["Clase", "starship_class"],
        ["Fabricante", "manufacturer"],
        ["Tripulación", "crew"],
    ],
};

const form = document.getElementById("formulario");
const categorySelect = document.getElementById("selectorCategoria");
const searchInput = document.getElementById("busqueda");
const filtersSection = document.getElementById("filtrosSection");
const filtersContainer = document.getElementById("filtrosContainer");
const filtersTitle = document.getElementById("filtrosTitle");
const statusElement = document.getElementById("status");
const resultsElement = document.getElementById("resultados");
const resultsTitle = document.getElementById("resultsTitle");
const resultCount = document.getElementById("resultCount");

// Panel de detalle: se crea desde JavaScript, no hace falta añadirlo a mano al HTML.
const detailDialog = document.createElement("dialog");
detailDialog.className = "detail-dialog";
detailDialog.innerHTML = `
  <div class="dialog-header">
    <h2 id="detailTitle">Detalle</h2>
    <button type="button" class="close-dialog" aria-label="Cerrar">×</button>
  </div>
  <div id="detailContent" class="detail-content"></div>
`;
document.body.appendChild(detailDialog);
detailDialog
    .querySelector(".close-dialog")
    .addEventListener("click", () => detailDialog.close());
detailDialog.addEventListener("click", (event) => {
    if (event.target === detailDialog) detailDialog.close();
});

function escapeHtml(value) {
    return String(value ?? "").replace(
        /[&<>"']/g,
        (character) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            })[character],
    );
}

function crearFiltros(categoria) {
    filtersContainer.replaceChildren();

    if (categoria === "all") {
        filtersSection.hidden = true;
        return;
    }

    filtersSection.hidden = false;
    filtersTitle.textContent = `Filtros de ${categoryNames[categoria].toLowerCase()}`;

    const definitions = filterDefinitions[categoria] || [];
    definitions.forEach((definition) => {
        const wrapper = document.createElement("div");
        wrapper.className = "filter-field";

        const label = document.createElement("label");
        label.htmlFor = `filter-${definition.name}`;
        label.textContent = definition.label;
        wrapper.appendChild(label);

        let control;
        if (definition.type === "select") {
            control = document.createElement("select");
            const anyOption = document.createElement("option");
            anyOption.value = "";
            anyOption.textContent = "Cualquiera";
            control.appendChild(anyOption);

            definition.options.forEach((optionText) => {
                const option = document.createElement("option");
                option.value = optionText;
                option.textContent = optionText;
                control.appendChild(option);
            });
        } else {
            control = document.createElement("input");
            control.type = "text";
            control.placeholder = definition.placeholder || "";
        }

        control.id = `filter-${definition.name}`;
        control.dataset.filterName = definition.name;
        wrapper.appendChild(control);
        filtersContainer.appendChild(wrapper);
    });
}

function recogerFiltros() {
    const categoria = categorySelect.value;
    const campos = {};

    filtersContainer
        .querySelectorAll("[data-filter-name]")
        .forEach((control) => {
            const value = control.value.trim();
            if (value) campos[control.dataset.filterName] = value;
        });

    return {
        categoria,
        busqueda: searchInput.value.trim(),
        campos,
    };
}

function construirUrl(categoria, busqueda) {
    const params = new URLSearchParams();
    if (busqueda) params.set("search", busqueda);
    return `${API_BASE}${categoria}/?${params.toString()}`;
}

async function obtenerTodos(categoria, busqueda = "") {
    let url = construirUrl(categoria, busqueda);
    const elementos = [];

    // SWAPI pagina los resultados: seguimos el enlace "next" hasta terminar.
    while (url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
        const data = await response.json();
        elementos.push(...data.results);
        url = data.next;
    }

    return elementos;
}

function coincide(valor, filtro) {
    return String(valor ?? "")
        .toLowerCase()
        .includes(String(filtro).toLowerCase());
}

function aplicarFiltrosLocales(items, campos) {
    return items.filter((item) =>
        Object.entries(campos).every(([campo, valor]) =>
            coincide(item[campo], valor),
        ),
    );
}

function obtenerNombre(item, categoria) {
    return categoria === "films" ? item.title : item.name;
}

function crearDetalles(item, categoria) {
    return (detailDefinitions[categoria] || [])
        .map(([label, key, suffix = ""]) => {
            if (
                item[key] === undefined ||
                item[key] === null ||
                item[key] === ""
            )
                return "";
            return `<p class="detail"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(item[key])}${suffix}</p>`;
        })
        .join("");
}

function etiquetaCampo(key) {
    return key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function mostrarDetalle(item, categoria) {
    const tipo = item.__category || categoria;
    const titulo = obtenerNombre(item, tipo) || "Detalle";
    document.getElementById("detailTitle").textContent = titulo;
    const content = document.getElementById("detailContent");
    content.replaceChildren();

    Object.entries(item).forEach(([key, value]) => {
        if (key === "__category" || key === "url") return;
        const row = document.createElement("section");
        row.className = "detail-row";

        const label = document.createElement("h3");
        label.textContent = etiquetaCampo(key);
        row.appendChild(label);

        if (Array.isArray(value)) {
            if (value.length === 0) {
                const empty = document.createElement("p");
                empty.textContent = "Sin datos";
                row.appendChild(empty);
            } else {
                const list = document.createElement("ul");
                value.forEach((entry) => {
                    const li = document.createElement("li");
                    li.textContent = String(entry);
                    list.appendChild(li);
                });
                row.appendChild(list);
            }
        } else {
            const text = document.createElement("p");
            text.textContent =
                value === null || value === "" ? "Sin datos" : String(value);
            row.appendChild(text);
        }

        content.appendChild(row);
    });

    // Algunas respuestas incluyen una sinopsis/crawl (por ejemplo, las películas).
    if (tipo === "films" && item.opening_crawl) {
        const section = document.createElement("section");
        section.className = "detail-row opening-crawl";
        const heading = document.createElement("h3");
        heading.textContent = "Texto de apertura";
        const crawl = document.createElement("p");
        crawl.textContent = item.opening_crawl;
        section.append(heading, crawl);
        content.prepend(section);
    }

    detailDialog.showModal();
}

function mostrarResultados(items, categoria) {
    resultsElement.replaceChildren();

    if (items.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-state";
        empty.textContent = "No se han encontrado resultados con esos filtros.";
        resultsElement.appendChild(empty);
        resultCount.textContent = "0 resultados";
        return;
    }

    const fragment = document.createDocumentFragment();

    items.forEach((item) => {
        const tipo = item.__category || categoria;
        const card = document.createElement("article");
        card.className = "result-card result-card-clickable";
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.setAttribute(
            "aria-label",
            `Ver detalles de ${obtenerNombre(item, tipo) || "resultado"}`,
        );
        card.addEventListener("click", () => mostrarDetalle(item, tipo));
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                mostrarDetalle(item, tipo);
            }
        });

        

        const heading = document.createElement("h3");
        heading.textContent = obtenerNombre(item, tipo) || "Sin nombre";

        card.append(heading);
        card.insertAdjacentHTML("beforeend", crearDetalles(item, tipo));
        fragment.appendChild(card);
    });

    resultsElement.appendChild(fragment);
    resultCount.textContent = `${items.length} resultado${items.length === 1 ? "" : "s"}`;
}

async function buscarEnAPI(filtros) {
    statusElement.textContent = "Buscando en SWAPI…";
    resultsElement.replaceChildren();

    try {
        let resultados;

        if (filtros.categoria === "all") {
            const categorias = Object.keys(categoryNames);
            const listas = await Promise.all(
                categorias.map(async (categoria) => {
                    const items = await obtenerTodos(
                        categoria,
                        filtros.busqueda,
                    );
                    return items.map((item) => ({
                        ...item,
                        __category: categoria,
                    }));
                }),
            );
            resultados = listas.flat();
            resultsTitle.textContent = "Todos los tipos";
        } else {
            resultados = await obtenerTodos(
                filtros.categoria,
                filtros.busqueda,
            );
            resultados = aplicarFiltrosLocales(resultados, filtros.campos);
            resultsTitle.textContent = categoryNames[filtros.categoria];
        }

        mostrarResultados(resultados, filtros.categoria);
        statusElement.textContent = "Búsqueda completada.";
    } catch (error) {
        statusElement.textContent =
            "No se ha podido conectar con SWAPI. Comprueba tu conexión e inténtalo de nuevo.";
        const message = document.createElement("div");
        message.className = "empty-state";
        message.textContent = error.message;
        resultsElement.replaceChildren(message);
        resultCount.textContent = "";
    }
}

categorySelect.addEventListener("change", () => {
    crearFiltros(categorySelect.value);
    buscarEnAPI(recogerFiltros());
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    buscarEnAPI(recogerFiltros());
});

/*
document.getElementById("resetButton").addEventListener("click", () => {
  form.reset();
  crearFiltros(categorySelect.value);
  buscarEnAPI(recogerFiltros());
});
*/

// Al cargar, los filtros y las tarjetas se generan con JavaScript.
// La lista inicial es la de todos los personajes.
crearFiltros(categorySelect.value);
buscarEnAPI(recogerFiltros());
