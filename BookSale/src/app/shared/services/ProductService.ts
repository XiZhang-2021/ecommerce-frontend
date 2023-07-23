import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Product} from "../model/product";
import {environments} from "../environments/environments";

@Injectable({
  providedIn : 'root'
})
export class ProductService{
  searchProduct : BehaviorSubject<any> = new BehaviorSubject<any>('');

  constructor(
    private httpClient : HttpClient
  ) {
  }

  getProducts():Observable<Product[]>{
    return this.httpClient.get<Product[]>(environments.api+'/api/products');
  }

  getProduct(id : number):Observable<Product>{
    return this.httpClient.get<Product>(environments.api+`/api/products/detail/${id}`);
  }

  getProductByName(event:number):Observable<Product[]> {
    return this.httpClient.get<Product[]>(environments.api+`/api/products/filter/${event}`);
  }

  getProductByGenre(genre:string){
    return this.httpClient.get<Product[]>(environments.api+`/api/products/genre/${genre}`);
  }

  search(keyword : any){
    if(keyword === undefined){
      return;
    }else{
      this.httpClient.get(environments.api+`/api/products/search/${keyword}`)
        .subscribe(res => {
          this.searchProduct.next(res);
        })
    }
  }

  adminSearch(keyword: any) {
    if(keyword === undefined){
      return;
    }else{
      this.httpClient.get(environments.api+`/api/products/admin/products/search/${keyword}`)
        .subscribe(res => {
          this.searchProduct.next(res);
        })
    }
  }
}
