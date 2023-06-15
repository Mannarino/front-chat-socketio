import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { NetworkBySocketsIoService } from 'src/app/services/network-by-sockets-io.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  LoggedBadly= false
  serverInternalError=false
  imgCargando = false 
  form = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });
  constructor(
    private netwokBySockets:NetworkBySocketsIoService) { }

  ngOnInit(): void {
    localStorage.clear();
  }
  
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  login(){
    this.netwokBySockets.login(this.form.value)
    
  }
 
}

