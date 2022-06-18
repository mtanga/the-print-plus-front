import { isNgTemplate } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FunctionsService } from '../services/functions.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  infos : any = [];
  items : any = [];


  constructor(
    private serviceApi : ApiService,
    private router: Router,
    private functions : FunctionsService
  ) { }


  ngOnInit(): void {
    this.getSubcategories();
  }



  getSubcategories(){
    let data = {
      slug : "tirage-photos"
    }
    this.serviceApi.getDatas("subproducts", data).subscribe( async (da:any)=>{
      console.log(da.data);
      this.infos = da.data;
    })
  }

  productGo(item){
    let params = {
      id : item
    }
    this.functions.goToProduct("/charger", params);
  }

  
  scrollToContactTypes() {
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate(["/settings"], { fragment: "contactTypes" }).finally(() => {
        this.router.onSameUrlNavigation = "ignore"; // Restore config after navigation completes
    });
}


  showFormats(item){
    let show = "";
    item.forEach(element => {
      if(show ==""){
        show = element.name;
      }
      else{
        show = show+ "," +element.name;
      }
      
    });
    return show
  }



}