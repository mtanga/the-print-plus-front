import { Component, OnInit } from '@angular/core';
//import { setOptions, getJson , localeFr } from '@mobiscroll/angular';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { NoticeService } from '../services/notice.service';
import { Router } from '@angular/router';
import { ItemComponent } from '../item/item.component';

declare var CinetPay: any;

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss']
})
export class PayComponent implements OnInit {
  myData: any[];
  totalt: number;
  product: any = [];
  delivery_type : any = "domicile";
  format: any;
  infos: any;
  user: any;
  select_box: any;
  edit: boolean = true;
  edit_add : boolean = false;
  private _prevSelected: any;
  new_product: any = [];
  paid : boolean = false;
  points: any = [];
  pointsD: any = [];
  pointsP: any = [];
  totalPrice: any;
  itemDel: any= [];

  constructor(
    private http: HttpClient,
    private serviceApi : ApiService,
    private notice : NoticeService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getuser();
  }

  getuser(){
    this.user = JSON.parse(localStorage.getItem('is_user_infos'));
    console.log(this.user);
    this.getAdresse(this.user.id);
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

  check_profile_completed(){
    if(this.user.fisrt_name ==null || this.user.fisrt_name =="" || this.user.fisrt_name == undefined){
      this.edit = true;
    }
    else if(this.user.last_name ==null || this.user.last_name =="" || this.user.last_name == undefined){
      this.edit = true;
    }
    else if(this.infos.phone ==null || this.infos.phone =="" || this.infos.phone == undefined){
      this.edit = true;
    }
   else if(this.select_box ==null || this.select_box =="" || this.select_box == undefined){
      this.edit = true;
    }
    else if(this.infos.region ==null || this.infos.region =="" || this.infos.region == undefined){
      this.edit = true;
    }
    else if(this.infos.ville ==null || this.infos.ville =="" || this.infos.ville == undefined){
      this.edit = true;
    }
/*     else if(this.infos.po ==null || this.infos.po =="" || this.infos.po == undefined){
      this.edit = true;
    } */
    else if(this.infos.rue ==null || this.infos.rue =="" || this.infos.rue == undefined){
      this.edit = true;
    }
    else{
      this.edit = false;
    }
    return this.edit;
  }

  handleChange(evt) {
    var target = evt.target;
    if (target.checked) {
      this.edit_add = true
      console.log(this.edit_add)
    } 
  }



  totalAmount() {
    this.totalt = 0;
    var test = localStorage.getItem('the_print_cart');
    let arr = JSON.parse(test);
  //  console.log('mon tableau', arr)
    for (let i=0;i<arr.length;i++){
      let totalP = 0;
      totalP = arr[i].qte * arr[i].price;
      this.totalt = this.totalt+(arr[i].qte * arr[i].price);
      //console.log('mon i:',i, totalP);
      //console.log('mon total',this.totalt);
    } 
    return this.totalt;
  }

  total(number, qte){
    return parseInt(number)*parseInt(qte);
  }

  getFormat(id, item){
    //console.log(this.product)
    item.formats.forEach(element => {
      if(element.name == id){
     // console.log(element)
      this.format = element;
      }
    });
    return this.format;
  }


  getPanier(){
    var test = localStorage.getItem('the_print_cart');
    this.product = JSON.parse(test);
    console.log(this.product);
    this.delivery_points();
  }

  onChange($event){
    console.log($event.target.value);
    console.log(this.getPriceDel($event.target.value));
    this.itemDel = this.getPriceDel($event.target.value);
    console.log(this.itemDel);
    this.totalt = this.totalt+this.itemDel.price;

  }
  getPriceDel(id){
    console.log("id", id);
    let item = [];
    this.points.forEach(element => {
      if(element.id == id){
        item =  element;
      } 
    });
    return item;
  }

  handleChanged($event){
    console.log($event.target.value);
    this.delivery_type = $event.target.value;
  }

  delivery_points(){
    this.serviceApi.getData("get_delivery_points").subscribe( async (da:any)=>{
      this.points = da.data;
      console.log(this.points);
      this.filterPoints(da.data);
    })
  }

  filterPoints(data){
    data.forEach(element => {
      if(element.type=="domicile"){
          this.pointsD.push(element);
      }
      else{
        this.pointsP.push(element);
      }
      
    });

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
      this.getPanier();
  });
  }

buyNow(){
  this.payNow();
}

getOrders(){
  console.log(this.product);
  this.new_product = [];
  this.product.forEach(element => {
    let product = {
      format : parseInt(element.format) || 0,
      id : element.product.id,
      images : element.image
    }
    this.new_product.push(product);
  });
  return this.new_product;
}

test(){
  console.log(this.getOrders())
}

payNow(){
  CinetPay.setConfig({
      apikey: '17143088862973981cc5ad6.22031662',
      site_id: 589285,
      mode: 'PRODUCTION',
      notify_url: 'https://cintepay.theprintplus-cm.com/notify.php'
});
    CinetPay.getCheckout({
      transaction_id: Math.floor(Math.random() * 100000000).toString(),
      amount: this.totalAmount() + (this.itemDel.price || 0),
      currency: 'XAF',
      channels: 'ALL',
      description: 'Paiement des produits',   
      //Fournir ces variables pour le paiements par carte bancaire
      customer_name:this.user.fisrt_name,//Le nom du client
      customer_surname:this.user.last_name,//Le prenom du client
      customer_email: this.user.email || "contact@theprintplus-cm.com",//l'email du client
      customer_phone_number: this.infos.phone || "088767611",//l'email du client
      customer_address : this.infos.rue || "BP 0024",//addresse du client
      customer_city: this.infos.ville || "Douala",// La ville du client
      customer_country : "CM",// le code ISO du pays
      customer_state : "CM",// le code ISO l'état
      customer_zip_code : "06510", // code postal

        });
        CinetPay.waitResponse(function(data) {
          if (data.status == "REFUSED") {
            console.log("REFUSED", data);
            //window.location.href = "/redirect";

          } else if (data.status == "ACCEPTED") {
            console.log("ACCEPTED", data);
            window.location.href = "/redirect";
          }
        });
        CinetPay.onError(function(data) {
          console.log(data);
        });
}

saveOrders(){
  //test(){
       //console.log(this.getOrders());
      let data = {
        products : this.getOrders(),
        shipping_total : this.totalAmount(),
        status : "Paid",
        shipping_method : "Cash",
        notes : "Paiement de produits",
        shipping_address_id : 0,
        currency : "XAF",
        user_id : this.user.id,
      }  
  
  /*
     let data = {
        products : this.getOrders(),
        shipping_total : this.totalAmount(),
        status : "test",
        shipping_method : "test",
        notes : "test",
        shipping_address_id : 1,
        currency : "test",
        user_id : this.user.id
      } 
      */
  
       this.serviceApi.getDatas("order", data).subscribe( async (da:any)=>{
        console.log(da);
        if(da.success == true){
          localStorage.removeItem('the_print_cart');
          this.notice.showSuccess("Votre commande a été enregistrée, nous vous contacterons dans les plus brefs délais.", "Votre commade")
          this.router.navigate(['/mon-compte']);
        } 
      }) 
  
    }


  profile(f){
    if(f.form.value.fisrt_name ==null || f.form.value.fisrt_name =="" || f.form.value.fisrt_name == undefined){
      this.notice.showError("Veuillez renseigner votre prénom!", "Prénom")
    }
    else if(f.form.value.last_name ==null || f.form.value.last_name =="" || f.form.value.last_name == undefined){
      this.notice.showError("Veuillez renseigner votre nom!", "Nom")
    }
    else if(f.form.value.phone ==null || f.form.value.phone =="" || f.form.value.phone == undefined){
      this.notice.showError("Veuillez renseigner votre téléphone!", "Téléphone")
    }
/*     else if(f.form.value.pays ==null || f.form.value.pays =="" || f.form.value.pays == undefined){
      this.notice.showError("Veuillez renseigner votre pays!", "Pays")
    } */
    else if(f.form.value.region ==null || f.form.value.region =="" || f.form.value.region == undefined){
      this.notice.showError("Veuillez renseigner votre région!", "Région")
    }
    else if(f.form.value.ville ==null || f.form.value.ville =="" || f.form.value.ville == undefined){
      this.notice.showError("Veuillez renseigner votre ville!", "Ville")
    }
/*     else if(f.form.value.po ==null || f.form.value.po =="" || f.form.value.po == undefined){
      this.notice.showError("Veuillez renseigner votre boite postale!", "Boite postale")
    } */
    else if(f.form.value.rue ==null || f.form.value.rue =="" || f.form.value.rue == undefined){
      this.notice.showError("Veuillez renseigner votre adresse!", "Adresse")
    }
    else{
      let pro ={
        last_name : f.form.value.last_name,
        fisrt_name : f.form.value.fisrt_name,
        id : this.user.id
      }
      this.serviceApi.getDatas("edituser", pro).subscribe( async (da:any)=>{
        console.log(da.data);
        this.user = da.data;
      })

      let data = {
        pays : "Cameroun",
        ville : f.form.value.ville,
        phone : f.form.value.phone,
        region : f.form.value.region,
        po : "",
        rue : f.form.value.rue,
        user_id : this.user.id,
        id : this.infos.id
      } 
      this.serviceApi.getDatas("editaddress", data).subscribe( async (da:any)=>{
        console.log(da);
        if(da.success==true){
          this.getAdresse(this.user.id);
          this.edit = false;
        }
      })
      this.notice.showSuccess("Adresse enregistrée avec succès!","Mon compte")
      this.getuser();
    }
  }


}
