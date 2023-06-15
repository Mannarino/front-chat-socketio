import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NetworkBySocketsIoService } from 'src/app/services/network-by-sockets-io.service';
;

@Component({
  selector: 'app-entrar-sin-registro',
  templateUrl: './entrar-sin-registro.component.html',
  styleUrls: ['./entrar-sin-registro.component.css']
})
export class EntrarSinRegistroComponent implements OnInit {
  nombreUsuarioDisponible: boolean= true
  form = new FormGroup({
    nombre: new FormControl('',[Validators.required,]),
    sexo: new FormControl('', Validators.required)
  });
  constructor(private router: Router,
              private netwokBySockets:NetworkBySocketsIoService) {
                
               }

  ngOnInit(): void {
  }

  submitForm(){
    let urlImagen =''
    if(this.form.get('sexo')?.value==='mujer'){
        urlImagen= 'mujer.jpg'
    }else{
      urlImagen= 'hombre.jpg'
    }
    //pruebo entrar sin registro,para eso el nombre de usuario tiene que estar diponible
    this.netwokBySockets.entrarSinRegistro({nombre:this.form.get('nombre')?.value,urlImagen})//mando nombre, mas imagen, y espero respuesta
    this.netwokBySockets.
        nombreUsuarioDisponibleSubject
          .subscribe((disponible: boolean) => {
              if(disponible){
                localStorage.setItem('entrarSinRegistro','true')
                this.router.navigate(['/chat'], { queryParams: { nombre: this.form.get('nombre')?.value, sexo: this.form.get('sexo')?.value } });
              }
              else{
                this.nombreUsuarioDisponible = disponible;
                console.log('usuario no disponible:',this.nombreUsuarioDisponible)
              }
            });
  }

}
