import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {CartService} from "../shared/services/cart.service";
import {environments} from "../shared/environments/environments";



@Component({
  selector: 'app-order',
  templateUrl: './placeorder.component.html',
  styleUrls: ['./placeorder.component.scss']
})
export class PlaceorderComponent implements OnInit {
  firstFormGroup!: FormGroup ;
  secondFormGroup!: FormGroup ;
  thirdFormGroup! : FormGroup ;
  fourthFormGroup! : FormGroup ;
  username!: string;
  address! : string;
  cardnumber!: string;
  cvv! : string;
  expdate! : string;
  city! : string;
  state! : string;
  phone! : string;
  zip! : string;
  userid! : number;
  constructor(
    private formBuilder: FormBuilder,
    private auth : AuthService,
    private httpClient : HttpClient,
    private router : Router,
    private cs : CartService
  ) {this.auth.sendUser.next(this.auth.user)}

  purchases : any ;
  index : number = 1;
  user : any;
  total : number = 0;

  purchasesReq : any;

  displayedColumns: string[] = ['Name', 'Image', 'Quantity', 'Price', 'Total'];

  pendingOrderRequest : any;


  ngOnInit(): void {
    this.auth.sendUser
      .subscribe(res => {
        //this.user = res;
        this.user = res;

        if (this.user) {
          this.userid = this.auth.user.id;
          this.username = this.user.username;
          this.address = this.user.address;
          this.expdate = this.user.validateexpdate;
          this.cvv = this.user.cvv;
          this.cardnumber = this.user.cardnumber;
          this.city = this.user.city;
          this.phone = this.user.phone;
          this.state = this.user.state;
          this.zip = this.user.zip;
        }

        // Initialize form groups after user data has been set
        this.firstFormGroup = this.formBuilder.group({
          firstCtrl: [this.username, Validators.required],
        });
        this.secondFormGroup = this.formBuilder.group({
          second1Ctrl: [this.address, Validators.required],
          second2Ctrl: [this.city, Validators.required],
          second3Ctrl: [this.zip, Validators.required],
          second4Ctrl: [this.state, Validators.required],
        });
        this.thirdFormGroup = this.formBuilder.group({
          thirdControl : [this.phone, [Validators.required]]
        });
        this.fourthFormGroup = this.formBuilder.group({
          fourth1Control: [this.cardnumber, [Validators.required, PlaceorderComponent.creditCardNumberValidator()]],
          fourth2Control: [this.expdate, Validators.required],
          fourth3Control: ['', Validators.required]
        });

        this.firstFormGroup.controls['firstCtrl'].setValue(this.username);
        this.secondFormGroup.controls['second1Ctrl'].setValue(this.address);
        this.secondFormGroup.controls['second2Ctrl'].setValue(this.city);
        this.secondFormGroup.controls['second3Ctrl'].setValue(this.zip);
        this.secondFormGroup.controls['second4Ctrl'].setValue(this.state);
        this.thirdFormGroup.controls['thirdControl'].setValue(this.phone);
        this.fourthFormGroup.controls['fourth1Control'].setValue(this.cardnumber);
        this.fourthFormGroup.controls['fourth2Control'].setValue(this.expdate);
      });
    this.auth.getCartProducts().subscribe(res => {
      res.forEach((item : any) => {
        item = Object.assign(item, {index : this.index++});
      });
      this.purchases = res;
      console.log(res);
      console.log(this.purchases);
      this.total = this.purchases.reduce((sum:any, purchase:any) => sum + purchase.total, 0);
      this.total = parseFloat(this.total.toFixed(2));
      res.forEach((item : any) => {
        delete item.index;
        delete item.id;
        delete item.cart;
        delete item.description;
      })
      res.forEach((item:any) => {
        item = Object.assign(item, {status : 'Pending'});
      });
      this.purchasesReq = res;
      console.log(this.purchasesReq);
      this.index=0;
    });
  }

  confirm(){
    let addr = '';
    if(this.address && this.city && this.zip && this.state){
      addr = this.address +', ' + this.city + ', ' + this.zip + ', ' + this.state;
    }

    console.log(this.user);
    this.pendingOrderRequest = {
      'userid' : this.userid,
      'username' : this.username,
      'totalprice' : this.total,
      'orderaddress' : addr,
      'orderpaymentinfo' : this.cardnumber,
      'purchases' : this.purchases
    }
    console.log(this.pendingOrderRequest);
    this.httpClient.post(environments.api+'/api/products/order/create', this.pendingOrderRequest)
      .subscribe(res => {
        console.log(res);
      });
    this.router.navigate(['/products']).catch(err => console.log(err));
    const items = this.cs.cartItemList.map((item:any) => item);
    items.forEach((item : any) => {
      this.auth.removeCartProduct(item);
    });

  }

  static creditCardNumberValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const creditCardNumber = control.value;
      if(creditCardNumber && creditCardNumber.length === 16) {
        return null;  // return null if validation passes
      } else {
        return { 'invalidCreditCard': { value: control.value } }
      }
    };
  }
}
