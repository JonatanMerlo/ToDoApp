window.addEventListener('load', () => {
    const apiURL = "https://ctd-todo-api.herokuapp.com/v1/users"
    const formulario =  this.document.forms[0];
    const inputEmail =  this.document.querySelector('#inputEmail');
    const inputContrasenia = this.document.querySelector('#inputContrasenia');
    const inputNombre =  this.document.querySelector('#inputNombre');
    const inputApellido = this.document.querySelector('#inputApellido')
    const inputRepetirContrasenia = this.document.querySelector('#inputRepetirContrasenia');
    const textosError = document.querySelectorAll('.textoError')
    const contenedorSpinnerYBoton = document.querySelector('.buttonSpinner')
    const botonSubmit = document.querySelector('button')
    const caracteresInvalidos = ['1','2','3','4','5','6','7','8','9','0',',','.',';',':','-','_','[','[','^','}',']','*','~','+','¡','¿','?','|','°','¬','!','#','$','%','&','(',')','=']
    let usuario = {
        firstName:'',
        lastName: '',
        email: '',
        password: '',
    };

        // creo el spinner
        const spinner = this.document.createElement('div')
        spinner.classList.add('spinner')
        spinner.innerHTML = `<div class="rect1"></div>
                            <div class="rect2"></div>
                            <div class="rect3"></div>
                            <div class="rect4"></div>
                            <div class="rect5"></div>`
//-------------------------------------------------------------------------------------------------------    


    formulario.addEventListener('submit', (e) =>{
        e.preventDefault();
        let nombre = inputNombre.value;
        let apellido = inputApellido.value;
        let email = inputEmail.value;
        let contrasenia = inputContrasenia.value;
        let repetirContrasenia = inputRepetirContrasenia.value;

        let algunCampoVacio = validarNoVacio(nombre) && validarNoVacio(apellido) && validarNoVacio(email) && validarNoVacio(contrasenia) && validarNoVacio(repetirContrasenia) 
        let contraseniasIguales = validarIgualdadContraseniaYRepetirContrasenia(contrasenia, repetirContrasenia)
        if(algunCampoVacio && contraseniasIguales){
            usuario.firstName = nombre;
            usuario.lastName = apellido;
            usuario.email = email;
            usuario.password = contrasenia;
            cargando();
            setTimeout(() => {
                fetchApiSignUp(apiURL, usuario)
            }, 3000);

            console.log(usuario);
            formulario.reset()
        }else{
            for (let i = 0; i < textosError.length; i++) {
                if (!validarNoVacio(formulario[i].value)) {
                    textosError[i].textContent = 'El campo no puede estar vacio'
                    textosError[i].classList.remove('invisible')
                    formulario[i].classList.add('error')
                    setTimeout(()=>{
                        formulario[i].classList.remove('error')
                        textosError[i].classList.add('invisible')
                    },3000) 
                }
                if (!sinCaracteresEspeciales(formulario[i].value, caracteresInvalidos)) {
                    if (i < 2) {
                        textosError[i].textContent = 'No se permiten caracteres especiales'
                        textosError[i].classList.remove('invisible')
                        formulario[i].classList.add('error')
                        setTimeout(()=>{
                            formulario[i].classList.remove('error')
                            textosError[i].classList.add('invisible')
                        },3000) 
                    }
                }
                if (!contraseniasIguales) {
                    for (let i = 3; i < textosError.length; i++) {
                        textosError[i].textContent = 'Las contraseñas deben ser iguales'
                        textosError[i].classList.remove('invisible')
                        formulario[i].classList.add('error')
                        setTimeout(()=>{
                            formulario[i].classList.remove('error')
                            textosError[i].classList.add('invisible')
                        },3000) 
                    }
                }
                if(!validarEmail(formulario[2].value)){
                    textosError[2].textContent = 'No es un formato de Email valido'
                    textosError[2].classList.remove('invisible')
                    formulario[2].classList.add('error')
                    setTimeout(()=>{
                        formulario[2].classList.remove('error')
                        textosError[2].classList.add('invisible')
                    },3000) 
                }
                
            }
        }

        // console.log(usuario);
        // console.log();

    })


    // --------------------------------------------------------------------------------------------
    //Validar que tanto nombre ni apellido tenga caracteres especiales


    function sinCaracteresEspeciales(dato, caracteresInvalidos) {
        let sinCaracteres = true;
        caracteresInvalidos.forEach(caracter => {
            if (dato.includes(caracter)) {
                // console.log(dato.includes(caracter));
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

    function validarIgualdadContraseniaYRepetirContrasenia(contrasenia, repetirContrasenia) {
        let sonIguales = false;
        if (contrasenia == repetirContrasenia) {
            sonIguales = true
        }
        return sonIguales;
    }


    // -----------------------------------------------------------------------------------
    // validaciones de campos no vacios

    function validarNoVacio(dato) {
        if (dato != '') {
            return true;
        }
        return false;
    }

    function cargando() {
        contenedorSpinnerYBoton.removeChild(botonSubmit)
        contenedorSpinnerYBoton.appendChild(spinner)
    }

    

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

