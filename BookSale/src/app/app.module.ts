import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RouterLinkActive, RouterModule, RouterOutlet} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { RegisterComponent } from './auth/register/register.component';
import {CustomStyleModule} from "./shared/modules/custom/custom.module";
import {AppRoutingModule} from "./app-routing.module";
import { ProductsComponent } from './products/products.component';
import { ProductOverviewComponent } from './products/product-overview/product-overview.component';
import { ProductDetailComponent } from './products/product.detail/product.detail.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import {AuthInteceptor} from "./shared/interceptors/auth.inteceptor";
import { PlaceorderComponent } from './placeorder/placeorder.component';
import { OrderhistoryComponent } from './orderhistory/orderhistory.component';
import { UserinfoComponent } from './userinfo/userinfo.component';
import { OrderhistoryDetailComponent } from './orderhistory/orderhistory.detail/orderhistory.detail.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {NgxPaginationModule} from "ngx-pagination";
import { ReviewComponent } from './orderhistory/review/review.component';
import { FavoriateComponent } from './favoriate/favoriate.component';
import { CanvasJSAngularChartsModule } from "@canvasjs/angular-charts";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProductsComponent,
    ProductOverviewComponent,
    ProductDetailComponent,
    HeaderComponent,
    HomeComponent,
    CartComponent,
    PlaceorderComponent,
    OrderhistoryComponent,
    UserinfoComponent,
    OrderhistoryDetailComponent,
    ReviewComponent,
    FavoriateComponent,


  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterOutlet,
    ReactiveFormsModule,
    HttpClientModule,
    CustomStyleModule,
    RouterLinkActive,
    RouterModule,
    AppRoutingModule,
    MatProgressSpinnerModule,
    NgxPaginationModule,
    CanvasJSAngularChartsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInteceptor,
      multi: true
    }
  ],
  exports: [
    HeaderComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
