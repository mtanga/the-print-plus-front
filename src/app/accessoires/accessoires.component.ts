import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FunctionsService } from '../services/functions.service';

@Component({
  selector: 'app-accessoires',
  templateUrl: './accessoires.component.html',
  styleUrls: ['./accessoires.component.scss']
})
export class AccessoiresComponent implements OnInit {
  infos: any;

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
      slug : "accessoires"
    }
    this.serviceApi.getDatas("subproducts", data).subscribe( async (da:any)=>{
      console.log(da.data);
      this.infos = da.data;
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

  productGo(item){
    let params = {
      id : item
    }
    this.functions.goToProduct("/item", params);
  }

}
