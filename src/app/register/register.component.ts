import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NoticeComponent } from '../notice/notice.component';
import { ApiService } from '../services/api.service';
import { NoticeService } from '../services/notice.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  phone_number : any;
  loginEmail : boolean = true;

  nom :any;
  prenom : any;
  emailForm: FormGroup;
  password : any;
  cpassword : any ;
  accept : any;
  email: any;

  showo: boolean = false;
  show: boolean = false;
  showc: boolean = false;

  constructor(
    private notice : NoticeService,
    private serviceApi : ApiService,
    private router: Router
  ) {

   }

  ngOnInit(): void {
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

passwordc() {
  this.showc = !this.showc;
}


  saveEmail(){
    if(this.validateEmail(this.email)==!true){
      this.notice.showError("Votre e-mail n'est pas valide.", "Email")

    }
    else if (this.password == "" || this.password == undefined || this.password.length < 6) {
      this.notice.showError("Votre mot de passe est court!", "Sécurité")
    } 
    else if (this.password != this.cpassword){
      this.notice.showError("Mots de passe différents", "Sécurité")
    }
    else if (this.accept != true){
      this.notice.showError("Veuillez accepter les termes et services du service", "Confidentialité")
    }
    else {
      let data ={
        password : this.password,
        fisrt_name : this.prenom,
        last_name : this.nom,
        email : this.email,
      }
      this.createUser(data, "registeremail");
    }
  }


  savePhone(){
    console.log(this.phone_number);
    if(this.phone_number == "" || this.phone_number == undefined){
      this.notice.showError("Votre téléphone n'est pas valide.", "Téléphone")

    }
    else if (this.password == "" || this.password == undefined || this.password.length < 6) {
      this.notice.showError("Votre mot de passe est court!", "Sécurité")
    } 
    else if (this.password != this.cpassword){
      this.notice.showError("Mots de passe différents", "Sécurité")
    }
    else if (this.accept != true){
      this.notice.showError("Veuillez accepter les termes et services du service", "Confidentialité")
    }
    else {
      let data = {
        password : this.password,
        fisrt_name : this.prenom,
        last_name : this.nom,
        phone : this.phone_number,
      }
      //console.log("with phone");
      //console.log(data);
      this.createUser(data, "registerphone");
    }
  }



  createUser(data: any, url) {
    this.serviceApi.register(data, url).subscribe( async (da:any)=>{
      console.log(da);
      this.notice.showSuccess("Votre compte a été créé avec succès", "Statut de votre compte")
      this.router.navigate(['/connexion']);
    })
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }




}
