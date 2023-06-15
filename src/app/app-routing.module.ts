import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { EntrarChatGuard } from './guardianes/entrar-chat.guard';
import { EntrarSinRegistroComponent } from './inicio-sesion/entrar-sin-registro/entrar-sin-registro.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { LoginComponent } from './inicio-sesion/login/login.component';
import { RegistrarseComponent } from './inicio-sesion/registrarse/registrarse.component';




const routes: Routes = [
  {path:'',component:InicioSesionComponent,
   children: [
      { path: '', component: LoginComponent },
      { path: 'login', component: LoginComponent },
      { path: 'entrar-sin-registro', component: EntrarSinRegistroComponent },
      { path: 'registrarse', component: RegistrarseComponent }
      // Aquí puedes agregar más rutas hijas si es necesario
    ]
  },
  {path:'chat',component:ChatComponent,
   canActivate: [EntrarChatGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
