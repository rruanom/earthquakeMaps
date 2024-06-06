const map = L.map('map')

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


async function miPosicion() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
            console.log(`Latitud: ${position.coords.latitude}\nLongitud: ${position.coords.longitude}`);

            map.setView([position.coords.latitude, position.coords.longitude], 13);

            const marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
        });

    } else {
        console.warn("Tu navegador no soporta Geolocalización!! ");
    }

}
miPosicion();

//Ejercicio 2

const mapaTerremotos = L.map('mapaTerremotos').setView([40, -100], 3);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mapaTerremotos);

const traerDatosTerremotos = async () => {
    try {
        let respuesta = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
        if (respuesta.ok) {
            let datos = await respuesta.json();
            return datos.features
        } else {
            throw `fallo al traer los datos`
        }
    } catch (error) {
        console.log(error)
    }
}

const pintarMarkers = async () =>{
    const datos = await traerDatosTerremotos();
    console.log(datos);
    datos.forEach(element => {
        const coordenadas = element.geometry.coordinates;
        const marker = L.marker([coordenadas[1], coordenadas[0]]).addTo(mapaTerremotos);
        const {title, place, time, url, mag} = element.properties;
        marker.bindPopup(`Titulo: ${title} <br> Lugar: ${place} <br> Fecha: ${new Date(time)} <br> Magnitud: ${mag}`)
    });
}

pintarMarkers();