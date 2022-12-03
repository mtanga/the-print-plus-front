import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { PanierService } from '../services/panier.service';

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
  code_promo : any;
  infoss: any;
  navbarCollapsed = true;
  timerSubscription: Subscription; 
  constructor(
    public router: Router,
    private route:ActivatedRoute,
    private serviceApi : ApiService,
    private panierService : PanierService
    ) {

      router.events.subscribe((val) => {
        // see also 
        console.log('Route', this.get_route());
        this.check_route();
        this.getPanier();
        console.log(val instanceof NavigationEnd) 
    });

    this.timerSubscription = timer(0, 10000).pipe( 
      map(() => { 
        this.getPanier(); // load data contains the http request 
      }) 
    ).subscribe();

     }

  ngOnInit(): void {
    console.log(this.router.url); //  /routename
    //this.get_tirages();

    if(this.get_route()!="/redirect"){
      this.get_tirages();
    }
  }

  ngOnDestroy(): void { 
    this.timerSubscription.unsubscribe(); 
  } 

  get_route(){
    //console.log("Mon routeur", this.router)
    return this.router.url.split('?')[0];
  }

  check_route(){
      if(this.get_route()=='/success'){
        return true;
      }
      else if(this.get_route()=='/mon-panier'){
        return true;
      }
      else if(this.get_route()=='/paiement'){
        return true;
      }
      else if(this.get_route()=='/mon-compte'){
        return true;
      }
      else if(this.get_route()=='/charger'){
        return true;
      }
      else{
        return false;
      }
  }

  getPanier(){
 //   this.loading = true;
 if(localStorage.getItem('userUID')){
  this.panierService.getPanier(localStorage.getItem('userUID')).snapshotChanges().pipe(
    map(changes =>
      changes.map(c =>
        ({ id: c.payload.doc.id, ...c.payload.doc.data() })
      )
    )
  ).subscribe(data => {
    console.log("panier ici ", data);
   if(data.length>0){
      this.product = data;
    //  this.loading = false;
    //  this.delivery_points();
    } 
  });
 }

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

  detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

}
