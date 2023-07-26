import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {switchMap} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {ReviewComponent} from "../review/review.component";
import {AuthService} from "../../shared/services/auth.service";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {environments} from "../../shared/environments/environments";

@Component({
  selector: 'app-orderhistory.detail',
  templateUrl: './orderhistory.detail.component.html',
  styleUrls: ['./orderhistory.detail.component.scss']
})
export class OrderhistoryDetailComponent implements OnInit{
  constructor(
    private ar : ActivatedRoute,
    private httpClient : HttpClient,
    public dialog: MatDialog,
    private auth : AuthService,
    private router : Router
  ) {}

  ordersid : any;

  purchases : any;

  index = 1;

  reviewMessage : any;

  review : any;

  user : any;


  operation : any;

  ordersstatus : any;


  ngOnInit() {
    this.ar.paramMap
      .pipe(switchMap(params => {
        console.log(params);
        this.ordersid = params.get('ordersid');
        this.ordersstatus = params.get('ordersstatus');
        if(this.ordersstatus === 'Pending'){
          this.operation = 'Cancel';
        }else{
          this.operation = 'Refund';
        }
        return this.httpClient.get(environments.api+`/api/products/historyorderproduct/${this.ordersid}`);
      }))
      .subscribe(res => {
        if(Array.isArray(res)){
          res.forEach((item : any) => {
            item = Object.assign(item, {index : this.index++});
          });
          this.purchases = res;
          console.log(this.purchases);
        }
      });
    this.auth.sendUser
      .subscribe(res => {
        this.user = res;
      });
  }

  displayedColumns: string[] = ['No', 'Name', 'Image', 'Quantity', 'Price', 'Total', 'Status', 'Review', 'Operations'];


  openDialog(purchase : any) {
    const dialogRef = this.dialog.open(ReviewComponent);

    dialogRef.afterClosed().subscribe(review => {
      if(review){
        this.reviewMessage = review;
        this.createReview(this.reviewMessage, purchase);
      }
    });
  }

  createReview(reviewMessage : string, purchase : any){
    console.log(purchase);
    this.review = {
      userid : this.user.id,
      username : this.user.username,
      productid : purchase.product.id,
      productname : purchase.product.name,
      productimage : purchase.product.image,
      reviewtime : new Date(),
      productreview : this.reviewMessage
    }
    this.httpClient.post(environments.api+'/api/products/create/review', this.review)
      .subscribe(res => {
        console.log(res);
      })
  }

  operateing(purchase : any){
    if(purchase.status === 'Cancelled'){
      return;
    }
    console.log(purchase);
    purchase = Object.assign(purchase, {ordersid : parseInt(this.ordersid)});
    if(this.operation === 'Cancel'){
      console.log(purchase);
      this.httpClient.post(environments.api+'/api/products/historyorderproduct/pending/cancel', purchase)
        .subscribe(res => {
          this.index=1;
          console.log(res);
          this.auth.sendUser.next(this.user);
        });

    }else if(this.operation === 'Refund'){
      console.log(purchase);
      this.httpClient.post(environments.api+'/api/products/historyorderproduct/confirmed/refunding', purchase)
        .subscribe(res => {
          this.index=1;
          console.log(res);
          this.auth.sendUser.next(this.user);
        });
    }
  }

}
