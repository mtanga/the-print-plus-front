import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor(
    private router:Router,
  ) { }


  goToProduct(link, params){
    this.router.navigate([link], { queryParams: params });
  }


}
