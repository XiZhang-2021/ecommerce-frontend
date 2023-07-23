import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable({
  providedIn : 'root'
})
export class AuthGuard implements CanActivate{
  constructor(
    private auth : AuthService,
    private router : Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.auth.user || this.auth.user.profile.type !== 'admin') {
      // 返回一个UrlTree对象，让路由器导航到'/products'路由
      this.router.navigate(['/products']).catch(error => console.log(error));
    }
    console.log(this.auth.user.profile.type);
    return !!this.auth.user && this.auth.user.profile.type === 'admin';
  }
}

