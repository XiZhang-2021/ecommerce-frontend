import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {Router} from "@angular/router";
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{
  registerFormGroup! : FormGroup;
  user : Object | undefined;

  constructor(
    private fb : FormBuilder,
    private auth : AuthService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.registerFormGroup = this.fb.group({
      username : ['', [Validators.email, Validators.required]],
      passwordGroup : this.fb.group({
        password : ['', Validators.required],
        confirmPassword : ''
      }, [RegisterComponent.passwordValidtor]),
      phone : ['', [Validators.required]],
      address : ['', [Validators.required]],
      city : ['', [Validators.required]],
      zip : ['', [Validators.required]],
      state : ['', [Validators.required]],
      cardnumber : ['', [Validators.required]],
      validateexpdate : ['', [Validators.required]],
      cvv : ['', [Validators.required]],
      type : ['', Validators.required]
    })
  }

  static passwordValidtor({value : {password, confirmPassword}} : FormGroup) : null | {passwordNotMatch : string}{
    return password === confirmPassword ? null : {passwordNotMatch : 'not match, please enter again'}
  }

  register(){
    if(this.registerFormGroup){
      let value = this.registerFormGroup.value;
      let username = value.username;
      let password = value.passwordGroup.password;
      let confirmPassword = value.passwordGroup.confirmPassword;
      let phone = value.phone;
      let address = value.address;
      let city = value.city;
      let zip = value.zip;
      let state = value.state;
      let cardnumber = value.cardnumber;
      let validateexpdate = value.validateexpdate;
      let cvv = value.cvv;
      let type = value.type;
      if (!password || !confirmPassword) {
        console.log('Password cannot be null');
        return;
      }
      if(type === null){
        console.log('type is null');
      }
      let member = {
        'username' : username,
        'password' : password,
        'type' : type,
        'phone' : phone,
        'address' : address,
        'city' : city,
        'zip' : zip,
        'state' : state,
        'cardnumber' : cardnumber,
        'validateexpdate' : validateexpdate,
        'cvv' : '000'
      }
      this.auth.register(member)
        .subscribe(res => {
          if (res.success){
            this.user = res.user;
            //localStorage.setItem('token', res.token);
            this.router.navigate(['/login'])
              .catch(err => {
                console.log(err);
              });
          }
        });
    }else{
      console.log('form is invalid');
    }
  }
}
