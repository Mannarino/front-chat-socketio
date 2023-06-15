import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class EntrarChatGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const entrarSinRegistro = localStorage.getItem('entrarSinRegistro')
      const token= localStorage.getItem('Token')
      if(entrarSinRegistro){
        return true;
      }
      if(token){
        return true;
      }
      alert(' Debes iniciar sesión primero.');
      this.router.navigate(['/entrar-sin-registro'] )
      return false
        
     
    
  }
  
}
