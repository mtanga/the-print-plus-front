import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { timer } from 'rxjs';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  product: any;
  tirage : any;
  deco : any;
  accessoires : any;
  subShow : boolean = false;
  tir : boolean = false;
  dec : boolean = false;
  ac : boolean = false;
  acc: any;
  infoss: any;

  constructor(
    public router: Router,
    private route:ActivatedRoute,
    private serviceApi : ApiService
    ) {

      router.events.subscribe((val) => {
        // see also 
        console.log('Route', this.get_route());
        this.getPanier();
        console.log(val instanceof NavigationEnd) 
    });
/*       const ticker = timer(0, 5000);
      ticker.subscribe(() => {
        console.log('Route', this.get_route());
        this.getPanier();

      });  */
     }

  ngOnInit(): void {
    console.log(this.router.url); //  /routename
    this.get_tirages();
  }

  get_route(){
    //console.log("Mon routeur", this.router)
    return this.router.url.split('?')[0];
  }

  getPanier(){
    var test = localStorage.getItem('the_print_cart');
    this.product = JSON.parse(test);
    console.log(this.product);
    this.get_tirages();
  }


  get_tirages(){
    let data = {
      slug : "tirage-photos"
    }
    this.serviceApi.getDatas("subproducts", data).subscribe( async (da:any)=>{
      this.tirage = da.data;
      this.getDeco();
    })
  }

  getDeco(){
    let data = {
      slug : "deco-murale"
    }
    this.serviceApi.getDatas("subproducts", data).subscribe( async (da:any)=>{
      console.log(da.data);
      this.deco = da.data;
      this.getAcc();
    })
  }

  getAcc(){
    let data = {
      slug : "accessoires"
    }
    this.serviceApi.getDatas("subproducts", data).subscribe( async (da:any)=>{
      console.log(da.data);
      this.acc = da.data;
      this.getSubcategoriess();
    })
  }

  getSubcategoriess(){
    let data = {
      slug : "deco-murale2"
    }
    this.serviceApi.getDatas("subproducts", data).subscribe( async (da:any)=>{
      console.log(da.data);
      this.infoss = da.data;
    })
  }

  show(item){
    this.subShow = true;
    if(item=='tirage-photos'){
        this.tir = true;
        this.ac = false;
        this.dec = false;
    }
    if(item=='deco'){
      this.tir = false;
      this.ac = false;
      this.dec = true;
  }
  if(item=='acc'){
    this.tir = false;
    this.ac = true;
    this.dec = false;
}

  }
  mouseLeave(){
    this.subShow = false;
    this.tir = false;
    this.ac = false;
    this.dec = false;
  }

  mouseLeaveall(){
    this.subShow = false;
    this.tir = false;
    this.ac = false;
    this.dec = false;
  }

}
