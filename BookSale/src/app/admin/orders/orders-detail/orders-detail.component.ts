import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {switchMap} from "rxjs";
import {environments} from "../../../shared/environments/environments";

@Component({
  selector: 'app-orders-detail',
  templateUrl: './orders-detail.component.html',
  styleUrls: ['./orders-detail.component.scss']
})
export class OrdersDetailComponent implements OnInit{
  constructor(
    private ar : ActivatedRoute,
    private httpClient : HttpClient
  ) {}

  orderid : any;

  purchases : any;

  index = 1;

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

  displayedColumns: string[] = ['No', 'Name', 'Image', 'Quantity', 'Price', 'Total', 'Status'];

  // approveCancelling(purchase:any) {
  //   if(purchase.status === 'Pending'){
  //     return;
  //   }
  //   this.httpClient.post('http://localhost:8080/api/products/admin/pending/cancel/approve', purchase)
  //     .subscribe(res => {
  //       console.log(res);
  //     });
  // }

  // declineCancelling(purchase : any) {
  //   if(purchase.status === 'Pending' || purchase.status === 'Confirmed' || purchase.status === 'Completed'){
  //     return;
  //   }
  //   this.httpClient.post('http://localhost:8080/api/products/admin/pending/cancel/decline', purchase)
  //     .subscribe(res => {
  //       console.log(res);
  //     });
  // }
}
