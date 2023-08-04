import {EventEmitter, Injectable, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, EMPTY, map, Observable, switchMap} from "rxjs";
import {Router} from "@angular/router";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {environments} from "../environments/environments";

@Injectable({
  providedIn : 'root'
})
export class AuthService {
  user : any | null = null;
  sendUser : BehaviorSubject<any> = new BehaviorSubject<any>(null);
  sendCart : BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private httpClient : HttpClient,
    private router : Router
  ){
    if(localStorage.getItem('token')){
      this.checkLogin()
        .subscribe(res => {
          if(res.success){
            this.user = res.user;
            console.log(this.user);
            this.sendUser.next(this.user);
            if(this.user.profile.type === 'user'){
              this.router.navigate(['/products']).catch(error => {
                console.log("navigate error");
              });
            }else if(this.user.profile.type === 'admin'){
              this.router.navigate(['/admin']).catch(error => {
                console.log("navigate error");
              });
            }
          }
        },error => {
          localStorage.removeItem('token');


          console.log('abc');
        });
    }
  }

  checkLogin():Observable<{success:boolean, user:object}>{
    return this.httpClient.get<{success:boolean, user:object}>(environments.api+'/api/auth/checklogin');
  }
  register(member : {username : string, password : string, type : string}):Observable<{success : boolean, user : object, token : string}>{
    return this.httpClient.post<{success : boolean, user : object, token : string}>(environments.api+'/api/auth/register', member);
  }

  login(user : {username : string, password : string}):Observable<{success : boolean, user : object, token : string}>{
    return this.httpClient.post<{success : boolean, user : object, token : string}>(environments.api+'/api/auth/login', user);
  }

  getCartProducts():Observable<any>{
    if(this.user){
      const userid = this.user.id;
      return this.httpClient.get(environments.api+`/api/products/cart/${userid}`);
    }
    return EMPTY;
  }

  logout(){
    localStorage.removeItem('token');
    this.user = null;
    this.sendCart.next('update');
    this.router.navigate(['/login']).catch(error=>{
      console.log(error);
    });
  }

  removeCartProduct(p: any) {
    this.httpClient.delete(environments.api+`/api/products/cart/delete/${p.id}`)
      .subscribe(res => {
        this.sendUser.next(this.user);
      });
  }

  getOrderHistory(userid : number):Observable<any>{
    return this.httpClient.get(environments.api+`/api/products/order/${userid}`).pipe(
      map((data: any) => data.sort((a:any, b:any) => new Date(b.OrderTime).getTime() - new Date(a.OrderTime).getTime()))
    );
  }


  getFavoriates(userid : number){
    return this.httpClient.get(environments.api+`/api/products/favoriate/${userid}`);
  }

  changePassword(changeReq : any) {
    this.httpClient.post(environments.api+'/api/auth/changepassword', changeReq)
      .subscribe(res => {
        this.logout();
      })
  }

  changPayMethod(changePayReq: any) {
    this.httpClient.post(environments.api+'/api/auth/changepaymethod', changePayReq)
      .pipe(
        switchMap(
          res => {
            alert('Payment method has been changed');
            return this.checkLogin();
          }
        ))
      .subscribe(res => {
        this.user = res.user;
        this.sendUser.next(this.user);
        this.router.navigate(['/products']).catch(error => {
          console.log("navigate error");
        });
      })
  }

  changeAddress(changeAddrReq: any) {
    this.httpClient.post(environments.api+'/api/auth/changeaddress', changeAddrReq)
      .pipe(
        switchMap(
          res => {
            alert('Address has been changed');
            return this.checkLogin();
          }
        ))
      .subscribe(res => {
        this.user = res.user;
        this.sendUser.next(this.user);
        this.router.navigate(['/products']).catch(error => {
          console.log("navigate error");
        });
      })
  }
}
