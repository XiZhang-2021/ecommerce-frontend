import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {AuthService} from "../../../shared/services/auth.service";
import {switchMap} from "rxjs";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {environments} from "../../../shared/environments/environments";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit{
  constructor(
    private httpClient : HttpClient,
    private ar : ActivatedRoute,
    private auth : AuthService,
    private router : Router
  ){}

  product : any;
  pid : any;
  newStock : number = 0;
  updStock : boolean = false;
  chaPrice : boolean = false;
  newPrice : number = 0;
  reviewList : any;
  id : any;
  p : any;
  ngOnInit(): void {
    this.ar.paramMap
      .pipe(
        switchMap((params : ParamMap) => {
          this.pid = params.get('id');
          return this.httpClient.get(environments.api+`/api/products/admin/product/${this.pid}`);
        })
      )
      .subscribe(res => {
        this.product = res;
      });
    this.id = this.ar.snapshot.params['id'];
    this.httpClient.get(environments.api+`/api/products/review/${this.id}`)
      .subscribe(res => {
        this.reviewList = res;
      });
  }


  updateStock() {
    this.updStock = true;
  }

  updateS(product : any) {
    product.stock = this.newStock;
    this.httpClient.post(environments.api+'/api/products/admin/product/updatestock', product)
      .subscribe(res => {
        console.log(res);
      });
    this.updStock = false;
    this.newStock = 0;
    this.router.navigate([`/admin/product/detail/${this.product.id}`]);
  }

  cancel() {
    this.newStock = 0;
    this.updStock = false;
    this.newPrice = 0;
    this.chaPrice = false;
  }

  delete(product: any) {
    this.httpClient.post(environments.api+'/api/products/admin/product/delete', product)
      .subscribe(res => {
        this.router.navigate(['/admin/products']).catch(error=>{console.log(error)});
      });
  }

  changP(product: any) {
    product.price = this.newPrice;
    this.httpClient.post(environments.api+'/api/products/admin/product/changeprice', product)
      .subscribe(res => {
        console.log(res);
      });
    this.chaPrice = false;
    this.newPrice = 0;
    this.router.navigate([`/admin/product/detail/${this.product.id}`]);
  }

  changePrice() {
    this.chaPrice = true;
  }
}
