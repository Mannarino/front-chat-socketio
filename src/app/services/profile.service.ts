import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserRegistrado } from '../interfaces/user-registrado';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  crearUsuario(form:any){
    return this.http.post(`${environment.url_endpoint}/users/`,form)
  }
  actualizarUsuario(form:any){
    return this.http.put(`${environment.url_endpoint}/users/`,form)
  }
  saveProfile(userRegistrado:UserRegistrado){
    localStorage.setItem('nombre',userRegistrado.nombre)
    localStorage.setItem('sexo',userRegistrado.sexo)
    localStorage.setItem('urlImagen',userRegistrado.urlImagen)
  }
  getProfile(){
    const profile = {
      name : localStorage.getItem('ProfileName'),
      email : localStorage.getItem('ProfileEmail')
    }
    return profile
  }
  removeProfile(){
    localStorage.removeItem('ProfileName')
    localStorage.removeItem('ProfileEmail')
  }  
  logout(){
    this.removeProfile()
    // this.router.navigate(['/login'])
    // this.handleTokensService.removeToken()
  }
}
