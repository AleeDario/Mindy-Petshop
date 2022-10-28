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
    <div class="card">
    <img src="${array.imagen}" class="card-img" alt="imagen-juguetes">
    <p class="card-text ${stockUnidades.class}">${stockUnidades.texto}</p>
    <div class="card-info">
           <p class="text-title">${array.nombre}</p>
           <p class="text-body">${array.descripcion}</p>
    </div>
    <div class="card-footer">
    <span class="text-title">Precio: $${array.precio}</span>
    <div class="card-button">
    <svg class="svg-icon" viewBox="0 0 20 20">
    <path d="M17.72,5.011H8.026c-0.271,0-0.49,0.219-0.49,0.489c0,0.271,0.219,0.489,0.49,0.489h8.962l-1.979,4.773H6.763L4.935,5.343C4.926,5.316,4.897,5.309,4.884,5.286c-0.011-0.024,0-0.051-0.017-0.074C4.833,5.166,4.025,4.081,2.33,3.908C2.068,3.883,1.822,4.075,1.795,4.344C1.767,4.612,1.962,4.853,2.231,4.88c1.143,0.118,1.703,0.738,1.808,0.866l1.91,5.661c0.066,0.199,0.252,0.333,0.463,0.333h8.924c0.116,0,0.22-0.053,0.308-0.128c0.027-0.023,0.042-0.048,0.063-0.076c0.026-0.034,0.063-0.058,0.08-0.099l2.384-5.75c0.062-0.151,0.046-0.323-0.045-0.458C18.036,5.092,17.883,5.011,17.72,5.011z"></path>
    <path d="M8.251,12.386c-1.023,0-1.856,0.834-1.856,1.856s0.833,1.853,1.856,1.853c1.021,0,1.853-0.83,1.853-1.853S9.273,12.386,8.251,12.386z M8.251,15.116c-0.484,0-0.877-0.393-0.877-0.874c0-0.484,0.394-0.878,0.877-0.878c0.482,0,0.875,0.394,0.875,0.878C9.126,14.724,8.733,15.116,8.251,15.116z"></path>
    <path d="M13.972,12.386c-1.022,0-1.855,0.834-1.855,1.856s0.833,1.853,1.855,1.853s1.854-0.83,1.854-1.853S14.994,12.386,13.972,12.386z M13.972,15.116c-0.484,0-0.878-0.393-0.878-0.874c0-0.484,0.394-0.878,0.878-0.878c0.482,0,0.875,0.394,0.875,0.878C14.847,14.724,14.454,15.116,13.972,15.116z"></path>
    </svg>
    </div>
    </div></div>
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