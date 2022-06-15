import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { NoticeService } from '../services/notice.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  tab : any = "orders"
  edit : boolean = false;
  edit_a : boolean = false;
  nom : any;
  prenom : any;
  user : any;
  opassword : any;
  cpassword : any;
  password : any;
  showo: boolean = false;
  show: boolean = false;
  showc: boolean = false;
  infos: any;
  phone : any;
  myData: any[];
  orders: any;


  constructor(
    private serviceApi : ApiService,
    private notice : NoticeService,
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('is_user_infos'));
    console.log(this.user);
    this.getAdresse(this.user.id);
  }

  getCountries(){
    this.http.get('https://trial.mobiscroll.com/content/countries.json').subscribe((resp: any) => {
      const countries = [];
      for (let i = 0; i < resp.length; ++i) {
          const country = resp[i];
          countries.push({ text: country.text, value: country.value });
      }
      this.myData = countries;
      console.log(this.myData);
      this.getorders();
  });
  }


getAdresse(user: any) {
  let data = {
    user : user
  }
  this.serviceApi.getDatas("showaddress", data).subscribe( async (da:any)=>{
    console.log(da);
    this.infos = da.data[0];
    this.getCountries();
  })
}

getorders(){
  let data = {
    user : this.user.id
  }
    this.serviceApi.getDatas("get_orders", data).subscribe( async (da:any)=>{
      console.log(da);
      this.orders = da.data;
      //this.getCountries();
    })
}

passwordo() {
    this.showo = !this.showo;
}

passwordc() {
  this.showc = !this.showc;
}

passwordv() {
  this.show = !this.show;
}

logout(){
  localStorage.removeItem('is_user_infos'),
  this.router.navigate(['/connexion']);
}

  profile(f){
    let data ={
      last_name : f.form.value.nom,
      fisrt_name : f.form.value.prenom,
      id : this.user.id
    }
    this.serviceApi.getDatas("edituser", data).subscribe( async (da:any)=>{
      console.log(da.data);
      this.user = da.data;
      this.edit = false;
    })
  }


  editadresse(f){
    let data = {
      pays : f.form.value.pays,
      ville : f.form.value.ville,
      phone : f.form.value.phone,
      region : f.form.value.region,
      po : f.form.value.po,
      rue : f.form.value.rue,
      user_id : this.user.id,
      id : this.infos.id
    } 
    this.serviceApi.getDatas("editaddress", data).subscribe( async (da:any)=>{
      console.log(da);
      if(da.success==true){
        this.getAdresse(this.user.id);
        this.edit_a = false;
      }
    })

  }




  pass(){
    if (this.password == "" || this.password == undefined || this.password.length < 6) {
      this.notice.showError("Votre mot de passe est court!", "Sécurité")
    } 
    if(this.password != this.cpassword){
      this.notice.showError("Mots de passe différents", "Sécurité")
    }
    else{

    }
    let data ={
      password : this.opassword,
      current : this.password
    }
    this.serviceApi.getDatas("editpass", data).subscribe( async (da:any)=>{
      console.log(da.data);
      //this.user = da.data;
      this.notice.showSuccess("Votre mot de passe a été créé avec succès", "Sécurité")
    })
  }

}
