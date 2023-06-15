import { Component, OnInit , OnDestroy , AfterViewInit,Renderer2,  ElementRef, ViewChild} from '@angular/core';
import { UsuariosConectados } from '../interfaces/usuariosConectados';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup,Validators } from '@angular/forms';

import { environment } from 'src/environments/environment';
import { NetworkBySocketsIoService } from '../services/network-by-sockets-io.service';
import { ImageService } from '../services/image.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy,AfterViewInit {
  @ViewChild('chatWindow') chatWindow?: ElementRef;
  usuariosConectados:any
  numeroDeUsuariosConectados:number =0
  newMessage=''
  arrayMessages: any[] = [];
  sexo=""
  nombre=""
  endpointUrl = environment.url_endpoint;
  imagenPath = '';
  imagenUrl = '';
  userRegister=false
  form = new FormGroup({
    message: new FormControl('',[Validators.required,]),
  });

  private intervalId: any;
  constructor(//el renderer es porque necesito cerrar un div de bostrap que quedan del modal en la vista anterior
              private renderer: Renderer2 ,
              private netwokBySockets:NetworkBySocketsIoService,
              private route: ActivatedRoute,
              private router: Router,
              private imageService:ImageService
    ) {
      
     }
    
    ngOnInit(): void {
      this.updateTimeElapsed();
      this.intervalId = setInterval(() => {
        this.updateTimeElapsed();
      }, 60000); // Actualizar cada minuto (60000 milisegundos)
    
      //cierro el modal de la vista anterior
      this.cerrarModalBoostrapVistaAnterior()

      //obtengo el sexo y nombre del usuario indicados en el inicio de sesion
      this.route.queryParams.subscribe(params => {
        console.log(params)
          this.sexo = params['sexo'];
          this.nombre = params['nombre'];   
          this.userRegister=params['userRegister'];
          this.imagenPath = params['urlImagen']
          this.imagenUrl = `${this.endpointUrl}/${this.imagenPath}`;
        });
      //aca obtengos los usuarios conectados cuando inicia el componente chat y
      //hago hago una comprobacion de si el nombre que vino en la ruta existe en el array de nombres 
      //esto lo hago por si el usuario actualiza la pagina, al actualziar la pagina haria que se borre en el server 
      // su nombre pero igual podria mandar mensajes desde el cliente, al comprobar esto redirecciono afuera 
      this.netwokBySockets.usuariosConectadosSubject
            .subscribe(nombres =>{           
                let arrayNombres= nombres.usuariosConectados
                const nombreEncontrado = arrayNombres.find(objeto => objeto.nombre == this.nombre)
                if (nombreEncontrado) {
                    console.log('nombre encontrado')
                } else{
                    this.router.navigate(['/entrar-sin-registro']); 
                }                                    
               this.numeroDeUsuariosConectados = arrayNombres.length               
       })                                      

       this.imageService.image$.subscribe((data) => {
        const { nombre, imageUrl } = data;
      
        this.usuariosConectados.forEach((usuario: any) => {
          if (usuario.nombre === nombre) {
            usuario.urlImagen = imageUrl;
          }
        });
    
      });
    this.netwokBySockets.messageSubject.subscribe((Message) =>{
                       Message.timestamp=new Date()
                       Message.timeElapsed= ''
                       console.log(Message)
                       Message.urlImagen = `${this.endpointUrl}/${Message.urlImagen}`;
                       console.log(Message.urlImagen)
                       this.arrayMessages.push(Message)
                       console.log(this.usuariosConectados)
                        // Desplazarse automáticamente al último mensaje
                         this.scrollToBottom();
                    })
    
    //obtengo los usuarios para pintar en seccion conectados de la vista chat 
    this.netwokBySockets.obtenerUsuariosConectados()
    .subscribe((usuarios: UsuariosConectados) => {
      this.usuariosConectados = usuarios.usuariosConectados.map((usuario) => {
        usuario.urlImagen = `${environment.url_endpoint}/${usuario.urlImagen}` ;
        return usuario;
      }); 
    }); 
    
     
  }
  ngOnDestroy() {
    this.netwokBySockets.cerrarSesion()
    clearInterval(this.intervalId);
    window.location.reload();

  }
  ngAfterViewInit(): void {
    this.scrollToBottom();
  }
  salir(){
    this.netwokBySockets.cerrarSesion()
  }
  enviar(){
    let user =  this.nombre
    let urlImagen =''
    let message =  this.form.get('message')?.value
    if(this.userRegister){
      urlImagen = localStorage.getItem('urlImagen') || ''
    }else{
        if(this.sexo==="mujer"){
          urlImagen = `mujer.jpg` ;
        }
        else{
          urlImagen = `hombre.jpg` ;
        }
    }
    this.netwokBySockets.enviarMessage(user,urlImagen,message)
    // Restablecer el campo de entrada
    this.form.get('message')?.setValue('');
  }
  cerrarModalBoostrapVistaAnterior(){
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    modalBackdrops.forEach(backdrop => {
    this.renderer.setStyle(backdrop, 'display', 'none');
    this.renderer.removeClass(document.body, 'modal-open');  
    }); 
  }
  // Método para desplazarse automáticamente al último mensaje
  scrollToBottom(): void {
    setTimeout(() => {
      const chatWindowEl = this.chatWindow?.nativeElement;
      const lastMessage = chatWindowEl?.lastElementChild;
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 0);
  }
  updateTimeElapsed(): void {
    const now = new Date();
    for (const message of this.arrayMessages) {
      const diffInSeconds = Math.floor((now.getTime() - message.timestamp.getTime()) / 1000);
      if (diffInSeconds < 60) {
        message.timeElapsed = `${diffInSeconds} segundos atrás`;
      } else if (diffInSeconds < 3600) {
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        message.timeElapsed = `${diffInMinutes} minutos atrás`;
      } else if (diffInSeconds < 86400) {
        const diffInHours = Math.floor(diffInSeconds / 3600);
        message.timeElapsed = `${diffInHours} horas atrás`;
      } else {
        const diffInDays = Math.floor(diffInSeconds / 86400);
        message.timeElapsed = `${diffInDays} días atrás`;
      }
    }
  }
}
