import {LoginComponent} from "./auth/login/login.component";
import {NgModule} from "@angular/core";
import {Route, RouterModule, Routes} from "@angular/router";
import {RegisterComponent} from "./auth/register/register.component";
import {ProductsComponent} from "./products/products.component";
import {ProductDetailComponent} from "./products/product.detail/product.detail.component";
import {HomeComponent} from "./home/home.component";
import {CartComponent} from "./cart/cart.component";
import {PlaceorderComponent} from "./placeorder/placeorder.component";
import {UserinfoComponent} from "./userinfo/userinfo.component";
import {OrderhistoryComponent} from "./orderhistory/orderhistory.component";
import {OrderhistoryDetailComponent} from "./orderhistory/orderhistory.detail/orderhistory.detail.component";
import {AuthGuard} from "./shared/guards/auth.guard";
import {FavoriateComponent} from "./favoriate/favoriate.component";

const routes:Routes = [
  {
    path : 'home',
    component: HomeComponent
  },
  {
    path : 'products',
    component: ProductsComponent
  },
  {
    path : 'products/detail/:id',
    component: ProductDetailComponent
  },
  {
    path : 'login',
    component : LoginComponent
  },
  {
    path : 'register',
    component : RegisterComponent
  },
  {
    path : 'cart',
    component: CartComponent
  },
  {
    path : 'order',
    component : PlaceorderComponent
  },
  {
    path : 'userinfo',
    component : UserinfoComponent
  },
  {
    path : 'orderhistory',
    component: OrderhistoryComponent
  },
  {
    path : 'orderdetail/:ordersid/:ordersstatus',
    component : OrderhistoryDetailComponent
  },
  {
    path : 'products/favoriate',
    component : FavoriateComponent
  },
  {
    path : 'admin',
    loadChildren : () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate : [AuthGuard]
  },
  {
    path : '**',
    redirectTo : 'login'
  }
];
@NgModule({
  imports : [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    onSameUrlNavigation : 'reload'

  })],
  exports : [RouterModule]
})
export class AppRoutingModule{}
