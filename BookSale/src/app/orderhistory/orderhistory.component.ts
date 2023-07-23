import {Component, OnInit} from '@angular/core';
import {AuthService} from "../shared/services/auth.service";
import {EMPTY, startWith, switchMap, tap} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-orderhistory',
  templateUrl: './orderhistory.component.html',
  styleUrls: ['./orderhistory.component.scss']
})
export class OrderhistoryComponent implements OnInit{
  constructor(
    private auth : AuthService,
    private router : Router
  ) {
    this.auth.sendUser.next(this.auth.user);
  }
  historyOrder : any;
  displayedColumns: string[] = ['No', 'OrderId', 'OrderTime', 'PaymentMethod', 'Total', 'Status', 'Detail'];
  index = 1;
  user : any;
  p : any;
  ngOnInit() {
    this.auth.sendUser
      .pipe(
        startWith(null),
        switchMap(res => {
          if(res === null){
            return EMPTY;
          }
          this.user = res;
          if(this.user.id === undefined){
            // handle undefined user id
            return EMPTY;
          }
          return this.auth.getOrderHistory(this.user.id);
        })
      )
      .subscribe(res => {
        console.log(res);
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
        res.map((item:any) => {
          return item = Object.assign(item, {index : this.index++});
        });
        this.historyOrder = res;
      });
  }


  showDetail(historyorder : any) {
    console.log(historyorder.id);
    this.router.navigate([`/orderdetail/${historyorder.id}/${historyorder.status}`]).catch(error => {console.log(error)});
  }


}
