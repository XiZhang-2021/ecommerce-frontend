import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../shared/services/auth.service";
import {switchMap} from "rxjs";
import {environments} from "../../shared/environments/environments";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit{

  user : any;
  orderProducts : any;
  map : any;
  chartOptions : any;
  chartOptionsCategory : any;
  categoryMap : any;
  products : any;
  chartOptionsProductCategory: any;
  chartOptionsProductCategoryMap : any
  constructor(
    private httpClient : HttpClient,
    private auth : AuthService,
  ) {}

  ngOnInit(): void {
    this.auth.sendUser
      .pipe(switchMap(user => {
        this.user = user;
        return this.httpClient.get(environments.api+'/api/products/historyorderproduct/getall')
      }))
      .subscribe(res => {
        this.orderProducts = res;
        this.map = new Map();
        this.categoryMap = new Map();
        this.map.set(1, 200);
        this.map.set(2, 100);
        this.map.set(3, 300);
        this.map.set(4, 34);
        this.map.set(5, 500);
        this.map.set(6, 123);
        this.map.set(7, 0);
        this.map.set(8, 345);
        this.map.set(9, 34);
        this.map.set(10, 0);
        this.map.set(11, 0);
        this.map.set(12, 0);
        this.categoryMap.set('history', 0);
        this.categoryMap.set('art', 0);
        this.categoryMap.set('textbook', 0);
        this.categoryMap.set('novel', 0);
        this.categoryMap.set('computer', 0);
        let totalSaledProducts = 0;
        console.log(this.orderProducts);
        for (let order of this.orderProducts) {
          let nowDate = new Date();
          let nowYear = nowDate.getFullYear();
          let date = new Date(order.ordertime);
          let year = date.getFullYear();
          if(year !== nowYear){
            continue;
          }
          let month = date.getMonth() + 1;
          let total = this.map.get(month) || 0;
          this.map.set(month, total + order.total);
          this.categoryMap.set(order.product.genre, this.categoryMap.get(order.product.genre) + order.quantity);
          totalSaledProducts += order.quantity;
        }

        this.chartOptions = {
          title: {
            text: "Monthly Sales Amount"
          },
          animationEnabled: true,
          axisY: {
            includeZero: true,
            prefix : '$'
          },
          axisX: {
            interval: 1, // Set interval to 1 to display a label for every data point
          },
          data: [{
            type: "column", //change type to bar, line, area, pie, etc
            //indexLabel: "{y}", //Shows y value on all Data Points
            indexLabelFontColor: "#5A5757",
            dataPoints: [
              { label: 'Jan', y: this.map.get(1) },
              { label: 'Feb', y: this.map.get(2) },
              { label: 'Mar', y: this.map.get(3) },
              { label: 'Apr', y: this.map.get(4) },
              { label: 'May', y: this.map.get(5) },
              { label: 'Jun', y: this.map.get(6) },
              { label: 'Jul', y: this.map.get(7) },
              { label: 'Aug', y: this.map.get(8) },
              { label: 'Sep', y: this.map.get(9) },
              { label: 'Oct', y: this.map.get(10) },
              { label: 'Nov', y: this.map.get(11) },
              { label: 'Dec', y: this.map.get(12) },
            ]
          }]
        };

        let categories = ['history', 'art', 'textbook', 'novel', 'computer'];

        for(let category of categories){
          this.categoryMap.set(category, this.categoryMap.get(category) * 100 / totalSaledProducts);
        }

        this.chartOptionsCategory = {
          animationEnabled: true,
          // theme: "dark2",
          exportEnabled: true,
          title: {
            text: "Book Category Percentage"
          },
          subtitles: [{
            text: "Sold Books Data"
          }],
          data: [{
            type: "pie", //change type to column, line, area, doughnut, etc
            indexLabel: "{name}: {y}%",
            yValueFormatString: "#,##0.00'%'",
            dataPoints: [
              { name: "history", y: this.categoryMap.get('history') },
              { name: "art", y: this.categoryMap.get('art') },
              { name: "textbook", y:this.categoryMap.get('textbook') },
              { name: "computer", y: this.categoryMap.get('computer') },
              { name: "novel", y: this.categoryMap.get('novel') }
            ]
          }]
        };
      });

    this.chartOptionsProductCategoryMap = new Map();

    this.httpClient.get(environments.api+'/api/products')
      .subscribe(res => {
        this.products = res;
        console.log(res);
        for(let product of this.products){
          if(this.chartOptionsProductCategoryMap.has(product.genre)){
            this.chartOptionsProductCategoryMap.set(product.genre, this.chartOptionsProductCategoryMap.get(product.genre) + 1);
          }else{
            this.chartOptionsProductCategoryMap.set(product.genre, 1);
          }
        }
        let size = this.chartOptionsProductCategoryMap.size;
        let sum = this.products.length;
        for(let key of this.chartOptionsProductCategoryMap.keys()){
          this.chartOptionsProductCategoryMap.set(key, this.chartOptionsProductCategoryMap.get(key)*100/sum);
        }
        let dataPoints = Array.from(this.chartOptionsProductCategoryMap.entries()).map((entry : any)=> {
          console.log(entry[0], entry[1]);
          let categoryName = entry[0];
          let value = entry[1];
          return {y : value,
                  name : categoryName};
        });
        console.log(dataPoints);
        this.chartOptionsProductCategory = {
          animationEnabled: true,
          //theme: "dark2",
          colorSet: "customColorSet",
          title:{
            text: "Percentage of All Kinds of Books"
          },
          data: [{
            type: "doughnut",
            indexLabel: "{name}: {y}",
            innerRadius: "90%",
            yValueFormatString: "#,##0.00'%'",
            dataPoints: dataPoints
          }]
        };
      });
  }
}
