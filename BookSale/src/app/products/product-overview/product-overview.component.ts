import {Component, Input} from '@angular/core';
import {Product} from "../../shared/model/product";
import {CartService} from "../../shared/services/cart.service";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-product-overview',
  templateUrl: './product-overview.component.html',
  styleUrls: ['./product-overview.component.scss']
})
export class ProductOverviewComponent {
  @Input()
  product : Product | undefined;

  productList : any;

  constructor(
    private cs : CartService,
    private httpClient : HttpClient,
    private auth : AuthService,
    private router : Router
  ) {}

  addToCart(event: Event, product : any){
    if(this.auth.user){
      this.cs.addToCart(product);
      this.auth.sendUser.next(this.auth.user);
      return false;
    }else{
      this.router.navigate(['/login']).catch(err => console.log(err));
      return false;
    }
  }
}
