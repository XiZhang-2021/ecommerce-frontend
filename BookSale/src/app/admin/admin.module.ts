import {RouterModule, Routes} from "@angular/router";
import {AddproductComponent} from "./addproduct/addproduct.component";
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {CustomStyleModule} from "../shared/modules/custom/custom.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RegisteruserComponent } from './registeruser/registeruser.component';
import { OrdersComponent } from './orders/orders.component';
import { OrdersDetailComponent } from './orders/orders-detail/orders-detail.component';
import { ConfirmedOrdersComponent } from './confirmed-orders/confirmed-orders.component';
import {ProductsComponent} from "./products/products.component";
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import {NgxPaginationModule} from "ngx-pagination";
import { CompletedOrdersComponent } from './completed-orders/completed-orders.component';
import { CompletedOrdersDetailComponent } from './completed-orders/completed-orders-detail/completed-orders-detail.component';
import { StatisticsComponent } from './statistics/statistics.component';
import {CanvasJSAngularChartsModule} from "@canvasjs/angular-charts";
import { UsersComponent } from './users/users.component';

const routes : Routes = [
  {
    path : '',
    component : AdminDashboardComponent,
    children : [
      {
        path : 'add',
        component : AddproductComponent
      },
      {
        path : 'register',
        component : RegisteruserComponent
      },
      {
        path : 'orders',
        component : OrdersComponent
      },
      {
        path : 'orders/detail/:ordersid',
        component : OrdersDetailComponent
      },
      {
        path : 'orders/confirmed',
        component : ConfirmedOrdersComponent
      },
      {
        path : 'products',
        component : ProductsComponent
      },
      {
        path : 'product/detail/:id',
        component : ProductDetailComponent
      },
      {
        path : 'orders/completed',
        component : CompletedOrdersComponent
      },
      {
        path : 'orders/completed/:ordersid',
        component : CompletedOrdersDetailComponent
      },
      {
        path : 'statistics',
        component : StatisticsComponent
      },
      {
        path : 'users',
        component : UsersComponent
      }
    ]
  }
];

@NgModule({
  declarations : [
    AddproductComponent,
    AdminDashboardComponent,
    RegisteruserComponent,
    OrdersComponent,
    OrdersDetailComponent,
    ConfirmedOrdersComponent,
    ProductsComponent,
    ProductDetailComponent,
    CompletedOrdersComponent,
    CompletedOrdersDetailComponent,
    StatisticsComponent,
    UsersComponent
  ],
  imports: [
    CommonModule,
    CustomStyleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    CanvasJSAngularChartsModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule{}
