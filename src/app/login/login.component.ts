import { IfStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { ApiService } from '../services/api.service';
import { NoticeService } from '../services/notice.service';

import { filter, pairwise } from 'rxjs/operators';
import { FunctionsService } from '../services/functions.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  phone_number : any;
  password : any;
  email : any;
  loginEmail : boolean = true;
  showo: boolean = false;


  constructor(
    private notice : NoticeService,
    private serviceApi : ApiService,
    private router: Router,
    private functions : FunctionsService
  ) { }

  ngOnInit(): void {
/*     this.router.events
    .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
    .subscribe((events: RoutesRecognized[]) => {
      console.log('previous url', events[0].urlAfterRedirects);
      console.log('current url', events[1].urlAfterRedirects);
    }); */
  }


  onCountryChange($event){
    console.log("onCountryChange", $event );
  }

  getNumber($event){
    console.log("Get number", $event );
    this.phone_number = $event;
   // this.check_profile_completed_update()

  }

  telInputObject($event){
    console.log("telInputObject", $event );
  }

  hasError($event){
    this.phone_number=undefined 
    //this.check_profile_completed_update()
  }

  passwordo() {
    this.showo = !this.showo;
}

  login_Email(){
    if(this.validateEmail(this.email)==!true){
      this.notice.showError("Votre e-mail n'est pas valide.", "Email")
    }
    if (this.password == "" || this.password == undefined || this.password.length < 6) {
      this.notice.showError("Votre mot de passe est court!", "Sécurité")
    } 
    else{
      let data = {
        email : this.email,
        password : this.password
      }
      this.loginUser(data, "loginwithemail");
    }
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  loginPhone(){
    if(this.phone_number == "" || this.phone_number == undefined){
      this.notice.showError("Votre téléphone n'est pas valide.", "Téléphone")
    }
    if (this.password == "" || this.password == undefined || this.password.length < 6) {
      this.notice.showError("Votre mot de passe est court!", "Sécurité")
    } 
    else{
      let data = {
        phone : this.phone_number,
        password : this.password
      }
      this.loginUser(data, "loginwithphone");
    }
  }

  loginUser(data, url){
    //console.log("erreur",  this.serviceApi.login(data, url));
    this.serviceApi.login(data, url).subscribe(async (da:any)=>{
      console.log("erreur",  da);
     if(da.user){
        let text = "Hello "+da.user.fisrt_name;
        this.notice.showSuccess(text, "Connexion réussie ")
        localStorage.setItem('is_user_infos', JSON.stringify(da.user));
        if(localStorage.getItem('current_url')){
          var url = localStorage.getItem('current_url');
          
          let current_url = JSON.parse(url);
          console.log(current_url.link);
          //let myUrl = "/"+current_url.link
           localStorage.removeItem('current_url');
            this.router.navigate([current_url.link]);
          }
          else{
            this.router.navigate(['/mon-compte']);
          }
     }
/*      else if (){

     } */
     else{
      this.notice.showError("Vos information de connexions sont incorrectes", "Statut de votre compte")
     }
    })
    //this.notice.showSuccess("Connexion réussie", "Statut de votre compte")
   // this.router.navigate(['/mon-compte']);
  }

}
