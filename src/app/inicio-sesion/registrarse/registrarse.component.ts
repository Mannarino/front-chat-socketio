import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { ProfileService } from 'src/app/services/profile.service';

declare let alertify:any

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.css']
})
export class RegistrarseComponent implements OnInit {
  
  serverInternalError=false
  imgCargando = false 
  formRegister = new FormGroup({
    nombre: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    sexo: new FormControl('', Validators.required)
  });

  constructor(private profileService:ProfileService) { }

  ngOnInit(): void {
  }

  get nombre() { return this.formRegister.get('nombre'); }
  get email() { return this.formRegister.get('email'); }
  get password() { return this.formRegister.get('password'); }
  get sexo() { return this.formRegister.get('sexo'); }

  registrarse() {
    // Aquí  lógica para registrar al usuario
    this.profileService.crearUsuario(this.formRegister.value)
    .subscribe( (value) => {
        this.formRegister.reset()
        this.serverInternalError =false
        console.log( value)
        alertify.success('usuario creado exitosamente.'); 
      },error=>{
        this.imgCargando = false
        console.log(error)
        if(error.error.msg==='el nombre ya esta en uso'){
          alert(' el nombre ya esta en uso prueba con otro')
        }
        if(error.error.msg==='el mail ya esta en uso'){
          alert(' el mail ya esta en uso prueba con otro')
        } 
        if(error.status===500){
          this.serverInternalError =true
        }
        console.log('hubo un error')
      })  
  }

}
