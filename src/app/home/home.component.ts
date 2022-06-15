import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  infos : any = [];
  constructor(
    private serviceApi : ApiService,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.getSubcategories();
  }



  getSubcategories(){
    this.serviceApi.getData("categories").subscribe( async (da:any)=>{
      console.log(da.data);
      this.infos = da.data;
    })
  }

}
