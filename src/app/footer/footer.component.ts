import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(public router: Router,) {
    router.events.subscribe((val) => {
      // see also 
      console.log('Route', this.get_route());
      //this.getPanier();
      console.log(val instanceof NavigationEnd) 
  });
   }

  ngOnInit(): void {
  }

  get_route(){
    //console.log("Mon routeur", this.router)
    return this.router.url.split('?')[0];
  }

}
