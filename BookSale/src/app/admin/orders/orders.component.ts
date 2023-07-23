import { Component } from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";
import {BehaviorSubject, EMPTY, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {environments} from "../../shared/environments/environments";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {
  constructor(
    private auth : AuthService,
    private router : Router,
    private httpClient : HttpClient
  ) {this.auth.sendUser.next(this.auth.user);}
  orders : any;
  displayedColumns: string[] = ['No', 'Id', 'UserName', 'OrderTime', 'PaymentMethod', 'OrderAddress', 'Total', 'Status', 'Detail', 'Confirm', 'Cancel'];
  index = 1;
  user : any;
  keyword : any;
  p : any;

  ngOnInit() {
    this.auth.sendUser
      .pipe(
        switchMap(res => {
          if(res === null){
            return EMPTY;
          }
          this.user = this.auth.user;
          if(this.user.profile.type === 'admin'){
            return this.httpClient.get(environments.api+'/api/products/admin/orders/Pending')
          }else{
            return EMPTY;
          }
        })
      )
      .subscribe(res => {
        if(Array.isArray(res)){
          res.sort((a:any, b:any) => {
            let dateA = new Date(a.ordertime);
            let dateB = new Date(b.ordertime);

            if (dateA > dateB) {
              return -1;
            } else if (dateA < dateB) {
              return 1;
            } else {
              return 0;
            }
          });
          res.forEach((item:any) => {
            item = Object.assign(item, {index : this.index++});
          });
          this.orders = res;
        }
      });
  }


  showDetail(orders : any) {
    console.log(orders.id);
    this.router.navigate([`/admin/orders/detail/${orders.id}`]).catch(error=>{console.log(error)});
  }

  confirmOrder(orders: any) {
    delete orders.index;
    this.httpClient.post(environments.api+'/api/products/admin/orders/changestatus', orders)
      .subscribe(() => {
        console.log('confirmed');
        this.index = 1;
        this.auth.sendUser.next(this.auth.user);
        this.router.navigate(['/admin/orders']).catch(error => {
          console.log(error);
        });
      });
  }

  cancel(orders : any) {
    delete orders.index;
    this.httpClient.post(environments.api+'/api/products/admin/orders/cancel', orders)
      .subscribe(() => {
        console.log('cancelled');
        this.index = 1;
        this.auth.sendUser.next(this.auth.user);
      });
  }

  protected readonly KeyboardEvent = KeyboardEvent;

  search() {
    let inx = 1;
    if(this.keyword === undefined || this.keyword.trim() === ''){
      this.auth.sendUser.next(this.user);
    }else{
      this.httpClient.get(environments.api+`/api/products/admin/order/pending/search/${this.keyword}`)
        .subscribe(res => {
          if(Array.isArray(res)){
            res.forEach((item:any) => {
              item = Object.assign(item, {index : inx++});
            });
            this.orders = res;
            inx = 1;
          }
        });
      this.keyword = undefined;
    }
  }

  searchAll() {
    this.auth.sendUser.next(this.user);
  }
}
