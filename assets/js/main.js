const elementContainer = document.getElementById('elementContainer')
const minId = document.getElementById('min')
const maxId = document.getElementById('max')
const searchId = document.getElementById('searchId')

async function petshop() {
    try {
        var baseDeDatos = await (await fetch('https://apipetshop.herokuapp.com/api/articulos')).json()
    } catch (error) {
        console.log(error)
    }

    const petshopMindy = baseDeDatos.response

    let juguetes = petshopMindy.filter(elemento => elemento.tipo === 'Juguete').filter(() => document.title.includes('Juguetes'))
    console.log(document.title)
    let medicamentos = petshopMindy.filter(elemento => elemento.tipo === 'Medicamento').filter(() => document.title.includes('Farmacia'))

    let jugYFar = [...juguetes, ...medicamentos]
    jugYFar.sort((a,b) => a.stock - b.stock)
    jugYFar.forEach(crearElemento)

    minId.addEventListener('input', filtrar)
    maxId.addEventListener('input', filtrar)
    searchId.addEventListener('input', filtrar)

    function filtrar() {
        let filtradoRango = rango(jugYFar, minId.value, maxId.value)
        let filtradoBusqueda = busqueda(filtradoRango, searchId.value)
        if(filtradoBusqueda.length !== 0){
            elementContainer.innerHTML = ``
        }
        let filtradoBusquedaOrdenado = [...filtradoBusqueda].sort((a,b) => a.stock - b.stock)
        filtradoBusquedaOrdenado.forEach(crearElemento)
    }

}

petshop()

function rango(array, rangoMin, rangoMax) {

    let maximo = [...array].sort((a,b) => b.precio - a.precio)

    if(rangoMin === ""){
        rangoMin = 0
    }
    if(rangoMax === ""){
        rangoMax = maximo[0].precio
    }
    let elementsFilterRango = array.filter(elemento => (elemento.precio >= rangoMin && elemento.precio <= rangoMax));
    if(elementsFilterRango.length === 0){
        sinResultados()
        return []
    }

    return elementsFilterRango
}

function busqueda(array, texto) {

    let elementsFilterBusqueda = array.filter(elemento => elemento.nombre.toLowerCase().includes(texto.toLowerCase()))
    if(elementsFilterBusqueda.length === 0){
        sinResultados()
        return []
    }
    return elementsFilterBusqueda
}

function sinResultados(){
    elementContainer.innerHTML = `
    <h1>No se encontro ningun elemento</h1>
    `
}

function crearElemento(array) {
    let stockUnidades = {
        class: ``,
        texto: ``,
    }
    if(array.stock <= 3){
        if(array.stock === 1){
            stockUnidades = {
                class: `ultUnidades ultimaUnidad`,
                texto: `ULTIMA UNIDAD !!`,
            }
        }else{
            stockUnidades = {
                class: `ultUnidades`,
                texto: `ULTIMAS ${array.stock} UNIDADES !!`,
            }
        }
        
    }else if(array.stock === 0){
        stockUnidades = {
            class: `sinStock`,
            texto: `SIN STOCK`,
        }
    }else{
        stockUnidades = {
            class: `unidades`,
            texto: `Stock : ${array.stock} unidades`
        }
    }
    elementContainer.innerHTML += `
    <article class="card bg-dark text-white">
    <img src="${array.imagen}" class="card-img-top" alt="${array.nombre}">
    <div class="card-body d-flex flex-column justify-content-between">
      <h5 class="card-title">${array.nombre}</h5>
      <p class="card-text ${stockUnidades.class}">${stockUnidades.texto}</p>
      <p class="card-text">${array.descripcion}</p>
      <div class="d-flex justify-content-between align-items-center gap-5">
        <p>Price: $${array.precio}</p>
        <a href="" " class="btn btn-primary detailsClass">Comprar</a>
      </div>
    </div>
    </article>
    `;
}