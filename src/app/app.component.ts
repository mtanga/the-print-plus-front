import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
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
  public loading : boolean;
  seconds: number = 0;


  interval;
  scrollY: any;
  timer: any;
  //timer: NodeJS.Timeout;


  constructor(
    private notice : NoticeService,
    private serviceApi : ApiService,
    public router : Router,
    private functions : FunctionsService
  ) { 

    router.events.subscribe((val) => {
      console.log('Route', this.get_route());
      console.log(val instanceof NavigationEnd) 
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
  });


  }

  ngOnInit() {

  }
  

  get_route(){
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

onActivate(event) {
  window.scroll({ 
          top: 0, 
          left: 0, 
          behavior: 'smooth' 
   });



    }
   


routerOnActivate() { //or ngOnInit()
  this.timer = setInterval(()=>{
             console.log("Mon temps", this.timer)
            }, 100);
}

routerOnDeactivate() {
  clearInterval(this.timer);
  console.log("Mon temps", this.timer)
}



  

}
