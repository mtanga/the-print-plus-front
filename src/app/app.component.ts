import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { timer } from 'rxjs';
import { ApiService } from './services/api.service';
import { FunctionsService } from './services/functions.service';
import { NoticeService } from './services/notice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'theprint';

  constructor(
    private notice : NoticeService,
    private serviceApi : ApiService,
    public router : Router,
    private functions : FunctionsService
  ) { 

    router.events.subscribe((val) => {
      // see also 
      console.log('Route', this.get_route());
      console.log(val instanceof NavigationEnd) 
  });


  }

  get_route(){
    return this.router.url.split('?')[0];
  }

  

}
