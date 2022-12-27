//constructores

function Seguro(marca, year, tipo){
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

//realizar la cotización con los datos seleccionados
//no uso arrow function porque tengo que acceder a los datos 
Seguro.prototype.cotizarSeguro = function(){
/*
1 = Audi 1.15
2 = Ford 1.05
3 = Mercedes Benz 1.35
*/
//creo la variable cantidad y la base de lo que valdra que es 20.000
let cantidad;
const base = 20000;
//utilizo switch, que obligatoriamente lleva default
//despues de darle cada caso, lleva break
switch(this.marca){
    case '1':
        cantidad = base * 1.15;
        break;
    case '2':
        cantidad = base * 1.05;
        break;
    case '3':
        cantidad = base * 1.35;
        break;
    default:
    break;
}
//leer el año
const diferencia = new Date().getFullYear() -  this.year;
//cada año que la diferencia es mayor, el costo del seguro aumenta 3%
cantidad += ((diferencia * 3) * cantidad ) / 100;
/*
Si el seguro es básico se multiplica por 30% mas
Si el seguro es completo se multiplica por un
*/
if(this.tipo === 'basico'){
    cantidad *= 1.30
}else {
    cantidad *= 1.50
}
return cantidad;



}

function InterfazUsuario() {}

//llenar las opciones de años en el documento
InterfazUsuario.prototype.llenarOpciones = () => {
    //creamos la variable max con el año actual y la variable min 
    //que es el año actual menos 20
    const max = new Date().getFullYear(),
    min = max - 20;
    const selectYear = document.querySelector('#year');
    //empezamos con el año inicial que sea el maximo, el actual, con i =max
    //y mientras i sea mayor al año minimo i >min , continuo ejecutando el codigo
    //y retrocedo con i--
    for(let i = max; i > min; i--){
        //creamos una opcion
        let option = document.createElement('option');
        //el valor sera i, el año en el que estamos
        option.value = i;
        //para que el usuario pueda ver los años, el i sera tambien
        //el textcontent
        option.textContent = i;
        //a la variable anteriormente creada selectyear le agreamos como hijos
        //las option que seran los años.
        selectYear.appendChild(option)
    }

}

//mostrar alertas en pantalla
//le pasamos un mensaje y un tipo de mensaje, por si o no
//creamos un div para mostrar los mensajes
InterfazUsuario.prototype.mostrarMensaje = function(mensaje, tipo){
const div = document.createElement('div');
if(tipo == 'error'){
    //si tiene mensaje de error, le añadiremos error(error esta en css)
    div.classList.add('error');
}else {
    //correcto tambien esta en css
    div.classList.add('correcto');
}
//añado la clase mensaje con margen top 10
div.classList.add('mensaje', 'mt-10');
//le digo que el textcontent sera el mensaje que le paso arriba en function
div.textContent = mensaje
//insertar en el html
//puedo volver a usar la variable formulario porque no esta en el js general, sino en otra funcion
const formulario = document.querySelector('#cotizar-seguro');
//lo quiero antes del div resultado y para insert before primero le paso lo
//que quiero crear, que es un div, y el donde que es before de resultado
formulario.insertBefore(div, document.querySelector('#resultado'));
//para que el div desaparezca en 3 segundos
setTimeout(() => {
    div.remove()
}, 3000);
}


InterfazUsuario.prototype.mostrarResultado = (total, seguro) => {
    //hago destructuring para extraer marca year y tipo de seguro
    const {marca, year, tipo} = seguro;
    //para que en lugar de 1 2 3 aparezca el nombre de las marcas en innterhtml
    //primero creo una variable vacia
    let textoMarca;
    switch(marca){
        case '1': 
        textoMarca = 'Audi';
        break;
        case '2':
            textoMarca = 'Ford';
            break;
        case '3':
            textoMarca = 'Mercedes Benz';
            break;
        default:
            break;
    }
    //crear el resultado 
    //creo un div
    const div = document.createElement('div');
    //le añado la clase margen top 10 de tailwind
    div.classList.add('mt-10');
    //el textcontent es cuando no tiene html, innerhtml cuando quiero agregar html
    div.innerHTML = `
    <p class="header">Tu Resumen </p>
    <p class="font-bold">Marca: <span class="font-normal"> ${textoMarca}</span></p>
    <p class="font-bold">Año: <span class="font-normal"> ${year}</span></p>
    <p class="font-bold">Tipo de seguro: <span class="font-normal capitalize"> ${tipo}</span></p>
    <p class="font-bold">Total: <span class="font-normal"> ${total} CLP</span></p>`
    
    //capitalize es para que basico y completo salgan con la primera letra mayuscula y es de tailwind

    // agrego el nuevo div como hijo en el div resultado
    const resultadoDiv = document.querySelector('#resultado');
    //resultadoDiv.appendChild(div)

    //mostrar el spinner(ya esta en el html)
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block'
    //y eliminarlo a los 3 segundos
    setTimeout(() => {
        spinner.style.display = 'none';
        //se muestra el resultado de la consulta
        resultadoDiv.appendChild(div);
    }, 3000);
}

//instanciar interfazusuario
const iu = new InterfazUsuario();
console.log(iu);

document.addEventListener('DOMContentLoaded', () =>{
iu.llenarOpciones(); //llena el select con los años
})

//creo la funcion para eventlisteners
eventListeners();
function eventListeners() {
    //llamo el formulario por su id con #
    const formulario = document.querySelector('#cotizar-seguro');
    //formulario escuchara cuando el usuario haga submit
    formulario.addEventListener('submit', cotizarSeguro);
}
//a cotizar seguro le pasamos un evento que sera cuando hagan submit
function cotizarSeguro(e) {
    //le damos preventdefault para que no cambie de pagina al hacer submit
    e.preventDefault();
    //leer la marca seleccionada
    //seleccionamos el valor del id marca
    const marca = document.querySelector('#marca').value;
    
    //leer el año seleccionado
    //seleccionamos el valor del id de año
    const year = document.querySelector('#year').value
    //leer el tipo de cobertura
    //como son dos opciones usamos selectores de css los de []
    const tipo = document.querySelector('input[name="tipo"]:checked').value
    //si alguna opcion esta vacia, muestro mensaje de error
    if(marca === '' || year === '' || tipo === ''){
        //utilizo la instancia de interfazusuario iu y le paso el mensaje
        //y el tipo que es error
        iu.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return; //para que la funcion se detenga aqui si algun campo esta vacio
    }else {//sino mostramos que esta cargando y el css de tipo correcto
        iu.mostrarMensaje('Cotizando...', 'correcto')
    }
    
    //ocultar las cotizaciones previas
    const resultados = document.querySelector('#resultado div');
    //si resultado no es null, es decir, si hay resultado, hacemos remove
    if(resultados != null){
        resultados.remove();
    }
    
    //instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();
    
    //utilizar el prototype para cotizar
    iu.mostrarResultado(total, seguro);
}