import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FunctionsService } from '../services/functions.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchValue : any;

  name_filtered_items: Array<any> | undefined;
  public goalList: any = [];
  public loadedGoalList: any[] | undefined;
  infos: any;
  items: any[];


  constructor(
    private serviceApi : ApiService,
    private router: Router,
    private functions : FunctionsService
  ) 
  { }

  ngOnInit(): void {
    this.getSubcategories();
  }

  initializeItems(): void {
    this.items = this.loadedGoalList;
  }

  filterList() {
    this.initializeItems();
    const searchTerm = this.searchValue;
   // console.log(searchTerm)
    if (!searchTerm) {
      return;
    }
    console.log(searchTerm)
    //this.search = true;
   // console.log(this.search)
    //console.log(this.goalList);
    this.items = this.goalList.filter((currentGoal: any) => {
      console.log(currentGoal);
      if (currentGoal.name && searchTerm) {
        //console.log(currentGoal.fName)
        if (currentGoal.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          console.log(currentGoal.title)
          return true;
        }
        //console.log(currentGoal.fName)
        return false;
      }
    });
  }


  getSubcategories(){
    this.serviceApi.getData("products").subscribe( async (da:any)=>{
      console.log(da.data);
      this.items = da.data;
      this.goalList = da.data;
      this.loadedGoalList = da.data;
    })
  }

  productGo(item){
    let params = {
      id : item
    }
    this.functions.goToProduct("/charger", params);
  }

}
