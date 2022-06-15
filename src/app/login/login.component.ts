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
    this.serviceApi.login(data, url).subscribe( async (da:any)=>{
     if(da.user){
       let text = "Hello "+da.user.fisrt_name;
      this.notice.showSuccess(text, "Connexion 'reussie ")
      localStorage.setItem('is_user_infos', JSON.stringify(da.user));
      if(localStorage.getItem('current_url')){
        var url = localStorage.getItem('current_url');
        let current_url = JSON.parse(url);
        let params = {
          id : current_url.value,
        }
        localStorage.removeItem('current_url');
        this.functions.goToProduct("/produit", params);

      }
      else{
        this.router.navigate(['/mon-compte']);
      }
     }
     else{
      this.notice.showError("Vos information de connexions sont incorrectes", "Statut de votre compte")
     }
    })
    //this.notice.showSuccess("Connexion réussie", "Statut de votre compte")
   // this.router.navigate(['/mon-compte']);
  }

}
