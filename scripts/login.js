window.addEventListener('load', function(){
    /* -------------------------------------------------------------------------- */
    /*                              logica del login                              */
    /* -------------------------------------------------------------------------- */

    const formulario =  this.document.forms[0];
    const inputEmail =  this.document.querySelector('#inputEmail');
    const inputPassword = this.document.querySelector('#inputPassword');
    const apiURL = "https://ctd-todo-api.herokuapp.com/v1/users/login"


    formulario.addEventListener('submit', function(event){
        event.preventDefault();
        let email = inputEmail.value
        let pass = inputPassword.value

        let resultadoValidacion = validarContraseniaNoVacia(pass) && validarEmailNoVacio(email)


        if (resultadoValidacion) {
            let datosUsuario = normalizacionLogin(email, pass)

            fetchApiLogin(apiURL, datosUsuario)
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
                alert("Alguno de los datos ingresados es incorrecto.")
            }
        });
    }

});