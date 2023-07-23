import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {switchMap} from "rxjs";
import {environments} from "../../../shared/environments/environments";

@Component({
  selector: 'app-completed-orders-detail',
  templateUrl: './completed-orders-detail.component.html',
  styleUrls: ['./completed-orders-detail.component.scss']
})
export class CompletedOrdersDetailComponent implements OnInit{
  constructor(
    private ar : ActivatedRoute,
    private httpClient : HttpClient
  ) {}

  orderid : any;

  purchases : any;

  index = 1;

  displayedColumns: string[] = ['No', 'Name', 'Image', 'Quantity', 'Price', 'Total', 'Status', 'Approve', 'Decline'];

  ngOnInit() {
    this.ar.paramMap
      .pipe(switchMap(params => {
        console.log(params);
        this.orderid = params.get('ordersid');
        return this.httpClient.get(environments.api+`/api/products/admin/orders/ordersdetail/${this.orderid}`);
      }))
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
          res.forEach((item : any) => {
            item = Object.assign(item, {index : this.index++})
          });
          this.purchases = res;
          console.log(this.purchases);
        }
      })
  }

  approveRefund(purchase : any) {
    if(purchase.status === 'Refunding'){
      this.httpClient.post(environments.api+'/api/products/admin/order/completed/approve/refund', purchase)
        .subscribe(res => {
          console.log(res);
        });
    }else if(purchase.status === 'Cancelled' || purchase.status === 'Refunded' || purchase.status === 'Completed'){
      return;
    }
  }

  declineRefund(purchase : any) {
    if(purchase.status ==='Refunding'){
      this.httpClient.post(environments.api+'/api/products/admin/order/completed/decline/refund', purchase)
        .subscribe(res => {
          console.log(res);
        })
    }else if(purchase.status === 'Cancelled' || purchase.status === 'Refunded' || purchase.status === 'Completed'){
      return;
    }
  }
}
