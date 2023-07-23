import {Component, OnInit} from '@angular/core';
import {Product} from "../../shared/model/product";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../shared/services/ProductService";
import {AuthService} from "../../shared/services/auth.service";
import {CartService} from "../../shared/services/cart.service";
import {HttpClient} from "@angular/common/http";
import {filter, switchMap} from "rxjs";
import {AuthGuard} from "../../shared/guards/auth.guard";
import {environments} from "../../shared/environments/environments";

@Component({
  selector: 'app-product.detail',
  templateUrl: './product.detail.component.html',
  styleUrls: ['./product.detail.component.scss']
})
export class ProductDetailComponent implements OnInit{
  product : Product | undefined;
  id : number | undefined;
  qty : number = 1;
  reviewList : any;
  p : any;
  favoriateReq : any;
  favoriates : any;
  user : any;
  tempFavoriates : any;
  constructor(
    private ar : ActivatedRoute,
    private ps : ProductService,
    private router : Router,
    private auth : AuthService,
    private cs : CartService,
    private httpClient : HttpClient
  ) {}
  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    this.id && this.ps.getProduct(this.id)
      .subscribe(p => {
        this.product = p;
        console.log(p);
      });
    this.httpClient.get(environments.api+`/api/products/review/${this.id}`)
      .subscribe(res => {
        this.reviewList = res;
      });
    this.auth.sendUser
      .pipe(
        filter(user => user != null),
        switchMap(user => {
        this.user = user;
        return this.auth.getFavoriates(this.auth.user.id);
      }))
      .subscribe(res => {
        this.favoriates = res;
        this.tempFavoriates = res;
      });
  }
  addToCart(product : any){
    if(this.auth.user){
      product.quantity = this.qty;
      console.log(product.quantity);
      this.cs.addToCart(product);
      this.qty = 1;
    }else{
      this.router.navigate(['/login']).catch(err => console.log(err));
    }
  }

  addToFavoriate(p: Product) {
    if(this.tempFavoriates.some((tempFavoriates:any) => {return tempFavoriates.product.id === p.id})){
      alert('This product has been in you favoriate list !');
      return;
    }
    this.favoriateReq = {
      userid : this.auth.user.id,
      username : this.auth.user.username,
      product : p,
      productid : p.id,
      productname : p.name,
      image : p.image,
      description : p.description,
      author : p.author
    }
    this.tempFavoriates.push(this.favoriateReq);
    this.httpClient.post(environments.api+`/api/products/favoriate/add`, this.favoriateReq)
      .subscribe(res => {
        console.log(res);
      });
  }
}
