const usuarioAutenticado = localStorage.getItem('token')
if (!usuarioAutenticado) {
    location.replace('./index.html')
}


window.addEventListener('load', ()=>{
    urlApiBase = 'https://ctd-todo-api.herokuapp.com/v1'
    let usuarioNombre = document.querySelector('.user-info p')
    let formulario = document.forms[0];
    let nuevaTarea = document.querySelector('#nuevaTarea')
    let tareasPendientes = document.querySelector('.tareas-pendientes')
    let tareasTerminadas = document.querySelector('.tareas-terminadas')
    let botonCerrarSesion = document.querySelector('#closeApp')
    let objetoTarea = {
        description: ``,
        completed:false
    }
    let tareas = [];
    const jwt = localStorage.getItem('token');
    
    
    fetchDatosUsuario(`${urlApiBase}/users/getMe`, jwt)
    fetchObtenerTareas(`${urlApiBase}/tasks`, jwt)
    


    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        objetoTarea.description = nuevaTarea.value;
        fetchAgregarTareas(`${urlApiBase}/tasks`, jwt,objetoTarea)
        Swal.fire(
            'Exito!',
            'La tarea se creo exitosamente',
            'success'
        )
        fetchObtenerTareas(`${urlApiBase}/tasks`, jwt)
        formulario.reset();
    })

    // console.log(botonTerminar);



    function fetchDatosUsuario(url,token){
        const settings = {
            method:'GET',
            headers:{
                authorization:token
            }
        }
    
        fetch(url, settings)
        .then(response => response.json())
        .then(data => {
            usuarioNombre.textContent = data.firstName;
            console.log(data);
        })
    }

    function fetchObtenerTareas(url, token) {
        const settings = {
            method: 'GET',
            headers:{
                authorization:token
            }
        }

        fetch(url, settings)
        .then(response => response.json())
        .then(data => {
            renderizarTareas(data);
            let botonCompletarTarea = document.querySelectorAll('.not-done')
            let botonRehacerTarea = document.querySelectorAll('.fas')
            let botonEliminarTarea = document.querySelectorAll('.fa-trash-alt')
            cambiarEstadoACompletado(botonCompletarTarea, data)
            cambiarEstadoAPendiente(botonRehacerTarea, data)
            eliminarTarea(botonEliminarTarea, data)
            console.log(data);
        })
    }

    function fetchAgregarTareas(url, token, tarea) {
        const settings = {
            method: 'POST',
            headers:{
                authorization:token,
                'Content-Type':'application/json'
            },
            body:JSON.stringify(tarea)
        }
        
        fetch(url, settings)
        .then(response => response.json())
        .then(data => {
            tareas.push(data)
        })
        
    }
    
    function fetchActualizarTareaARealizada(url, token) {
        const settings = {
            method: 'PUT',
            headers:{
                'Content-Type':'application/json',
                authorization:token

            },
            body:JSON.stringify({
                completed: true
            })
        }
        
        fetch(url, settings)
        .then(response => response.json())
        .then(data => {
            fetchObtenerTareas(`${urlApiBase}/tasks`, jwt)

        })
    }

    function fetchActualizarTareaAPendiente(url, token) {
        const settings = {
            method: 'PUT',
            headers:{
                'Content-Type':'application/json',
                authorization:token

            },
            body:JSON.stringify({
                completed: false
            })
        }
        
        fetch(url, settings)
        .then(response => response.json())
        .then(data => {
            fetchObtenerTareas(`${urlApiBase}/tasks`, jwt)
        })
    }
    
    function fetchEliminarTarea(url, token) {
        const settings = {
            method: 'DELETE',
            headers:{
                authorization:token

            }
        }
        fetch(url, settings)
        .then(response => response.json())
        .then(data => {
            fetchObtenerTareas(`${urlApiBase}/tasks`, jwt)
        })
    }
    

    function renderizarTareas(tareas){
        tareasPendientes.innerHTML = '';
        tareasTerminadas.innerHTML = '';
        if(tareas.lenght != 0){
            tareas.forEach(tarea => {
                console.log(tarea.completed);
                if (tarea.completed == false) {
                    tareasPendientes.innerHTML += `
                    <li class="tarea">
                    <div class="not-done change" id="${tarea.id}"></div>
                    <div class="descripcion">
                        <p class="nombre">${tarea.description}</p>
                        <p class="timestamp"><i class="far
                        fa-calendar-alt"></i> ${tarea.createdAt}</p>
                    </div>
                    </li>`
                    
                }else{
                    tareasTerminadas.innerHTML += `
                    <li class="tarea">
                        <div class="done"></div>
                        <div class="descripcion">
                            <p class="nombre">${tarea.description}</p>
                            <div>
                            <button><i id="${tarea.id}" class="fas
                            fa-undo-alt change"></i></button>
                            <button><i id="${tarea.id}" class="far
                            fa-trash-alt"></i></button>
                            </div>
                        </div>
                    </li>`

                }
            })
        }else{
            tareasPendientes.innerHTML =  `<div class='skeleton'><li class="tarea">
                <div class="not-done"></div>
                <div class="descripcion">
                    <p class="nombre">Nueva Tarea</p>
                    <p class="timestamp">Creada: 2020-12-23</p>
                </div>
                </li>
               </div>`

        }
    }

    function cambiarEstadoACompletado(tareas) {
        // console.log(tareas);
        tareas.forEach(tarea => {
                tarea.addEventListener('click', ()=>{
                    console.log("completada");
                    Swal.fire('Completada!','Tarea completada','success')
                    fetchActualizarTareaARealizada(`${urlApiBase}/tasks/${tarea.id}`, jwt)
                })
            
        }) 
    }
    
    function cambiarEstadoAPendiente(tareas) {
        // console.log(tareas);
        tareas.forEach(tarea => {
                tarea.addEventListener('click', ()=>{
                    Swal.fire({
                        title: '¿Esta seguro?',
                        text: 'La tarea pasara a estar "pendiente"',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si, volver a pendiente!'
                      }).then((result) => {
                        if (result.isConfirmed) {
                            fetchActualizarTareaAPendiente(`${urlApiBase}/tasks/${tarea.id}`, jwt)
                            }
                        })

                })
            
        }) 
    }

    function eliminarTarea(tareas) {
        // console.log(tareas);
        tareas.forEach(tarea => {
                tarea.addEventListener('click', ()=>{
                    Swal.fire({
                        title: '¿Esta seguro?',
                        text: "La tarea se eliminara de manera permanente",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si, eliminar tarea!'
                      }).then((result) => {
                        if (result.isConfirmed) {
                          Swal.fire(
                            'Eliminada!',
                            'La tarea fue eliminada con exito',
                            'success'
                            )
                            fetchEliminarTarea(`${urlApiBase}/tasks/${tarea.id}`, jwt)
                        }
                      })
                })
            
        }) 
    }


    // logica del boton para cerrar sesion
    botonCerrarSesion.addEventListener(('click'),() => {
        Swal.fire({
            title: '¿Desea cerrar sesión?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, cerrar sesion!'
          }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token')
                location.replace('./index.html')
            }
          })

    })

})



