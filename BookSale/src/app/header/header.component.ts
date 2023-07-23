import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../shared/services/auth.service";
import {CartService} from "../shared/services/cart.service";
import {Router} from "@angular/router";
import {BehaviorSubject, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ProductService} from "../shared/services/ProductService";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  title = 'e-Book';
  public totalItem : number| undefined;
  user : any;
  keyword : string | undefined;
  constructor(
    public auth : AuthService,
    private cs : CartService,
    private router : Router,
    private httpClient : HttpClient,
    private ps : ProductService
  ) {
    this.auth.sendUser.next(this.auth.user);
  }

  ngOnInit(): void {
    this.auth.sendUser
      .pipe(
        switchMap((res) => {
          this.user = res;
          return this.auth.getCartProducts();})
      )
      .subscribe(res => {
        if (res && Array.isArray(res)) {
          this.totalItem = res.length;
          console.log(this.totalItem);
        } else {
          this.totalItem = 0;
        }
      });
    this.auth.sendCart.subscribe(res => {
      if(!this.auth.user){
        this.totalItem = undefined;
      }
    });

  }


  onClick() {
    if (this.auth.user){
      this.router.navigate(['/cart']).catch(error=>{console.log(error)});
    }else{
      this.router.navigate(['/login']).catch(error=>{console.log(error)});
    }

  }

  search(){
    if(this.keyword === undefined){
      return;
    }else{
      this.ps.search(this.keyword);
      this.keyword = undefined;
    }
  }
}
