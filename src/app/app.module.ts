import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { ProfileComponent } from './profile/profile.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './inicio-sesion/login/login.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { EntrarSinRegistroComponent } from './inicio-sesion/entrar-sin-registro/entrar-sin-registro.component';
import { RegistrarseComponent } from './inicio-sesion/registrarse/registrarse.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ProfileComponent,
    LoginComponent,
    InicioSesionComponent,
    EntrarSinRegistroComponent,
    RegistrarseComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
