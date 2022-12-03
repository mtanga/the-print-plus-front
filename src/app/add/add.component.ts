import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import {CroppedEvent} from 'ngx-photo-editor';
import { ApiService } from '../services/api.service';
import { FunctionsService } from '../services/functions.service';
import { NoticeService } from '../services/notice.service';

import { filter, map, pairwise } from 'rxjs/operators';
import {JpPreloadService} from '@jaspero/ng-image-preload';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { SafeUrl } from '@angular/platform-browser';
import { PanierService } from '../services/panier.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  ///loading: boolean = true

  progress: number = 0;
  @Input() loader:string='https://media.tenor.com/images/f864cbf3ea7916572605edd3b3fe637f/tenor.gif';
  @Input() image:string;
  isLoading:boolean = false;
  @Input() height:number=200;
  @Input() width:number=200;
  imageUrl = '';
  percentDone = 0;
  imageSrc: SafeUrl;
  imageName = 'myCustomImageName.jpg';



  imageChangedEvent: any;
  base64: any;
  uploaded : boolean = false
  sub: any;
  product : any;
  products : any;
  infos: any = [];
  images : any = []
  nombre_fois : any = 0;
  previous_url : any;
  totalt: number;
  myCart: any = [];
  optionsProduct: any;
  nbPictures: number;
  notes: any;
  ratioItem: any = "";
  promoPricing: number;
  promoPrice: any;
  promoItem: any;

  public loading = false;
  productsPanier: any = [];
  panierAll: any;

  constructor( 
    private route : ActivatedRoute,
    private functions : FunctionsService,
    private _sanitizer: DomSanitizer,
    private serviceApi : ApiService,
    private notice : NoticeService,
    private router: Router,
    private http: HttpClient,
    private panierService : PanierService,
    private jpPreloadService: JpPreloadService
    ) { 
      //this.isLoading=true;
      this.jpPreloadService.initialize();
      this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        this.previous_url = events[0].urlAfterRedirects;
        console.log('previous url', this.previous_url);
        console.log('current url', events[1].urlAfterRedirects);
      });
    }

  ngOnInit(): void {
  //  console.log("id", JSON.parse(localStorage.getItem('is_user_infos')).id);
  this.getPanierproducts(this.generateUid());
/*     if(localStorage.getItem('userUID')){
      this.getPanierproducts(localStorage.getItem('userUID'));
    }
    else{
      
    } */
  
  
/*     this.sub = this.route
    .queryParams
    .subscribe( params  => {
      this.product = parseInt(params['id']);
      this.optionsProduct = JSON.parse(localStorage.getItem('is_user_format_temp'));
      //let arr = JSON.parse(test);
      console.log("Options du pdt :", this.optionsProduct)
      if(localStorage.getItem('is_user_format_temp')){
        let form = "Format : "+this.optionsProduct.format.valeur || "RAS";
        let tail = "Format : "+this.optionsProduct.taille.name || "RAS";
        this.notes = form +" ; "+tail;
        if(this.optionsProduct.imagesNumber){
          let im = "Nombre d'images : "+this.optionsProduct.imagesNumber;
          this.notes = this.notes +" ; "+im;
        }
        if(this.optionsProduct.cadre){
          let car = "Cadre : "+this.optionsProduct.cadre.value;
          this.notes = car+" ; "+this.notes;
        }
        if(this.optionsProduct.coloris){
          let colo = "Coloris : "+this.optionsProduct.coloris;
          this.notes = this.notes +" ; "+colo;
        }
      }
      else{
        this.notes = "";
      }
      this.getProduct(this.product);
    }); */
  }

  generateUid () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    //let uid = 'ThePrint-User-' + Math.random().toString(36).substr(2, 9);
    if(localStorage.getItem('userUID')){
      return localStorage.getItem('userUID');
    }
    else{
      localStorage.setItem('userUID', 'ThePrint-User-' + Math.random().toString(36).substr(2, 9));
      return localStorage.getItem('userUID');
    }
  };

  init(){
    this.sub = this.route
    .queryParams
    .subscribe( params  => {
      this.product = parseInt(params['id']);
      this.optionsProduct = JSON.parse(localStorage.getItem('is_user_format_temp'));
      //let arr = JSON.parse(test);
      console.log("Options du pdt :", this.optionsProduct)
      if(localStorage.getItem('is_user_format_temp')){
        let form = "Format : "+this.optionsProduct.format.valeur || "RAS";
        let tail = "Format : "+this.optionsProduct.taille.name || "RAS";
        this.notes = form +" ; "+tail;
        if(this.optionsProduct.imagesNumber){
          let im = "Nombre d'images : "+this.optionsProduct.imagesNumber;
          this.notes = this.notes +" ; "+im;
        }
        if(this.optionsProduct.cadre){
          let car = "Cadre : "+this.optionsProduct.cadre.value;
          this.notes = car+" ; "+this.notes;
        }
        if(this.optionsProduct.coloris){
          let colo = "Coloris : "+this.optionsProduct.coloris;
          this.notes = this.notes +" ; "+colo;
        }
      }
      else{
        this.notes = "";
      }
      this.getProduct(this.product);
    });
  }


 getPanierproducts(id){
    this.panierService.getPanier(id).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log("panier ici ", data);
     if(data.length>0){
        this.productsPanier = data;
      } 
      this.init();
    });
  }




hideLoader(){
  this.isLoading=false;
}

  totalAmount() {
    this.totalt = 0;
    //console.log("montant", this.productsPanier);
    //var test = localStorage.getItem('the_print_cart');
    let arr =this.productsPanier;
  //  console.log('mon tableau', arr)
 // console.log("ici et ici : ", arr)

    if(arr != null){
      for (let i=0;i<arr.length;i++){
        let totalP = 0;
        totalP = arr[i].products.qte * arr[i].products.price;
        this.totalt = this.totalt+(arr[i].products.qte * arr[i].products.price);
        //console.log('mon i:',i, totalP);
        //console.log('mon total',this.totalt);
      }
    }
    return this.totalt;
  }

  getFormat(){
   // let arr = [];
    if(this.infos.haveimages == 1){
     // this.nbPictures = parseInt(this.optionsProduct.imagesNumber);
     
     return this.optionsProduct.taille;
    }
    else if (this.infos.haveimages == null && this.infos.have_types == 0){
      return this.optionsProduct.taille
    }
    else if (this.infos.have_types == 1){
      return this.optionsProduct.taille
    }
    else{
      var test = localStorage.getItem('is_user_format');
      console.log("Mes formats ici 1 ", test);
      let arr = JSON.parse(test);
      if(arr){
        return arr;
      }
      else{
        return [];
      }
     
    }
  }


  convertNumber(number){
    return parseInt(number);
  }




  getPanier(){
    console.log("je regarde le paniers",  this.productsPanier)
    var test = localStorage.getItem('the_print_cart');
    this.products = JSON.parse(test);
    //console.log()
    return this.products;
    //console.log()
    //this.delivery_points();
  }





  getProduct(product: any) {
       let data = {
      id : product
    }
    this.serviceApi.getDatas("getproduit", data).subscribe( async (da:any)=>{
     // console.log("Mon produit", da.data);
      console.log("Mon produit ici", da.data[0]);
      this.infos = da.data[0];

      if(this.infos.promotions.length>0){
        this.getPromo(this.infos.promotions[0].promotion_id);
    }
    else{
      if(this.infos.haveimages == 1){
        this.nbPictures = parseInt(this.optionsProduct.imagesNumber);
        this.ratioItem = this.optionsProduct.format.valeur;
      }
      else if (this.infos.haveimages == null && this.infos.have_types == 0){
          this.ratioItem = this.optionsProduct.format.valeur;
          console.log("Mon ratio ici", this.optionsProduct.format.ratio);
          this.nbPictures = parseInt(this.infos.photos);
          if (this.optionsProduct.imagesNumber){
            this.nbPictures = parseInt(this.optionsProduct.imagesNumber);
            console.log("super produit", this.nbPictures)
          }
      }
     // else 
      else{
        this.nbPictures = parseInt(this.infos.photos);
        this.notes = "Format : "+this.getFormat().name;
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

  getPromo(promo){
    let data = {
      promotion : promo
    }
    this.serviceApi.getDatas("getpromotion", data).subscribe( async (da:any)=>{
      console.log("Promotions ici", da.data[0]);
      this.promoItem  = da.data[0];
      let today = new Date().toISOString().slice(0, 10)
     // console.log("date", today);
      console.log("price item", this.getFormat().price);

      if(new Date(this.promoItem?.fin)>new Date(today)){
        if(da.data[0].type == "percent"){

          this.promoPricing = this.getPromoPricing(this.getFormat().price);
        }
        else{
          this.promoPricing = this.getPromoPricing(this.getFormat().price);
        }
      }
      else{
        this.promoPricing = this.getFormat().price;
      }

      if(this.infos.haveimages == 1){
        this.nbPictures = parseInt(this.optionsProduct.imagesNumber);
        this.ratioItem = this.optionsProduct.format.valeur;
      }
      else if (this.infos.haveimages == null && this.infos.have_types == 0){
          this.ratioItem = this.optionsProduct.format.valeur;
          console.log("Mon ratio ici", this.optionsProduct.format.ratio);
          this.nbPictures = parseInt(this.infos.photos);
          if (this.optionsProduct.imagesNumber){
            this.nbPictures = parseInt(this.optionsProduct.imagesNumber);
            console.log("super produit", this.nbPictures)
          }
      }
     // else 
      else{
        this.nbPictures = parseInt(this.infos.photos);
        this.notes = "Format : "+this.getFormat().name;
      }
    });

  }


  
  fileChangeEvent(event: any) {
   // this.loading = true;
    this.imageChangedEvent = event;
    
    this.uploaded = true;
   // this.loading = false;
   

  }

  imageCropped(event: CroppedEvent) {
    this.loadImage(event.base64);
    this.base64 = event.base64;
    this.images.push(this.base64);
    this.nombre_fois = this.nombre_fois + 1;
  //  this.base64 = event.base64;
  //  this.images.push(this.base64);
  //  this.nombre_fois = this.nombre_fois + 1;
  
    
  }

  loadImage(imageUrl) {
    this.imageSrc = '';
    this.http.get(imageUrl, { responseType: 'blob', reportProgress: true, observe: 'events' }).subscribe(event => {
        if (event.type === HttpEventType.DownloadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
          console.log("Pourcentage", this.progress);
          
        }
        if (event.type === HttpEventType.Response) {
          this.imageSrc = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event['body']));
        }
      }
    )
    this.progress = 0;
    //return 0;
  }

  onLoad() {
    this.isLoading = false;
    console.log("Image chargée");
}


loadImageFailed(){
  console.log("Image non chargée");
}

imageLoaded(event) {
  console.log('loaded', event);
  this.isLoading = false;
  // show cropper
}

  productGo(id){
    let params = {
      id : id,
    }
   // localStorage.setItem("imgData", this.base64);
    //localStorage.setItem('temp_image', JSON.stringify(this.images));
    this.functions.goToProduct("/item", params);
  }


  delete(img){
    if(confirm("Êtes vous sûr de vouloir supprimer cette image ?")) {
      console.log(img);
      this.images.splice(img, 1);
      this.nombre_fois = this.nombre_fois - 1;
    }
    this.isLoading = false;
  }

  add_to_cart(product){
    if(this.infos.formats?.length > 0){
          var test = localStorage.getItem('the_print_cart');
          let arr = JSON.parse(test);
          let data = {
            product : product,
            qte : 1,
            note : this.notes,
            format : this.getFormat().name,
            image : this.images,
            price : this.convertNumber(this.getFormat().price),
            id :  'cart_' + Math.random().toString(36).substr(2, 9),
          }
          let panier = {
            products : data,
            user: localStorage.getItem('userUID') || this.generateUid(),
            date : new Date()
          }
          this.panierService.create(panier).then(() => {
            this.notice.showSuccess("Produit ajouté au panier avec succès", "Mon panier");
          });
          localStorage.removeItem('is_user_format_temp');
          this.productGo(product.id);
/* 
          if(this.productsPanier?.length==0){
           this.productsPanier.push(panier);
            console.log("nouveau opanier if1", this.productsPanier);
            localStorage.removeItem('is_user_format_temp');
            this.panierService.create(this.productsPanier).then(() => {
              this.notice.showSuccess("Produit ajouté au panier avec succès", "Mon panier");
            });
           //this.productGo(product.id);
          }
          else{
            //this.productsPanier.push(data);
            this.panierService.update(this.panierAll.id, data).then(() => {
              this.notice.showSuccess("Produit ajouté au panier avec succès", "Mon panier");
            })
            .catch(err => console.log(err));
          //}

            localStorage.removeItem('is_user_format_temp'),
           // this.notice.showSuccess("Produit ajouté au panier avec succès", "Mon panier");
            //this.router.navigate(['/mon-panier']);
            console.log("nouveau opanier else 1", this.productsPanier);
           // this.productGo(product.id);
          } */
      
    }


    else{
     // if(localStorage.getItem('is_user_infos')!=null){
        var test = localStorage.getItem('the_print_cart');
        let arr = JSON.parse(test);
        let data = [{
          product : product,
          qte : 1,
          note : this.notes,
          format : this.getFormat().name,
          image : this.images,
          price : this.convertNumber(this.getFormat().price),
          id :  'cart_' + Math.random().toString(36).substr(2, 9),
        }]
        let panier = {
          products : data,
          user: localStorage.getItem('userUID') || this.generateUid(),
          date : new Date()
        }
        this.panierService.create(panier).then(() => {
          this.notice.showSuccess("Produit ajouté au panier avec succès", "Mon panier");
        });
        localStorage.removeItem('is_user_format_temp');
        this.productGo(product.id);

/*         if(this.productsPanier?.length==0){
          this.productsPanier.push(panier);
          this.panierService.create(this.productsPanier).then(() => {
            this.notice.showSuccess("Produit ajouté au panier avec succès", "Mon panier");
          });
          localStorage.removeItem('is_user_format_temp'),
          console.log("nouveau opanier else", this.productsPanier);
          //this.notice.showSuccess("Produit ajouté au panier avec succès", "Mon panier");
         // this.productGo(product.id);
        }
        else{
         // this.productsPanier.push(panier);
          //this.productsPanier.push(data);
          this.panierService.update(this.panierAll.id, data).then(() => {
            this.notice.showSuccess("Produit ajouté au panier avec succès", "Mon panier");
          })
          .catch(err => console.log(err));
          localStorage.removeItem('is_user_format_temp'),
          console.log("nouveau opanier else", this.productsPanier);
          //this.productGo(product.id);
        } */
  
      }
  }


  checkLogin(){
    let data = {
      type : "produit",
      link : "product",
      key :  "id",
      value : this.infos
    }
    localStorage.removeItem('current_url');
    localStorage.setItem('current_url', JSON.stringify(data));
    this.router.navigate(['/connexion']);
  }



  pay(product){
    if(this.infos.formats?.length > 0){
/*       if(this.format == null){
        this.notice.showError("Veuillez choisir un format", "Format invalide")
      } */
      //else{
       // if(localStorage.getItem('is_user_infos')!=null){
         // localStorage.removeItem('promo_price');
          var test = localStorage.getItem('the_print_cart');
          let arr = JSON.parse(test);
          let data ={
            product : product,
            qte : 1,
            note : this.notes,
            format : this.getFormat().name,
            image : this.images,
            price : this.convertNumber(this.promoPricing  || this.getFormat().price),
            id :  'cart_' + Math.random().toString(36).substr(2, 9),
          }
          //var test = localStorage.getItem('userUID') || this.generateUid();
          let panier = {
            products : data,
            user: localStorage.getItem('userUID') || this.generateUid(),
            date : new Date()
          }
          this.panierService.create(panier).then(() => {
            this.notice.showSuccess("Produit ajouté au panier avec succès", "Mon panier");
          });
          this.router.navigate(['/mon-panier']);

/*           if(arr==null){
            this.myCart.push(data);
            let json = JSON.stringify(this.myCart);
            localStorage.setItem('the_print_cart', json);
            this.notice.showSuccess("Produit ajouté au panier avec succès", "Mon panier");
            this.router.navigate(['/mon-panier']);
            //this.productGo(product.id);
          }
          else{
            arr.push(data);
            let json = JSON.stringify(arr);
            localStorage.setItem('the_print_cart', json);
            this.notice.showSuccess("Produit ajouté au panier avec succès", "Mon panier");
            this.router.navigate(['/mon-panier']);
            //this.productGo(product.id);
          } */
      
    }
    else{
        //localStorage.removeItem('promo_price');
     // if(localStorage.getItem('is_user_infos')!=null){
        var test = localStorage.getItem('the_print_cart');
        let arr = JSON.parse(test);
        let data ={
          product : product,
          qte : 1,
          note : this.notes,
          format : this.getFormat().name,
          image : this.images,
          price : this.convertNumber(this.promoPricing ||this.getFormat().price),
          id :  'cart_' + Math.random().toString(36).substr(2, 9),
        }
        let panier = {
          products : data,
          user: localStorage.getItem('userUID') || this.generateUid(),
          date : new Date()
        }
        this.panierService.create(panier).then(() => {
          this.notice.showSuccess("Produit ajouté au panier avec succès", "Mon panier");
        });
        this.router.navigate(['/mon-panier']);
/* 
        if(arr==null){
          this.myCart.push(data);
          let json = JSON.stringify(this.myCart);
          localStorage.setItem('the_print_cart', json);
          this.notice.showSuccess("Produit ajouté au panier avec succès", "Mon panier");
          this.router.navigate(['/mon-panier']);
          //this.productGo(product.id);
        }
        else{
          arr.push(data);
          let json = JSON.stringify(arr);
          localStorage.setItem('the_print_cart', json);
          this.notice.showSuccess("Produit ajouté au panier avec succès", "Mon panier");
          this.router.navigate(['/mon-panier']);
          //this.productGo(product.id);
        } */
  
      }
  }


}
