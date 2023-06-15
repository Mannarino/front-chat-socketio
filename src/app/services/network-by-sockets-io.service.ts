import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { UsuariosConectados } from '../interfaces/usuariosConectados';
import { HandleTokensService } from './handle-tokens.service';
import { ProfileService } from './profile.service';
@Injectable({
  providedIn: 'root'
})
export class NetworkBySocketsIoService {

   //crear coneccion socket con el servidor
  socketBackend = io(environment.url_endpoint);

  //declaro variables (que seran observables) en el servicio que puego desde componente me subscribire
  public nombreUsuarioDisponibleSubject: Subject<boolean>;
  public usuariosConectadosSubject: Subject<UsuariosConectados>;
  public messageSubject: Subject<any>

  constructor(
    private router: Router,
    private handleTokensService:HandleTokensService,
    private profileService:ProfileService
    ) { 
      //creo observables para usuarios conectados y mensajes
      this.nombreUsuarioDisponibleSubject = new Subject<boolean>();
      this.usuariosConectadosSubject = new Subject<UsuariosConectados>();
      this.messageSubject = new Subject<string>()

      //desde el cliente escucho el eveto coneccion web socket con el server
      this.socketBackend.on('connect', () => { 
        console.log('Cliente conectado', this.socketBackend.id); 
        
      //obtener los usuarios cada vez que entra o sale un usuario
      this.socketBackend.on('usuariosConectados', (usuarios) => {
          this.usuariosConectadosSubject.next(usuarios);
        });
      });

      //obtener cada mensaje que se vaya publicando
      this.socketBackend.on('messageDelServer', (message) => {
        this.messageSubject.next(message)
      });

      //programacion a ejecutar cuando se corta la coneccion
      this.socketBackend.on('disconnect', () => {
        const salir= localStorage.getItem('salir');
        if(salir==='true'){
          localStorage.setItem('salir', 'false');
          this.router.navigate(['/entrar-sin-registro'] )
        }else{
          // Cliente desconectado
        alert('Se ha perdido la conexión');
        this.router.navigate(['/entrar-sin-registro'] )
        }
        
      });
    }

    iniciarConexion(): void {
      this.socketBackend = io(environment.url_endpoint);
    }

    entrarSinRegistro(form:any){
       //emitir peticion de entrada y manejar la respuesta de servidor al inicio sin registro
       this.socketBackend.emit('iniciarSinRegistro',form, (disponibilidad: any) => {
        if (disponibilidad) {
          localStorage.setItem('salir', 'false');
          this.nombreUsuarioDisponibleSubject.next(true);
        } else {
           this.nombreUsuarioDisponibleSubject.next(false);
        }
      });
    }
    
  login(form:any){
      //emitir peticion de entrada y manejar la respuesta de servidor al inicio sin registro
      this.socketBackend.emit('login',form, (respuesta: any) => {
       if (respuesta.acceso) {
         //guardar datos y token en localStorage
         this.handleTokensService.saveToken(respuesta.token)
         this.profileService.saveProfile(respuesta.profile)
         localStorage.setItem('salir', 'false');
         setTimeout(()=>{this.router.navigate(['/chat'], 
         { queryParams: 
          { nombre: respuesta.profile.nombre, 
            sexo: respuesta.profile.sexo ,
            urlImagen:respuesta.profile.urlImagen,
            _id:respuesta.profile_id,
            userRegister:true} 
          })},0)
         ;
       } else {
          alert(respuesta.error)
       }
     });
   }
    obtenerUsuariosConectados(): Observable<UsuariosConectados>  {
      // Emitir un evento al servidor para obtener la lista de usuarios conectados
      this.socketBackend.emit('obtenerUsuariosConectados');
  
      // Devolver el observable para que el componente pueda suscribirse
      return this.usuariosConectadosSubject.asObservable();
    }
    cerrarSesion(){
      localStorage.setItem('salir', 'true');
          this.socketBackend.disconnect();
    }
    enviarMessage(user:string,urlImagen:string,message:string){
      this.socketBackend.emit('messageDelCliente',{urlImagen,user,message} )
    }
}

