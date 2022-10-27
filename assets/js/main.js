const elementContainer = document.getElementById('elementContainer')
const minId = document.getElementById('min')
const maxId = document.getElementById('max')
const searchId = document.getElementById('searchId')
const cuerpoCarrito = document.getElementById('cuerpoCarrito')
const cuerpoTotal = document.getElementById('cuerpoTotal')
const vaciarCarrito = document.getElementById('vaciarCarrito')

let baseDeDatos
let carrito = JSON.parse(localStorage.getItem('carrito')) || []
let carritoFiltrado

async function petshop() {
    try {
        baseDeDatos = await (await fetch('https://apipetshop.herokuapp.com/api/articulos')).json()
    } catch (error) {
        console.log(error)
    }

    let petshopMindy = baseDeDatos.response

    let juguetes = petshopMindy.filter(elemento => elemento.tipo === 'Juguete').filter(() => document.title.includes('Juguetes'))
    let medicamentos = petshopMindy.filter(elemento => elemento.tipo === 'Medicamento').filter(() => document.title.includes('Farmacia'))

    carritoFiltrado = petshopMindy.filter(elemento => carrito.includes(elemento.nombre))
    carritoFiltrado.forEach(imprimirCarrito)


    let sumaTotal = filtadoSuma(carritoFiltrado)

    function filtadoSuma(array){
        let inicio = 0
        let total = array.reduce((element1,element2) => element1 + element2.precio, inicio)

        return total
    }


    imprimirTotal(sumaTotal)

    function imprimirTotal(total) {

        cuerpoTotal.innerHTML = `
        <tr>
            <td colspan="2">Total :</td>
            <td>$${total}</td>
        </tr>
        `
    }

    vaciarCarrito.addEventListener('click', vaciarElCarrito)

    function vaciarElCarrito(){
        localStorage.removeItem('carrito')
        carrito = []
        carritoFiltrado = []
        sumaTotal = 0
        imprimirTotal(sumaTotal)
        cuerpoCarrito.innerHTML = ``
        elementContainer.innerHTML = ``
        if(minId.value.length !== 0 || maxId.value.length !== 0 || searchId.value.length !== 0){
            filtrar()
        }else{
            jugYFar.forEach(crearElemento)
            botonCarritoOn()
        }
    }

    let jugYFar = [...juguetes, ...medicamentos]
    jugYFar.sort((a, b) => a.stock - b.stock)
    jugYFar.forEach(crearElemento)

    minId.addEventListener('input', filtrar)
    maxId.addEventListener('input', filtrar)
    searchId.addEventListener('input', filtrar)

    function filtrar() {
        let filtradoRango = rango(jugYFar, minId.value, maxId.value)
        let filtradoBusqueda = busqueda(filtradoRango, searchId.value)
        if (filtradoBusqueda.length !== 0) {
            elementContainer.innerHTML = ``
        }
        let filtradoBusquedaOrdenado = [...filtradoBusqueda].sort((a, b) => a.stock - b.stock)
        filtradoBusquedaOrdenado.forEach(crearElemento)
        botonCarritoOn()

    }

    function botonCarritoOn(){
        let botonCarrito = Array.from(document.querySelectorAll('.botonCarrito'))
        botonCarrito.forEach(boton => {
            boton.addEventListener('click', function () {
                addCarrito(boton.value, boton.id)
            })
        })
    }

    botonCarritoOn()

    function addCarrito(nombre, id) {
        let $btn = document.getElementById(id)
        if (!carrito.includes(nombre)) {
            carrito.push(nombre)
            $btn.classList.add('btn-danger')
            $btn.classList.remove('btn-primary')
            $btn.textContent = 'Quitar del carrito'
            localStorage.setItem('carrito', JSON.stringify(carrito))
            cuerpoCarrito.innerHTML = ``
            carritoFiltrado = petshopMindy.filter(elemento => carrito.includes(elemento.nombre))
            carritoFiltrado.forEach(imprimirCarrito)
            let sumaTotal = filtadoSuma(carritoFiltrado)
            imprimirTotal(sumaTotal)
        } else {
            carrito = carrito.filter(elemento => elemento !== nombre)
            $btn.classList.remove('btn-danger')
            $btn.classList.add('btn-primary')
            $btn.textContent = 'Agregar al carrito'
            localStorage.setItem('carrito', JSON.stringify(carrito))
            cuerpoCarrito.innerHTML = ``
            carritoFiltrado = petshopMindy.filter(elemento => carrito.includes(elemento.nombre))
            carritoFiltrado.forEach(imprimirCarrito)
            let sumaTotal = filtadoSuma(carritoFiltrado)
            imprimirTotal(sumaTotal)
        }
    }

}

petshop()

function rango(array, rangoMin, rangoMax) {

    let maximo = [...array].sort((a, b) => b.precio - a.precio)

    if (rangoMin === "") {
        rangoMin = 0
    }
    if (rangoMax === "") {
        rangoMax = maximo[0].precio
    }
    let elementsFilterRango = array.filter(elemento => (elemento.precio >= rangoMin && elemento.precio <= rangoMax));
    if (elementsFilterRango.length === 0) {
        sinResultados()
        return []
    }

    return elementsFilterRango
}

function busqueda(array, texto) {

    let elementsFilterBusqueda = array.filter(elemento => elemento.nombre.toLowerCase().includes(texto.toLowerCase()))
    if (elementsFilterBusqueda.length === 0) {
        sinResultados()
        return []
    }
    return elementsFilterBusqueda
}

function sinResultados() {
    elementContainer.innerHTML = `
    <h1>No se encontro ningun elemento</h1>
    `
}

function crearElemento(array) {
    let clasesBoton;
    let textoBoton;
    let stockUnidades = {
        class: ``,
        texto: ``,
    }
    if (carrito.includes(array.nombre)) {
        clasesBoton = "btn btn-danger detailsClass"
        textoBoton = "Quitar del carrito"
    } else {
        clasesBoton = "btn btn-primary detailsClass"
        textoBoton = "Agregar al carrito"
    }

    if (array.stock <= 3) {
        if (array.stock === 1) {
            stockUnidades = {
                class: `ultUnidades ultimaUnidad`,
                texto: `ULTIMA UNIDAD !!`,
            }
        } else {
            stockUnidades = {
                class: `ultUnidades`,
                texto: `ULTIMAS ${array.stock} UNIDADES !!`,
            }
        }

    } else if (array.stock === 0) {
        stockUnidades = {
            class: `sinStock`,
            texto: `SIN STOCK`,
        }
    } else {
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
        <button class="${clasesBoton} botonCarrito" value="${array.nombre}" id="btn-${array._id}">${textoBoton}</button>
      </div>
    </div>
    </article>
    `;
}

function imprimirCarrito(array) {
    cuerpoCarrito.innerHTML += `
    <tr>
        <td><img src="${array.imagen}" alt="${array.nombre}" width="30px"></td>
        <td>${array.nombre}</td>
        <td>$${array.precio}</td>
    </tr>
    `
}

function imprimirElementos(array){

}