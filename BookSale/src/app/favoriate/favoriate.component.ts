import {Component, OnInit} from '@angular/core';
import {AuthService} from "../shared/services/auth.service";
import {Router} from "@angular/router";
import {filter, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environments} from "../shared/environments/environments";

@Component({
  selector: 'app-favoriate',
  templateUrl: './favoriate.component.html',
  styleUrls: ['./favoriate.component.scss']
})
export class FavoriateComponent implements OnInit{
  constructor(
    private auth : AuthService,
    private router : Router,
    private httpClient : HttpClient
  ) {
    if(this.auth.user){
      this.auth.sendUser.next(this.auth.user);
    }
  }

  user : any;
  favoriates : any;
  p : any;

  ngOnInit(): void {
    this.auth.sendUser
      .pipe(
        filter(user => user != undefined),
        switchMap(user => {
          this.user = user;
          console.log(this.user);
          return this.httpClient.get(environments.api+`/api/products/favoriate/${this.auth.user.id}`)
        })
      )
      .subscribe(favoriates => {
        this.favoriates = favoriates;
      });
  }


  deleteFrom(favoriate: any) {
    this.httpClient.delete(environments.api+`/api/products/favoriate/delete/${favoriate.id}`)
      .subscribe(res => {
        console.log(res);
        this.favoriates = this.favoriates.filter((f : any) => f.id !== favoriate.id);
      });
  }
}
