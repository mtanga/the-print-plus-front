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
  forme : any;
  attribut : any;
  formatname : any;
  product : any;
  selectcoloris : any;
  item : any;
  image : any;
  selectimages : any;
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
  tailles: any;
  taille: any;
  havetaille: boolean;
  types: any;
  getformatss: boolean;
  haveimages: boolean;
  haveColoris: boolean;
  oneType: any;
  itemFormat: any;
  itemTaille: any;
  nb_img: any;
  temp_cart_item: { imagesNumber: any; format: any; taille: any; };
  promoPrice: number;
  promoItem: any;
  promoPricing: number;
  promoExisted: boolean = false;


  constructor(
    private route : ActivatedRoute,
    private functions : FunctionsService,
    private _sanitizer: DomSanitizer,
    private serviceApi : ApiService,
    private notice : NoticeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log(this.quantity);
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
    console.log("item", item);
    this.storeTailles(item);
    if(this.infos.have_types == 0){
      this.taille.forEach(element => {
        if(element.id == item){
        console.log(element)
            if(this.infos?.promotions?.length>0){
            this.real_price = element.price;
            this.priceVrai = element.price;
            let today = new Date().toISOString().slice(0, 10);
              if(new Date(this.promoItem?.fin)>new Date(today)){
                this.promoPrice = this.getPromoPricing(element.price);
              }
              else{
                this.promoPrice = element.price;
              }
            }
            else{
              this.real_price = element.price;
              this.priceVrai = element.price;
            }
       // this.
        if(localStorage.getItem('is_user_format')){
          // console.log(localStorage.getItem('is_user_format'));
           localStorage.removeItem('is_user_format');
           localStorage.setItem('is_user_format', JSON.stringify(element));
           //console.log(localStorage.getItem('is_user_format'));
           if(this.infos.haveimages == 1){
            this.haveimages = true;
           }
           if(this.infos.have_coloris == 1){
             this.haveColoris = true;
           }

           this.storeTailles(item);
         }
         else{
           localStorage.setItem('is_user_format', JSON.stringify(element));
           if(this.infos.haveimages == 1){
            this.haveimages = true;
           }
           if(this.types.have_coloris == 1){
            this.haveColoris = true;
          }
           this.storeTailles(item);
         }
        }
      });
    }

    else if(this.infos.have_types == 1){
      console.log("super")
      this.taille.forEach(element => {
        if(element.id == item){
        console.log(element)
        this.real_price = element.price;
        this.priceVrai = element.price;
          if(this.infos?.promotions?.length>0){
            this.real_price = element.price;
            this.priceVrai = element.price;
            let today = new Date().toISOString().slice(0, 10);
            if(new Date(this.promoItem?.fin)>new Date(today)){
              this.promoPrice = this.getPromoPricing(element.price);
            }
            else{
              this.promoPrice = element.price;
            }
            }
            else{
              this.real_price = element.price;
              this.priceVrai = element.price;
            }
        if(localStorage.getItem('is_user_format')){
          // console.log(localStorage.getItem('is_user_format'));
          console.log("super", this.types)
          console.log("super super", this.oneType)
          //this.haveColoris = true;
           localStorage.removeItem('is_user_format');
           localStorage.setItem('is_user_format', JSON.stringify(element));
           if(this.oneType.have_coloris == 1){
             this.haveColoris = true;
           }

           this.storeTailles(item);

         }
         else{
           localStorage.setItem('is_user_format', JSON.stringify(element));
 
           if(this.oneType.have_coloris == 1){
            this.haveColoris = true;
          }
           this.storeTailles(item);
         }
        }
      });
    }

    else{
      this.infos.formats.forEach(element => {
        if(element.id == item){
        console.log(element)
        this.real_price = element.price;
        this.priceVrai = element.price;
            if(this.infos?.promotions?.length>0){
              this.real_price = element.price;
              this.priceVrai = element.price;

              let today = new Date().toISOString().slice(0, 10);
                if(new Date(this.promoItem?.fin)>new Date(today)){
                  this.promoPrice = this.getPromoPricing(element.price);
                }
                else{
                  this.promoPrice = element.price;
                }
             
              console.log("ïci", this.promoPrice );
             // localStorage.setItem('promo_price', this.promoPrice.toString());
              //console.log("ïci 2",  localStorage.getItem('promo_price'));
              }
              else{
                this.real_price = element.price;
                this.priceVrai = element.price;
              }
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



  }

  //Pour le produit pele mele 
  pelemele(){
    console.log(this.forme);
    console.log("Image en ligne");
    if(this.forme == undefined){
      this.notice.showError("Veuillez choisir un format disponible", "Erreur");
    }
    else if(this.checker == undefined){
      this.notice.showError("Veuillez choisir une taille disponible", "Erreur");
    }
    else if(this.selectimages == undefined){
      this.notice.showError("Veuillez spécifier votre nombre d'images.", "Erreur");
    }
    else{
      let temp_cart_item = {
        imagesNumber : this.nb_img,
        format : this.itemFormat,
        taille : this.itemTaille
      }
     // if(localStorage.getItem('is_user_infos')!=null){
        localStorage.setItem('is_user_format_temp', JSON.stringify(temp_cart_item));
        let params = {
          id : this.infos.id
        }
        this.functions.goToProduct("/charger", params);
     // }
/*       else{
        this.checkLogin();
      } */
    }
  }

  otherDeco(){
    console.log(this.forme);
    if(this.forme == undefined){
      this.notice.showError("Veuillez choisir un format disponible", "Erreur");
    }
    else if(this.checker == undefined){
      this.notice.showError("Veuillez choisir une taille disponible", "Erreur");
    }
    else{
      if(this.itemFormat.nb_photos){
        this.temp_cart_item = {
          imagesNumber : this.itemFormat.nb_photos,
          format : this.itemFormat,
          taille : this.itemTaille
        }
      }
      else{
        this.temp_cart_item = {
          imagesNumber : this.nb_img,
          format : this.itemFormat,
          taille : this.itemTaille
        }
      }
      //console.log("Mon produit", temp_cart_item)
    //  if(localStorage.getItem('is_user_infos')!=null){
        localStorage.setItem('is_user_format_temp', JSON.stringify(this.temp_cart_item));
        let params = {
          id : this.infos.id
        }
        this.functions.goToProduct("/charger", params);
    //  }
/*       else{
        this.checkLogin();
      } */
    }
  }


  haveColorisProduct(){
    //if(this.forme == undefined){
     // this.notice.showError("Veuillez choisir un format disponible", "Erreur");
  //  }
    if(this.checker == undefined){
      this.notice.showError("Veuillez choisir une taille disponible", "Erreur");
    }
    else if(this.selectcoloris == undefined){
      this.notice.showError("Veuillez spécifier votre coloris", "Erreur");
    }
    else{
      let temp_cart_item = {
        format : this.itemFormat,
        taille : this.itemTaille,
        coloris : this.selectcoloris,
        cadre : this.oneType
      }
      if(localStorage.getItem('is_user_infos')!=null){
        localStorage.setItem('is_user_format_temp', JSON.stringify(temp_cart_item));
        let params = {
          id : this.infos.id
        }
        this.functions.goToProduct("/charger", params);
      }
      else{
        this.checkLogin();
      }
    }
  }


  haveNoteColoris(){
    if(this.forme == undefined){
      this.notice.showError("Veuillez choisir un format disponible", "Erreur");
    }
    else if(this.checker == undefined){
      this.notice.showError("Veuillez choisir une taille disponible", "Erreur");
    }
    else{
      let temp_cart_item = {
        format : this.itemFormat,
        taille : this.itemTaille,
        cadre : this.oneType
      }
      if(localStorage.getItem('is_user_infos')!=null){
        localStorage.setItem('is_user_format_temp', JSON.stringify(temp_cart_item));
        let params = {
          id : this.infos.id
        }
        this.functions.goToProduct("/charger", params);
      }
      else{
        this.checkLogin();
      }
    }
  }



 productGo(item){
    if(this.infos.haveimages == 1){
        this.pelemele();
    }
    //Pour les autres produits de déco murale catégorie 1
    else if (this.infos.have_types==0 && this.infos.haveimages==null){
      if(this.infos.have_coloris==1){
        this.haveColorisProduct();
      }
      else{
        this.otherDeco();
      }
      
    }
    // Produit multiple
    else if(this.infos.have_types == 1){
      if(this.formatname == undefined){
        this.notice.showError("Veuillez spécifier un cadre.", "Erreur")
      }
      else{
          if(this.oneType.have_coloris == 1){
            this.haveColorisProduct();
          }
          else{
            console.log(this.oneType)
            this.haveNoteColoris();
          }
      }
    }
    else if (this.infos.slug == "accessoires"){
      let params = {
        id : item
      }
      this.functions.goToProduct("/charger", params);
    }
    else{
      if(this.checker!=undefined){
        let params = {
          id : item
        }
        if(this.infos.attributs?.length>1){
          if(this.attribut == null || this.attribut == undefined || this.attribut == ""){
            this.notice.showError("Veuillez choisir une option pour continuer.", "Erreur")
          }
          else{
          //  if(localStorage.getItem('is_user_infos')!=null){
              this.note = "Option :"+this.attribut;
              localStorage.setItem('is_user_note', this.note);
              console.log(localStorage.getItem('is_user_note'))
              this.functions.goToProduct("/charger", params);
          //  }
          ///  else{
           //   this.checkLogin();
           // }
          }
        }
        else{
          //this.note = "R";
         // if(localStorage.getItem('is_user_infos')!=null){
            localStorage.setItem('is_user_note', this.note);
            console.log(localStorage.getItem('is_user_note'))
            this.functions.goToProduct("/charger", params);
         // }
          //else{
          //  this.checkLogin();
         // }
  
        }
      }
      else{
        this.notice.showError("Veuillez choisir un format pour continuer.", "Erreur")
      } 
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

  onFormat(item){
    console.log(item);
    let data = {
      id : item
    }
    this.serviceApi.getDatas("get_tailles", data).subscribe( async (da:any)=>{
      console.log("formats ici et ici ", da);
      this.taille = da.data;
      this.havetaille = true;
      this.storeFormat(item);
    })

  }

  getTailles(item){
    console.log(item);
    let data = {
      id : item
    }
    this.serviceApi.getDatas("get_tailles", data).subscribe( async (da:any)=>{
      console.log("formats ici et ici ", da);
      this.taille = da.data;
      //this.havetaille = true;
     // this.storeFormat(item);
    })
    return this.taille;
  }

  storeFormat(item){
    this.tailles.forEach(element => {
      if(element.id == item){
        //localStorage.setItem('is_orientation', JSON.stringify(element));
        this.itemFormat = element;
      }
    });
  }


  storeTailles(item){
    console.log("taille 2", item);
    console.log("les tailles", this.taille)
    this.taille.forEach(element => {
      if(element.id == item){
        //localStorage.setItem('is_tailles', JSON.stringify(element));
        this.itemTaille = element;
      }
    });
    console.log("taille 3", this.itemTaille);
  }

  onImage(item){
    localStorage.setItem('is_number_images', item);
    this.nb_img = this.selectimages;
  }

  onColoris(item){
    localStorage.setItem('is_coloris', item);
  }



  onTypeHit(item){
    console.log(item);
    let data = {
      id : item
    }
    this.serviceApi.getDatas("getformats", data).subscribe( async (da:any)=>{
      console.log("formats ici et ici ", da);
      this.tailles = da.data;
      this.getformatss = true;
      this.get_type(item);
    })
  }

  get_type(item){
    this.types.forEach(element => {
      if(element.id == item){
        this.oneType = element
      }
    });
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
      console.log("mon produit", da.data[0]);
      this.real_price = da.data[0].r_price;
      this.images = JSON.parse(localStorage.getItem('temp_image'));
      if(this.infos.promotions.length>0){
        
        //console.log("date", today)
        //console.log("date", today)
          this.getPromo(this.infos.promotions[0].promotion_id);
      }
      else{
        if(this.infos.have_formats == 0 && this.infos.have_types == null && this.infos.haveimages == null){
          this.taille = this.infos.formats;
          console.log("ses tailles", this.taille );
        }
        else if(this.infos.have_types == 0){
           this.getFormats();
        }
        else{
          this.get_types();
        }
      }


      
    })
  }

  getPromoPricing(price){
    console.log("Promo ici", price);
    if(this.promoItem.type == "percent"){
      return price - (price * parseInt(this.promoItem.value) / 100);
    }
    else{
      return price - parseInt(this.promoItem.value);
    }
  }

  formatDate(date){
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date(date);
    return today.toLocaleDateString("fr-FR", options);
  }

  getPromo(promo){
    let data = {
      promotion : promo
    }
    this.serviceApi.getDatas("getpromotion", data).subscribe( async (da:any)=>{
      console.log("Promotions ici", da.data[0]);
      this.promoItem  = da.data[0];

      let today = new Date().toISOString().slice(0, 10)
      console.log("date", today);
      console.log("date item", this.promoItem?.fin);

      if(new Date(this.promoItem?.fin)>new Date(today)){
        if(da.data[0].type == "percent"){
          this.promoExisted = true;
          this.promoPrice = this.getPromoPricing(this.infos.r_price);
        }
        else{
          this.promoPrice = this.getPromoPricing(this.infos.r_price);
          this.promoExisted = false;
        }

      }
      else{
        console.log("FIni");
        this.promoPrice = this.infos.r_price;
      }



      //localStorage.setItem('promo_price', this.promoPrice.toString());

      if(this.infos.have_formats == 0 && this.infos.have_types == null && this.infos.haveimages == null){
        this.taille = this.infos.formats;
        console.log("ses tailles", this.taille );
      }
      else if(this.infos.have_types == 0){
         this.getFormats();
      }
      else{
        this.get_types();
      }
    });

  }





  get_types(){
    let data = {
      id : this.infos.id
    }
    this.serviceApi.getDatas("get_types", data).subscribe( async (da:any)=>{
      console.log("types ici et ici ", da);
      this.types = da.data;
    })
  }

  getFormats(){
    let data = {
      id : this.infos.id
    }
    this.serviceApi.getDatas("getformats", data).subscribe( async (da:any)=>{
      console.log("formats ici et ici ", da);
      this.tailles = da.data;
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
