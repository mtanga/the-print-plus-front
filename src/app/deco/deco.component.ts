import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FunctionsService } from '../services/functions.service';

@Component({
  selector: 'app-deco',
  templateUrl: './deco.component.html',
  styleUrls: ['./deco.component.scss']
})
export class DecoComponent implements OnInit {
  infos: any;
  infoss: any;

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
      slug : "deco-murale"
    }
    this.serviceApi.getDatas("subproducts", data).subscribe( async (da:any)=>{
      console.log(da.data);
      this.infos = da.data;
      this.getSubcategoriess();
    })
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
  

  getSubcategoriess(){
    let data = {
      slug : "deco-murale2"
    }
    this.serviceApi.getDatas("subproducts", data).subscribe( async (da:any)=>{
      console.log(da.data);
      this.infoss = da.data;
    })
  }

  productGo(item){
    let params = {
      id : item
    }
    this.functions.goToProduct("/charger", params);
  }

}