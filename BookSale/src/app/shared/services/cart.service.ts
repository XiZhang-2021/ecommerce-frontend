import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, EMPTY, Observable, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {environments} from "../environments/environments";

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnInit{
  public cartItemList : any = [];
  public productList = new BehaviorSubject<any>([])
  public product : any;
  public addCartRequest : any
  constructor(
    private httpClient : HttpClient,
    private auth : AuthService
  ) {}
  ngOnInit(): void {
    this.auth.sendUser
      .pipe(
        switchMap(() => {
          if (!!this.auth.user) {
            return this.auth.getCartProducts();
          }
          return EMPTY;
        })
      )
      .subscribe(res => {
        this.cartItemList = res;
      });
  }
  getCartProducts():Observable<any>{
    return this.auth.getCartProducts();
  }
  setProduct(product : any){
    this.cartItemList.push(...product);
    this.productList.next(product);
  }

  addToCart(product : any){
    // this.cartItemList.push(product);
    product.total = product.quantity * product.price;
    this.addCartRequest = {
      productid : product.id,
      userid : this.auth.user.id,
      image : product.image,
      name : product.name,
      description : product.description,
      quantity : product.quantity,
      price : product.price,
      total : product.total
    }
    console.log(this.addCartRequest);
    this.httpClient.post(environments.api+'/api/products/cart/add', this.addCartRequest)
      .subscribe(res=>{
        this.cartItemList = res;
        console.log('add to cart');
        this.auth.sendUser.next('update');
      });
    this.productList.next(this.cartItemList);
    this.getTotalPrice();
  }

  getTotalPrice():number{
    let grandTotal = 0;
    console.log('calculating');
    if(!!this.cartItemList && this.cartItemList.length > 0){
      this.cartItemList.map((p:any) => {
        grandTotal += p.total;
      });
    }
    return parseFloat(grandTotal.toFixed(2));
  }

  removeCartItem(product : any){
    if(this.cartItemList){
      this.cartItemList.map((a:any, index:any) => {
        if(a.id === product.id){
          this.cartItemList.splice(index,1);
        }
      });
    }
    this.productList.next(this.cartItemList);
  }

}
