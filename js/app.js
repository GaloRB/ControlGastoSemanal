// Variable y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');
const btnAumentar = document.querySelector('#btn-aumentar');
const btnDisminuir = document.querySelector('#btn-disminuir');


// Eventos
eventListeners();
    function eventListeners(){
        document.addEventListener('DOMContentLoaded', preguntar);
    }

    formulario.addEventListener('submit', agregarGasto);
    
    btnAumentar.addEventListener('click',modificarPresupuesto);

    btnDisminuir.addEventListener('click',modificarPresupuesto);



// Clases

class Presupuesto{
    constructor(presupuesto){
        this.modificado = 0;
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    aumentarPresupuesto(){
        this.presupuesto += this.modificado;
        this.restante += this.modificado;
    }

    disminuirPresupuesto(){
        this.presupuesto -= this.modificado;
        this.restante -= this.modificado;
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total,gasto) => total + gasto.cantidad, 0 );
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}


class UI{
    insertarPresupuesto(cantidad){
        // Extraer datos con destructuring
        const {presupuesto, restante} = cantidad;

        // Agregar al html
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger')
        }else{
            divMensaje.classList.add('alert-success');
        }

        // mensaje de error
        divMensaje.textContent = mensaje;

        // agregar al html
        document.querySelector('.primario').insertBefore(divMensaje,formulario);

        // quitar mensaje del  html
        setTimeout(()=>{
            divMensaje.remove();
        },2000)
    }

    imprimirGastoListado(gastos){

        this.limpiarHtml();
        
        // iterar sobre los gastos
        gastos.forEach(gasto =>{
            console.log(gasto);

            const {cantidad, nombre, id} = gasto;

            // Crear un li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            // Crear el html del gasto
            nuevoGasto.innerHTML=`${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>`;

            // Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML= 'Borrar &times';
            btnBorrar.onclick = () =>{
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            // agregar el html

            gastoListado.appendChild(nuevoGasto);
        })
    }

    limpiarHtml(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){

        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        if((presupuesto / 4) > restante){
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        }else if((presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        }else{
            restanteDiv.classList.remove('alert-danger','alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // Si se agota el presupuesto
        if(restante <=0){
            ui.imprimirAlerta('El presupuesto se ha agotado','error');
            formulario.querySelector('button[type="submit"]').disabled = true;
            console.log(restante);
        }else{
            formulario.querySelector('button[type="submit"]').removeAttribute("disabled");
        }
    }
}


// Instanciar
const ui = new UI();


let presupuesto;

function preguntar(){
    pregunarPresupuesto(0);
}

// Funciones
async function pregunarPresupuesto(id){

    let textoAlerta = '';
    let textoAlerta2 = ''
    id === 2 ? textoAlerta = "¿Cuánto vas a disminuir tu presupuesto?" : id === 0 ? textoAlerta = "¿Cuál es tu presupuesto a agregar?" : textoAlerta = "¿Cuánto vas a sumar a tu presupuesto a agregar?" 
    id === 2 ? textoAlerta2 = "se restaron" : textoAlerta2 = "agregados";

    const { value: presupuestoUsuario } = await Swal.fire({
        title: textoAlerta,
        input: "text",
        inputPlaceholder: "Escribe aquí la cantidad...",
        inputAttributes: {
          autocapitalize: "off",
          autocorrect: "off"
        }
      });
        if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
            console.log(presupuestoUsuario);
            Swal.fire({
                title: "Presupuesto inválido",
                text: "Debes agregar un presupuesto válido para continuar",
                icon: "warning"
              }).then(() => {
                console.log(presupuesto);
                // Aquí la alerta se ha cerrado
                pregunarPresupuesto(0);
              });
        }else if(id===0){
            // Presupuesto válido
            Swal.fire({
                title: `$${presupuestoUsuario} ${textoAlerta2} a tu presupuesto`,
                icon: "success"
            });
            presupuesto = new Presupuesto(presupuestoUsuario);
            console.log(presupuesto);
            console.log(id);
        }else{
            modificar(id,presupuestoUsuario);
        }
    /*  const presupuestoUsuario = prompt('¿Cual es tu presupuesto?'); 
    
     if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    } */

    

    // inserta presuouesto y restante en el html
    ui.comprobarPresupuesto(presupuesto);
    ui.insertarPresupuesto(presupuesto);
} 

function agregarGasto(e){
    e.preventDefault();
    
    // leer datos del formulario 
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);
    
    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('La cantidad no es válida', 'error');
        return;
    }

    // generar un objeto con el gasto
    const gasto = {nombre, cantidad, id: Date.now()};

    /* console.log(gasto); */

    // añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    // imprimir alerta de gasto añadido correctamente
    ui.imprimirAlerta('Gasto agregado correctamente');

    // impirimir los gasto
    const { gastos , restante } = presupuesto;
    ui.imprimirGastoListado(gastos);

    // imprime el restante
    ui.actualizarRestante(restante);

    // muestra alerta de superar el 25% o el 50% del presupuesto
    ui.comprobarPresupuesto(presupuesto);

    // Reinicia formulario
    formulario.reset();
}

function eliminarGasto(id){
    // Elimina del objeto
    presupuesto.eliminarGasto(id);

    // Eliminar los gastos del html
    const {gastos, restante} = presupuesto;
    ui.imprimirGastoListado(gastos);
    // imprime el restante
    ui.actualizarRestante(restante);

    // muestra alerta de superar el 25% o el 50% del presupuesto
    ui.comprobarPresupuesto(presupuesto);
}

function modificarPresupuesto(e){
    let modificarCantidad;

    e.target.id === 'btn-aumentar' ? modificarCantidad = 1 : modificarCantidad = 2;
    pregunarPresupuesto(modificarCantidad);
}

function modificar(id,presupuestoUsuario){
     if(id === 1){
            presupuesto.modificado = Number(presupuestoUsuario);
            presupuesto.aumentarPresupuesto();
            console.log(presupuesto);
        }else if(id === 2){
            presupuesto.modificado = Number(presupuestoUsuario);
            presupuesto.disminuirPresupuesto();
            console.log(presupuesto);
        }
}
