import {Component, OnInit} from '@angular/core';
import {AuthService} from "../shared/services/auth.service";
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.scss']
})
export class UserinfoComponent implements OnInit{
  constructor(
    private auth : AuthService,
    private fb : FormBuilder
  ) {}

  user : any;
  isChanging : any = false;
  isPaymentChanging : any = false;
  changeFormGroup! : FormGroup;
  paymentChangeFormGroup! : FormGroup;
  addressFormGroup! : FormGroup;
  isAddressChanging: any = false;
  ngOnInit(): void {
    this.auth.sendUser
      .subscribe(res => {
        this.user = this.auth.user;
      });

    this.changeFormGroup = this.fb.group({
      oldpassword : ['', [Validators.required]],
      newpassword : ['', [Validators.required]],
      confirm : ['', [Validators.required]]
    });

    this.paymentChangeFormGroup = this.fb.group({
      cardnumber : ['', [Validators.required, UserinfoComponent.creditCardNumberValidator()]],
      expiredate : ['', [Validators.required]],
      cvv : ['', [Validators.required]]
    });

    this.addressFormGroup = this.fb.group({
      address : ['', [Validators.required]],
      city : ['', [Validators.required]],
      zip : ['', [Validators.required]],
      state : ['', [Validators.required]],
      phone : ['', [Validators.required]]
    });
  }

  changePassword() {
    this.isChanging = true;
  }

  change() {
    const value = this.changeFormGroup.value;
    let changeReq = {
      'username' : this.auth.user.username,
      'password' : value.oldpassword,
      'newPassword' : value.newpassword
    }
    this.auth.changePassword(changeReq);
  }

  cancel() {
    this.isChanging = false;
    this.changeFormGroup.patchValue({
      oldpassword: '',
      newpassword: '',
      confirm: ''
    });
  }

  changePayment() {
    this.isPaymentChanging = true;
  }

  cancelPay() {
    this.isPaymentChanging = false;
    this.paymentChangeFormGroup.patchValue({
      cardnumber: '',
      expiredate: '',
      cvv: ''
    });
  }

  changePaymentMethod() {
    const value = this.paymentChangeFormGroup.value;
    let changePayReq = {
      'userid' : this.auth.user.id,
      'cardnumber' : value.cardnumber,
      'expiredate' : value.expiredate,
      'cvv' : value.cvv
    }
    this.auth.changPayMethod(changePayReq);
  }

  static creditCardNumberValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const creditCardNumber = control.value;
      if(creditCardNumber && creditCardNumber.length === 16) {
        return null;
      } else {
        return { 'invalidCreditCard': { value: control.value } };
      }
    };
  }

  changAddress() {
    const value = this.addressFormGroup.value;
    let changeAddrReq = {
      'userid' : this.auth.user.id,
      'address' : value.address,
      'city' : value.city,
      'zip' : value.zip,
      'state' : value.state,
      'phone' : value.phone
    };
    this.auth.changeAddress(changeAddrReq);
  }

  changeAddr() {
    this.isAddressChanging=true;
  }

  cancelAddr() {
    this.isAddressChanging = false;
    this.addressFormGroup.patchValue({
      address: '',
      city: '',
      zip: '',
      state : '',
      phone : ''
    });
  }
}
