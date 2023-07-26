import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../shared/services/auth.service";
import {switchMap} from "rxjs";
import {environments} from "../../shared/environments/environments";


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit{
  user : any;
  users : any;
  displayedColumns: string[] = ['id', 'type', 'username', 'address', 'phone', 'delete'];
  p: any;
  keyword: any;

  constructor(
    private httpClient : HttpClient,
    private auth : AuthService
  ) {}

  ngOnInit(): void {
    this.auth.sendUser
      .pipe(switchMap(user => {
        this.user = user;
        return this.httpClient.get(environments.api+'/api/auth/users');
      }))
      .subscribe(res => {
        this.users = res;
        console.log(this.users);
        if(Array.isArray(this.user)){
          this.user.sort((a : any, b : any) => {return a.id - b.id});
        }
      });
  }


  delete(user : any) {
    console.log(user);
    let uid = user.id + '';
    this.httpClient.delete(environments.api+`/api/auth/users/delete/${uid}`)
      .subscribe(res => {
        console.log(res);
      });
  }

  search() {
    this.keyword = this.keyword + '';
    this.httpClient.get(environments.api+`/api/auth/users/${this.keyword}`)
      .subscribe(res => {
        this.users = [res];
        this.keyword = undefined;
      });
  }

  getAllUsers() {
    this.auth.sendUser.next(this.user);
  }
}
