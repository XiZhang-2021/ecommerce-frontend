import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class CartproductService {

  constructor(
    private auth : AuthService,
  ) { }


}
