import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup ,Validators } from '@angular/forms';
import { ImageService } from '../services/image.service';
import { ProfileService } from '../services/profile.service';

declare let alertify:any

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  emailAvailable = false
  emailNotAvailable = false
  successRegisted = false
  serverInternalError=false
  showAvailableEmailMessage= false
  form:any
  file:any
  previewImage: string | undefined;
  errorMessage: string | undefined;
  @Input() nombre: string = ''
  isDisabled= true
  constructor(private serviceProfile:ProfileService,
              private imageService:ImageService) { }
  
  ngOnInit(): void {
    this.form = new FormGroup({
    nombre: new FormControl({value:this.nombre, disabled:true})
    
    });
  }
  
  
  
 
  get image() { return this.form.get('image'); }

   
  onFileSelected(evento:Event){
    //capturo la imagen para pasarla a la propiedad file que se cargara al formData
    const element = evento.target as HTMLInputElement
    const file = element.files?.item(0)
    if(file){
    
      this.file= file
    }
    
    if (file) {
       // La imagen tiene un tamaño menor o igual a 4 MB
      if (file.size <= 4 * 1024 * 1024) {
       
        // Crea un objeto URL para representar la imagen seleccionada
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewImage = e.target.result;
        };
        reader.readAsDataURL(file);
        this.errorMessage = undefined; // Limpiar mensaje de error si se carga una imagen válida
      } else {
        this.errorMessage = "La imagen debe tener un tamaño menor o igual a 4 MB.";
        this.previewImage = undefined; // Limpiar vista previa de la imagen si se excede el límite de tamaño
      }  
    }
  }

  guardarCambios(){
    const formData = new FormData();
    formData.append('nombre', this.nombre);
    formData.append('image', this.file);
    
    this.serviceProfile.actualizarUsuario(formData)
    .subscribe((data:any) => {
      //actualizo el nombre de la imagen en el localstorage, con esto los mensajes ahora msotraran la nueva foto en cada mensaje
      //el codigo esta correcto, en caso de que se siga viendo la imagen anterior es por el cache del navegador
      localStorage.setItem('urlImagen',data.nuevaImagen)
      this.previewImage = undefined; // Limpiar la vista previa de la imagen
      // Actualizar la imagen en el servicio compartido
      this.imageService.updateImage(data.nombre,data.nuevaImagen);
      alertify.success('Success notification message.'); 
    },error=>{
      console.log(error)
      console.log(error.error.msg)
      console.log('ok:' + error.error.ok)
    })
  }
}
