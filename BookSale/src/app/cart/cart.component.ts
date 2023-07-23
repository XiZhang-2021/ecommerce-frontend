import {Component, OnInit} from '@angular/core';
import {CartService} from "../shared/services/cart.service";
import {AuthService} from "../shared/services/auth.service";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit{
  public cartProducts : any = [];
  public grandTotal : number = 0;
  public user : any;
  constructor(
    private cs:CartService,
    private auth : AuthService,

  ) {
    this.auth.sendUser.next(this.auth.user);
  }

  ngOnInit() {
    this.auth.sendUser
      .pipe(
        switchMap((res) => {
          this.user = this.auth.user
          return this.auth.getCartProducts()
        })
      )
      .subscribe(res => {
        this.cartProducts = res;
        this.cs.cartItemList = res;
        this.grandTotal = this.cs.getTotalPrice();
      });
  }

  removeProduct(p: any) {
    this.auth.removeCartProduct(p);
  }


}
