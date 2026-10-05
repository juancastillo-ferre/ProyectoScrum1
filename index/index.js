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

async function main() {
    const resultado = await atacarApi("people", "Luke Skywalker");
    
    

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

main();