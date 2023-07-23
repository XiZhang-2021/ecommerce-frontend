import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(
    private auth : AuthService,
    private httpClient : HttpClient,
    private router : Router
  ) {
  }

  login({value} : NgForm){
    this.auth.login(value)
      .subscribe(
        res => {
        if(res.success){
          this.auth.user = res.user;
          localStorage.setItem('token', res.token);
          this.auth.sendUser.next('update');
          if(this.auth.user.profile.type === 'user'){
            this.router.navigate(['/products']).catch(err =>{
              console.log('navigate fail');
            });
          }else if(this.auth.user.profile.type === 'admin'){
            this.router.navigate(['/admin']).catch(err =>{
              console.log('navigate fail');
            });
          }
        }
      },
      err => {
        console.error('Login failed',err);
      });
  }
}
