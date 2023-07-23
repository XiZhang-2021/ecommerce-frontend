import {Component, OnInit} from '@angular/core';
import {ProductService} from "../shared/services/ProductService";
import {HttpClient} from "@angular/common/http";
import {Product} from "../shared/model/product";
import {Observable} from "rxjs";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit{

  bookName : string | undefined;
  author : string | undefined;
  p : any;
  constructor(
    private ps : ProductService,
    private httpClient : HttpClient
  ){}


  products : any;
  selectedCategory : string = 'all';

  ngOnInit(): void {
    this.ps.getProducts()
      .subscribe(res => {
        this.products = res;

        this.products.forEach((a:any) => {
          Object.assign(a,{quantity:1, total:a.price});
        });
      });
    this.ps.searchProduct
      .subscribe(res => {
        this.products = res;
      });
  }

  searchByBookName(event : any){
    this.ps.getProductByName(event);
  }

  onChangeCategory(){
    console.log(this.selectedCategory);
    if(this.selectedCategory === 'all'){
      this.ps.getProducts()
        .subscribe(res => {
          this.products = res;
        });
      return;
    }
    this.ps.getProductByGenre(this.selectedCategory)
      .subscribe(res => {
        this.products = res;
      });
  }

  highToLow() {
    this.products = this.products?.sort((a:any, b:any) => {return b.price - a.price});
  }

  lowToHigh() {
    this.products = this.products?.sort((a:any, b:any) => {return a.price - b.price});
  }
}
