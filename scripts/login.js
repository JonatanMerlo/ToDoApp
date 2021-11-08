window.addEventListener('load', function(){
    /* -------------------------------------------------------------------------- */
    /*                              logica del login                              */
    /* -------------------------------------------------------------------------- */

    const formulario =  this.document.forms[0];
    const inputEmail =  this.document.querySelector('#inputEmail');
    const inputPassword = this.document.querySelector('#inputPassword');
    const apiURL = "https://ctd-todo-api.herokuapp.com/v1/users/login"
    const textErrorEmail = this.document.querySelector('.textErrorEmail')
    const textErrorPass = this.document.querySelector('.textErrorPass')
    const contenedorSpinnerYBoton = this.document.querySelector('.buttonSpinner') 
    const botonSubmit = this.document.querySelector('button')

    // creo el spinner
    const spinner = this.document.createElement('div')
    spinner.classList.add('spinner')
    spinner.innerHTML = `<div class="rect1"></div>
                        <div class="rect2"></div>
                        <div class="rect3"></div>
                        <div class="rect4"></div>
                        <div class="rect5"></div>`


    // ------------------------------------------------------------------------------------------------- 

    formulario.addEventListener('submit', function(event){
        event.preventDefault();
        let email = inputEmail.value
        let pass = inputPassword.value

        let resultadoValidacion = validarContraseniaNoVacia(pass) && validarEmailNoVacio(email)

        if (resultadoValidacion) {
            cargando()
            let datosUsuario = normalizacionLogin(email, pass)
            setTimeout(() => {
                fetchApiLogin(apiURL, datosUsuario)
            }, 3000);
        }else{
            if(email == ''){
                if (pass == '') {
                    errorCampoVacio(inputPassword, textErrorPass)
                    errorCampoVacio(inputEmail, textErrorEmail)    
                }
                errorCampoVacio(inputEmail, textErrorEmail)    
            }
            else{
                errorCampoVacio(inputPassword, textErrorPass)
            }
        }

    });


    function validarEmail(email) {
        let valido = false;

        if(email.includes('@')){
            valido = true;
        }
        return valido
    }

    // function validarPassword(pass){
    //     let valido = false

    //     if(pass.length > 5){
    //         valido = true
    //     }

    //     return valido
    // }

    function validarEmailNoVacio(email) {
        if (email != '') {
            return true
        }
        return false;
    }

    function validarContraseniaNoVacia(contrasenia) {
        if (contrasenia != '') {
            return true
        }else{
            return false
        }
    }

    function normalizacionLogin(email, password) {
        const usuario = {
            email: email.trim(),
            password: password.trim()
        }
    
        return usuario;
    }

    function validarCampos(pass, email) {
        let valido = false
        if(validarPassword(pass) && validarEmail(email)){
            valido = true
        }
        return valido
    }

    function fetchApiLogin(url, payload) {
    
        const settings = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        }
        
        fetch(url, settings)
        .then( respuesta => respuesta.json())
        .then( data => {
            console.log(data);

            if(data.jwt){
                // accionar pensando en que el resultado es un usuario y contraseña correctos
                localStorage.setItem('token', data.jwt);
                //redijo a la pantalla de tareas
                location.replace('./mis-tareas.html'); //En el caso de giihub requiere que sea un replace para que que no borre toda la url

            }else{
                errorUsuarioNoExiste(inputEmail,textErrorEmail)
                errorUsuarioNoExiste(inputPassword,textErrorPass)
                inputEmail.classList.add('error')
                inputPassword.classList.add('error')
                textErrorPass.classList.remove('invisible')
                textErrorEmail.classList.remove('invisible')
                contenedorSpinnerYBoton.removeChild(spinner)
                contenedorSpinnerYBoton.appendChild(botonSubmit)
                setTimeout(()=>{
                    inputEmail.classList.remove('error')
                    inputPassword.classList.remove('error')
                    textErrorPass.classList.add('invisible')
                    textErrorEmail.classList.add('invisible')
                },5000)
            }
        });
    }

    function errorCampoVacio(campo, textError){
    
        textError.textContent = 'El campo no puede estar vacio'
        textError.classList.remove('invisible')
        campo.classList.add('error')
        setTimeout(()=>{
            campo.classList.remove('error')
            textError.classList.add('invisible')
        },3000)

    }

    function errorUsuarioNoExiste(campo,textError) {
        textError.textContent = 'Alguno de los campos son incorrectos'
        textError.classList.remove('invisible')
        campo.classList.add('error')
        setTimeout(()=>{
            campo.classList.remove('error')
            textError.classList.add('invisible')
        },3000)
    }

    function cargando() {
        contenedorSpinnerYBoton.removeChild(botonSubmit)
        contenedorSpinnerYBoton.appendChild(spinner)
    }

});