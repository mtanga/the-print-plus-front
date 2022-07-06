import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FunctionsService } from '../services/functions.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ApiService } from '../services/api.service';
import { NoticeService } from '../services/notice.service';


declare var CinetPay: any;
//declare var CinetPay: any = require ;
//import 'https://www.cinetpay.com/cdn/seamless_sdk/latest/cinetpay.prod.min.js';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
  
})
export class ItemComponent implements OnInit {
  sub : any;
  attribut : any;
  product : any;
  item : any;
  image : any;
  note : any;
  bannerImg: any;
  infos: any = [];
  quantity : string = "1";
  price: any;
  real_price: any;
  amount : number = 500;
  format: any;
  myCart: any = [];
  images : any = []
  checker : any;
  priceVrai: any;


  constructor(
    private route : ActivatedRoute,
    private functions : FunctionsService,
    private _sanitizer: DomSanitizer,
    private serviceApi : ApiService,
    private notice : NoticeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log(this.quantity)
    //var dataImage = localStorage.getItem('imgData');
    //this.bannerImg = document.getElementById('tableBanner');
    //this.bannerImg.src = dataImage;

   // this.image = this._sanitizer.bypassSecurityTrustStyle(`url(${localStorage.getItem('temp_image')})`);
    this.sub = this.route
    .queryParams
    .subscribe( params  => {
      this.product = parseInt(params['id']);
      this.getProduct(this.product);
    });
  }


  showFormats(item){
    let show = "";
      item.forEach(element => {
        if(show == ""){
          show = element.name;
        }
        else{
          show = show+ "/" +element.name;
        }
        
      });
      console.log(show)
      return show;

  }

  handleChanged(format){
    console.log("format", format)
    if(localStorage.getItem('is_user_format')){
     // console.log(localStorage.getItem('is_user_format'));
      localStorage.removeItem('is_user_format');
      localStorage.setItem('is_user_format', JSON.stringify(format));
      //console.log(localStorage.getItem('is_user_format'));
    }
    else{
      localStorage.setItem('is_user_format', JSON.stringify(format));
    }
    this.priceVrai = format.price;
  }

  onChange(item){
    this.infos.formats.forEach(element => {
      if(element.id == item){
      console.log(element)
      this.real_price = element.price;
      this.priceVrai = element.price;
      if(localStorage.getItem('is_user_format')){
        // console.log(localStorage.getItem('is_user_format'));
         localStorage.removeItem('is_user_format');
         localStorage.setItem('is_user_format', JSON.stringify(element));
         //console.log(localStorage.getItem('is_user_format'));
       }
       else{
         localStorage.setItem('is_user_format', JSON.stringify(element));
       }
      }
    });


  }

 productGo(item){
  if(this.checker!=undefined){
      let params = {
        id : item
      }
      if(this.infos.attributs?.length>1){
        if(this.attribut == null || this.attribut == undefined || this.attribut == ""){
          this.notice.showError("Veuillez choisir une option pour continuer.", "Erreur")
        }
        else{
          if(localStorage.getItem('is_user_infos')!=null){
            this.note = "Option :"+this.attribut;
            localStorage.setItem('is_user_note', this.note);
            console.log(localStorage.getItem('is_user_note'))
            this.functions.goToProduct("/charger", params);
          }
          else{
            this.checkLogin();
          }
        }
      }
      else{
        //this.note = "R";
        if(localStorage.getItem('is_user_infos')!=null){
          localStorage.setItem('is_user_note', this.note);
          console.log(localStorage.getItem('is_user_note'))
          this.functions.goToProduct("/charger", params);
        }
        else{
          this.checkLogin();
        }

      }

    }
    else{
      this.notice.showError("Veuillez choisir un format pour continuer.", "Erreur")
    } 

  } 

  getPrice(){

  }



  decrement(){
    if(parseInt(this.quantity)>1){
      let vl = parseInt(this.quantity)-1;
      this.quantity = String(vl);
      console.log(this.quantity);
    }
  }



  increment(){
    let vl = parseInt(this.quantity)+1;
    this.quantity = String(vl);
    console.log(this.quantity);
  }

  getProduct(product: any) {
    let data = {
      id : product
    }
    this.serviceApi.getDatas("getproduit", data).subscribe( async (da:any)=>{
      console.log("produit ici et ici ", da.data);
      console.log("Attributs ici et ici ", da.data[0].attributs);
      this.infos = da.data[0];
      this.real_price = da.data[0].r_price;
      this.images = JSON.parse(localStorage.getItem('temp_image'));
      console.log(this.images);
    })
  }




  getSantizeUrl(url : string) {
    return this._sanitizer.bypassSecurityTrustUrl(url);
}


add_to_cart(product){
  if(this.infos.formats?.length > 0){
    if(this.format == null){
      this.notice.showError("Veuillez choisir un format", "Format invalide")
    }
    else{
      if(localStorage.getItem('is_user_infos')!=null){
        var test = localStorage.getItem('the_print_cart');
        let arr = JSON.parse(test);
        let data ={
          product : product,
          qte : parseInt(this.quantity),
          format : this.format,
          image : this.images,
          price : this.real_price,
          id :  'cart_' + Math.random().toString(36).substr(2, 9),
        }
        if(arr==null){
          this.myCart.push(data);
          let json = JSON.stringify(this.myCart);
          localStorage.setItem('the_print_cart', json);
          this.notice.showSuccess("Produit ajouté au panier avec succès", "Mon panier");
          this.router.navigate(['/mon-panier']);
        }
        else{
          arr.push(data);
          let json = JSON.stringify(arr);
          localStorage.setItem('the_print_cart', json);
          this.notice.showSuccess("Produit ajouté au panier avec succès", "Mon panier");
          this.router.navigate(['/mon-panier']);
        }
      }
      else{
            this.checkLogin();
      }
  
    }
    
  }
  else{
    if(localStorage.getItem('is_user_infos')!=null){
      var test = localStorage.getItem('the_print_cart');
      let arr = JSON.parse(test);
      let data ={
        product : product,
        qte : parseInt(this.quantity),
        format : this.format,
        image : this.images,
        price : this.real_price,
        id :  'cart_' + Math.random().toString(36).substr(2, 9),
      }
      if(arr==null){
        this.myCart.push(data);
        let json = JSON.stringify(this.myCart);
        localStorage.setItem('the_print_cart', json);
        this.notice.showSuccess("Produit ajouté au panier avec succès", "Mon panier");
        this.router.navigate(['/mon-panier']);
      }
      else{
        arr.push(data);
        let json = JSON.stringify(arr);
        localStorage.setItem('the_print_cart', json);
        this.notice.showSuccess("Produit ajouté au panier avec succès", "Mon panier");
        this.router.navigate(['/mon-panier']);
      }
    }
    else{
          this.checkLogin();
    }

    }
}

checkLogin(){
  let data = {
    type : "produit",
    link : this.product,
    key :  "id",
    value : this.product
  }
  localStorage.removeItem('current_url');
  localStorage.setItem('current_url', JSON.stringify(data));
  this.router.navigate(['/connexion']);
}


payNow(product){
  console.log(product)
  if(product.formats?.length > 0){
    console.log("ici")
    if(this.format == null){
      this.notice.showError("Veuillez choisir un format", "Format invalide")
    }
    else{
      if(localStorage.getItem('is_user_infos')!=null){
        console.log(product)
        console.log("connected");
            var test = localStorage.getItem('the_print_cart');
            let arr = JSON.parse(test);
            let data ={
              product : product,
              qte : parseInt(this.quantity),
              format : this.format,
              image : this.images,
              price : this.real_price,
              id :  'cart_' + Math.random().toString(36).substr(2, 9),
            }
    
          if(arr==null){
            this.myCart.push(data);
            let json = JSON.stringify(this.myCart);
            localStorage.setItem('the_print_cart', json);
            this.router.navigate(['/paiement']);
          }
          else{
            arr.push(data);
            let json = JSON.stringify(arr);
            localStorage.setItem('the_print_cart', json);
            this.router.navigate(['/paiement']);
          }
      }
      else{
        this.checkLogin();
      }
    }
  }
  else{
    console.log(product)
    if(localStorage.getItem('is_user_infos')!=null){
      console.log(product)
      console.log("connected");
          var test = localStorage.getItem('the_print_cart');
          let arr = JSON.parse(test);
          let data ={
            product : product,
            qte : parseInt(this.quantity),
            format : this.format,
            image : this.images,
            price : this.real_price,
            id :  'cart_' + Math.random().toString(36).substr(2, 9),
          }
  
        if(arr==null){
          this.myCart.push(data);
          let json = JSON.stringify(this.myCart);
          localStorage.setItem('the_print_cart', json);
          this.router.navigate(['/paiement']);
        }
        else{
          arr.push(data);
          let json = JSON.stringify(arr);
          localStorage.setItem('the_print_cart', json);
          this.router.navigate(['/paiement']);
        }
    }
    else{
      this.checkLogin();
      //localStorage.setItem('current_url', this.router.url);
     // this.router.navigate(['/connexion']);
    }
  }
}


test(){
      CinetPay.setConfig({
        apikey: '17143088862973981cc5ad6.22031662',
        site_id: 589285,
        mode: 'PRODUCTION',
        notify_url: 'https://cintepay.theprintplus-cm.com/notify.php'
    });
        CinetPay.getCheckout({
          transaction_id: Math.floor(Math.random() * 100000000).toString(),
          amount: 100,
          currency: 'XAF',
          channels: 'ALL',
          description: 'Test de paiement',   
          //Fournir ces variables pour le paiements par carte bancaire
          customer_name:"Joe",//Le nom du client
          customer_surname:"Down",//Le prenom du client
          customer_email: "down@test.com",//l'email du client
          customer_phone_number: "088767611",//l'email du client
          customer_address : "BP 0024",//addresse du client
          customer_city: "Antananarivo",// La ville du client
          customer_country : "CM",// le code ISO du pays
          customer_state : "CM",// le code ISO l'état
          customer_zip_code : "06510", // code postal

            });
            CinetPay.waitResponse(function(data) {
              if (data.status == "REFUSED") {
                
              } else if (data.status == "ACCEPTED") {
              
              }
            });
            CinetPay.onError(function(data) {
              console.log(data);
            });
}

}
