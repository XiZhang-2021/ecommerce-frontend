import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {HttpClient} from "@angular/common/http";
import {switchMap} from "rxjs";
import {ProductService} from "../../shared/services/ProductService";
import {environments} from "../../shared/environments/environments";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit{
  constructor(
    private auth : AuthService,
    private httpClient : HttpClient,
    private ps : ProductService
  ){
    // this.auth.sendUser.next(this.auth.user);
  }

  user : any;
  products : any;
  keyword : any;
  p : any;
  ngOnInit(): void {
    this.auth.sendUser
      .pipe(
        switchMap(res => {
          this.user = res;
          return this.httpClient.get(environments.api+'/api/products/admin/products');
        })
      )
      .subscribe(res => {
        this.products = res;
      })

    this.ps.searchProduct
      .subscribe(res => {
        this.products = res;
      });
  }

  search(){
    if(this.keyword === undefined || this.keyword.trim() === ''){
      this.httpClient.get(environments.api+'/api/products/admin/products')
        .subscribe(res => {
          this.products = res;
        })
    } else {
      this.ps.adminSearch(this.keyword);
      this.keyword = undefined;
    }
  }
}
