window.addEventListener('load', () => {
    const apiURL = "https://ctd-todo-api.herokuapp.com/v1/users"
    const formulario =  this.document.forms[0];
    const inputEmail =  this.document.querySelector('#inputEmail');
    const inputContrasenia = this.document.querySelector('#inputContrasenia');
    const inputNombre =  this.document.querySelector('#inputNombre');
    const inputApellido = this.document.querySelector('#inputApellido')
    const inputRepetirContrasenia = this.document.querySelector('#inputRepetirContrasenia');
    const caracteresInvalidos = ['1','2','3','4','5','6','7','8','9','0',',','.',';',':','-','_','[','[','^','}',']','*','~','+','¡','¿','?','|','°','¬','!','#','$','%','&','(',')','=']
    let usuario = {
        firstName:'',
        lastName: '',
        email: '',
        password: '',
    };


    formulario.addEventListener('submit', (e) =>{
        e.preventDefault();
        let nombre = inputNombre.value;
        let apellido = inputApellido.value;
        let email = inputEmail.value;
        let contrasenia = inputContrasenia.value;
        let repetirContrasenia = inputRepetirContrasenia.value;

        if(ningunCampoVacio(nombre, apellido, email, contrasenia, repetirContrasenia) && validarIgualdadContraseniaYRepetirContrasenia(contrasenia, repetirContrasenia)){
            usuario.firstName = nombre;
            usuario.lastName = apellido;
            usuario.email = email;
            usuario.password = contrasenia;

            fetchApiSignUp(apiURL, usuario)

            console.log(usuario);
            formulario.reset()
        }

        // console.log(usuario);
        // console.log();

    })


    // --------------------------------------------------------------------------------------------
    //Validar que tanto nombre ni apellido tenga caracteres especiales


    function sinCaracteresEspeciales(nombre, apellido, caracteresInvalidos) {
        let sinCaracteres = true;
        caracteresInvalidos.forEach(caracter => {
            if (nombre.includes(caracter) || apellido.includes(caracter)) {
                // console.log(nombre.includes(caracter));
                sinCaracteres = false;
            }
        })
        return sinCaracteres;
    }



    // --------------------------------------------------------------------------------------------



    // -------------------------------------------------------------------------------------
    // validar tipo email valido

    function validarEmail(email) {
        let tipoEmail = email.includes('@')
        if (tipoEmail) {
            return true
        }else{
            return false
        }
    }
    // ---------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------
    // validaciones de campos no vacios

    function validarNombreNoVacio(nombre) {
        if (nombre != '') {
            return true;
        }
        return false;
    }

    function validarApellidoNoVacio(apellido) {
        if (apellido != '') {
            return true;
        }
        return false;
    }

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

    function validarRepetirContraseniaNoVacio(repetirContrasenia) {
        if (repetirContrasenia != '') {
            return true
        }else{
            return false
        }
    }

    
    function ningunCampoVacio(nombre, apellido, email, contrasenia, repetirContrasenia) {
        let algunVacio = false;
        algunVacio = validarNombreNoVacio(nombre) && validarApellidoNoVacio(apellido) && validarEmailNoVacio(email) && validarContraseniaNoVacia(contrasenia) && validarRepetirContraseniaNoVacio(repetirContrasenia)
        return algunVacio
    }
    
    // ----------------------------------------------------------------------------------------



    // ----------------------------------------------------------------------------------------
    // validar que tanto contraseña como repetir contraseña sean iguales

    function validarIgualdadContraseniaYRepetirContrasenia(contrasenia, repetirContrasenia) {

        if (repetirContrasenia === contrasenia) {
            return true
        }
        return false
        
    }
    // ----------------------------------------------------------------------------------------
    

})

function fetchApiSignUp(url,payload) {

    const settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)

    }

    fetch(url, settings)
    .then(response => response.json())
    .then(data => {
        if (data.jwt) {
            location.replace('./index.html')
        }
    })
}