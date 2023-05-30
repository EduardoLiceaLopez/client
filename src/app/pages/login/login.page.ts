import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ConnectionService } from 'src/app/connection.service';
import  Swal  from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  contrasenia!: string;
  correo!: string;

  userTypes: any[] = [];
  userData = {
    nombre: "",
    apPaterno: "",
    apMaterno: "",
    fech_nacimiento: "",
    numTelefono: "",
    correo: "",
    contrasenia: "",

  };
  errors = [
    { type: 'required', message: 'El campo no puede estar vacio' },
    { type: 'maxlength', message: 'El campo no puede contener tantos caracteres' },
    { type: 'minlength', message: 'El campo requiere más caracteres' },
    { type: 'pattern', message: 'La estructura no es la adecuada para este campo' }
  ];

  constructor(private restService: ConnectionService, private router: Router, private cookieService: CookieService) { }

  contenedor_login_register!: HTMLElement;
  formulario_login!: HTMLElement;
  formulario_register!: HTMLElement;
  caja_trasera_login!: HTMLElement;
  caja_trasera_register!: HTMLElement;

  ngOnInit() {
    // INITIALIZE
    this.contenedor_login_register = document.getElementById("contenedor__login-register")!;
    // FORMS
    this.formulario_login = document.getElementById("formulario__login")!;
    this.formulario_register = document.getElementById("formulario__register")!;
    // BOX FORMS
    this.caja_trasera_login = document.getElementById("caja__trasera-login")!;
    this.caja_trasera_register = document.getElementById("caja__trasera-register")!;
  }

  iniciarSesion() {
    this.formulario_register.style.display = "none";
    this.contenedor_login_register.style.left = "10px";
    this.formulario_login.style.display = "block";
    this.caja_trasera_register.style.opacity = "1";
    this.caja_trasera_login.style.opacity = "0";
  }

  register() {
    this.formulario_register.style.display = "block";
    this.contenedor_login_register.style.left = "410px";
    this.formulario_login.style.display = "none";
    this.caja_trasera_register.style.opacity = "0";
    this.caja_trasera_login.style.opacity = "1";
  }

  onLoginClick() {
    const query = `query {
      login(loginUserInput: {
        correo: "${this.userData.correo}",
        contrasenia: "${this.userData.contrasenia}"
      }) {
        access_token
      }
    }`;

    this.restService.getAll<any>(query).subscribe(
      (response) => {
        if (response.data && response.data.login && response.data.login.access_token) {
          const access_token = response.data.login.access_token;
          this.cookieService.set('access_token', access_token);
          Swal.fire({
            title: 'Bienvenido',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            width: '100%',
            padding: '2em',
            background: '#f6f6f6',
            position: 'center',
            heightAuto: false
          });
          this.router.navigate(['/home']);
        } else {
          console.log("error");
          Swal.fire({
            title: 'Inicio de sesión incorrecto',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            width: '100%',
            padding: '2em',
            background: '#f6f6f6',
            position: 'center',
            heightAuto: false
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onRegisterClick() {
    const mutation = `mutation {
      signup(signupUserInput:{
        apMaterno: "${this.userData.apMaterno}",
        apPaterno: "${this.userData.apPaterno}",
        contrasenia: "${this.userData.contrasenia}",
        correo: "${this.userData.correo}",
        fech_nacimiento: "${this.userData.fech_nacimiento}",
        nombre: "${this.userData.nombre}",
        numTelefono: "${this.userData.numTelefono}",
      }){
        id,
        nombre,
      }
    }`;

    this.restService.add(mutation).subscribe(
      (answer: any) => {
        Swal.fire({
            title: 'Usuario creado de forma exitosa',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            width: '100%',
            padding: '2em',
            background: '#f6f6f6',
            position: 'center',
            heightAuto: false
          });
        this.userData = {
          nombre: "",
          apPaterno: "",
          apMaterno: "",
          fech_nacimiento: "",
          numTelefono: "",
          correo: "",
          contrasenia: "",
        };

        const form = new FormGroup({
          nombre: new FormControl('', Validators.required),
          apPaterno: new FormControl('', Validators.required),
          apMaterno: new FormControl('', Validators.required),
          fech_nacimiento: new FormControl('', Validators.required),
          numTelefono: new FormControl('', Validators.required),
          correo: new FormControl('', [Validators.required, Validators.email]),
          contrasenia: new FormControl('', Validators.required),
        });
        form.reset();
      },
    );
  }
}