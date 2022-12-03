import { Component, OnInit } from '@angular/core';
//import { setOptions, getJson , localeFr } from '@mobiscroll/angular';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { NoticeService } from '../services/notice.service';
import { Router } from '@angular/router';
import { ItemComponent } from '../item/item.component';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map, take } from 'rxjs/operators';
import { interval, Subscription, timer } from 'rxjs';
import { FunctionsService } from '../services/functions.service';
import { ToastrService } from 'ngx-toastr';
import { PanierService } from '../services/panier.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgStyle } from '@angular/common';
declare var CinetPay: any;


@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss'],
  
})
export class PayComponent implements OnInit {
  subscription: Subscription;
  timerSubscription: Subscription; 
  public loading = false;
  public hitCode = false;
  myData: any[];
  totalt: number;
  product: any = [];
  delivery_type : any = "domicile";
  format: any;
  phone: any;
  paymement_type:any
  paymement_number:any;
  fisrt_name: any;
  last_name: any;
  infos: any = {
    region : '',
    ville : '',
    rue : '',
    phone : ''
  };

  getService: any = {};
  postQuote: any = {};
  postCollect : any = {};
  verify : any = {};
  transaction : any = {};

  user: any = {
    fisrt_name : '',
    last_name : ''
  };
  field : any;
  select_box: any;
  edit: boolean = true;
  edit_add : boolean = false;
  private _prevSelected: any;
  new_product: any = [];
  paid : boolean = false;
  points: any = [];
  pointsD: any = [];
  pointsP: any = [];
  pointsA: any = [];
  totalPrice: any;
  itemDel: any= [];
  idCMD: string;
  pic: any;
  showed: boolean =  true;
  showedOne: boolean =  true;
  idLivraiosn: any;
  code_promo : any;
  realPrice: number = 0;
  promoPrice: number = 0;

  timeLeft: number = 60;
  interval;
  subscribeTimer: any;


services : any = [
    {
      name : "MTN MoMo",
      id : "20056",
      regex : /^(237|00237|\\+237)?(?!650110360|671927008|672515252|672514557)((650|651|652|653|654|680|681|682|683|684|685|686|687|688|689)[0-9]{6}$|(67[0-9]{7})$)/
  },
  {
    name : "Orange Money",
    id : "30056",
    regex : /^(237)?((655|656|657|658|659)[0-9]{6}$|(69[0-9]{7})$)/
  }
]
  methodService: any;
  hitCodeDiv: boolean = false;
  minute: number;
  sec: any;

  constructor(
    private http: HttpClient,
    private serviceApi : ApiService,
    private con : ApiService,
    private notice : NoticeService,
    private storage: AngularFireStorage,
    private router: Router,
    private db: AngularFirestore,
    private functions : FunctionsService,
    private toastr: ToastrService,
    private panierService : PanierService,
    private modalService: NgbModal
  ) 
  { 


    // timer(0, 10000) call the function immediately and every 10 seconds 
/*     this.timerSubscription = timer(0, 10000).pipe( 
        map(() => { 

          this.update_cmd(); 
        }) 
      ).subscribe();  */


  }

  ngOnInit(): void {
    this.getuser();
  }


	open(content) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
      //	this.closeResult = `Closed with: ${result}`;
      console.log(result);
			},
			(reason) => {
        console.log(reason);
			//	this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
  }
  

  getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}


  getuser(){
    this.user = JSON.parse(localStorage.getItem('is_user_infos'));
    console.log(this.user);
    //this.form.get('name').disable();
    this.loading = true;
    this.getAdresse(this.user.id);
  }


  onCountryChange($event){
    console.log("onCountryChange", $event );
  }

  onCountryChanges($event){
    console.log("onCountryChange", $event );
  }

  getNumber($event){
    console.log("Get number", $event );
    this.phone = $event;
    this.check_profile_completed_update()

  }

  getNumbers($event){
    console.log("Get number", $event );
    this.paymement_number = $event;
  }

  telInputObject($event){
    console.log("telInputObject", $event );
  }

  telInputObjects($event){
    console.log("telInputObject", $event );
  }

  hasError($event){
    this.phone=null 
    this.check_profile_completed_update()
  }

  hasErrors($event){
    this.paymement_number=null 
   // this.check_profile_completed_update()
  }


  getAdresse(user: any) {
    let data = {
      user : user
    }
    this.serviceApi.getDatas("showaddress", data).subscribe( async (da:any)=>{
      console.log("Mes addresses", da);
      this.infos = da.data[0];
      this.getCountries();
    })
  }


/* 
  check_profile_completed_update(){
    if(this.infos.length == 0){
      return true;
    }
    else if ((this.user.fisrt_name ==null || this.user.fisrt_name =="" || this.user.fisrt_name == undefined) || (this.user.last_name ==null || this.user.last_name =="" || this.user.last_name == undefined) || ){

    }
    else{
      return false;
    }
  } */

  check_profile_completed_update(){
    //console.log();
    if(document.forms["Form"]["fisrt_name"].value == null || document.forms["Form"]["fisrt_name"].value =="" || document.forms["Form"]["fisrt_name"].value == undefined){
      this.edit = false;
      this.field = "prénom"
    }
    else if(document.forms["Form"]["last_name"].value ==null || document.forms["Form"]["last_name"].value=="" || document.forms["Form"]["last_name"].value == undefined){
      this.edit = false;
      this.field = "nom"
    }
    else if(this.phone ==null || this.phone =="" || this.phone == undefined || this.infos.phone == "ND"){
      this.edit = false;
      this.field = "Téléphone"
    }   
    else if(document.forms["Form"]["region"].value ==null || document.forms["Form"]["region"].value =="" || document.forms["Form"]["region"].value == undefined || this.infos.region == "ND"){
      this.edit = false;
      this.field = "région"
    }
    else if(document.forms["Form"]["ville"].value ==null || document.forms["Form"]["ville"].value =="" || document.forms["Form"]["ville"].value== undefined || this.infos.ville == "ND"){
      this.edit = false;
      this.field = "ville"
    }
    else if(document.forms["Form"]["rue"].value ==null || document.forms["Form"]["rue"].value =="" || document.forms["Form"]["rue"].value == undefined || this.infos.rue == "ND"){
      this.edit = false;
      this.field = "quartier"
    }
    else{
      this.edit = true;
    }
    //console.log("ici et ici",  this.select_box)
    return this.edit;
  }

  check_ok(){
    console.log("iciii", this.check_profile_completed_update());
  if(this.check_profile_completed_update() && this.select_box==!undefined){
      return true;
    }
    else{
      return false;
    }
  }

  profile(){
    if(!this.check_profile_completed_update()){
      let pro ={
        last_name : document.forms["Form"]["last_name"].value,
        fisrt_name : document.forms["Form"]["fisrt_name"].value,
        id : this.user.id
      }
      this.serviceApi.getDatas("edituser", pro).subscribe( async (da:any)=>{
        console.log("user edited", da.data);
        this.user = da.data;
      })

      let data = {
        pays : "Cameroun",
        ville : document.forms["Form"]["ville"].value,
        phone : document.forms["Form"]["phone"].value,
        region : document.forms["Form"]["region"].value,
        po : "",
        rue : document.forms["Form"]["rue"].value,
        user_id : this.user.id,
        id : this.infos.id
      } 
      console.log("adresse", data)
      this.serviceApi.getDatas("editaddress", data).subscribe( async (da:any)=>{
        console.log(da);
        if(da.success==true){
          this.getAdresse(this.user.id);
          this.edit = false;
        }
      })
      this.notice.showSuccess("Adresse enregistrée avec succès!","Mon compte")
      //this.getuser();
    }
    else{
      this.notice.showError("Une erreur s'est produite veuillez réessayer ultérieurement!","Mon compte")
    }
  }


  check_profile_completed(){
    console.log(document.forms["Form"]["fisrt_name"].value);
    if(document.forms["Form"]["fisrt_name"].value ==null || document.forms["Form"]["fisrt_name"].value =="" || document.forms["Form"]["fisrt_name"].value == undefined){
      this.edit = true;
    }
    else if(document.forms["Form"]["last_name"].value ==null || document.forms["Form"]["last_name"].value=="" || document.forms["Form"]["last_name"].value == undefined){
      this.edit = true;
    }
    else if(this.select_box ==null || this.select_box =="" || this.select_box == undefined){
      this.edit = true;
    }
    else if(this.phone ==null || this.phone =="" || this.phone == undefined){
      this.edit = true;
    }   
    else if(document.forms["Form"]["region"].value ==null || document.forms["Form"]["region"].value =="" || document.forms["Form"]["region"].value == undefined){
      this.edit = true;
    }
    else if(document.forms["Form"]["ville"].value ==null || document.forms["Form"]["ville"].value =="" || document.forms["Form"]["ville"].value== undefined){
      this.edit = true;
    }
/*     else if(this.infos.po ==null || this.infos.po =="" || this.infos.po == undefined){
      this.edit = true;
    } */
    else if(document.forms["Form"]["rue"].value ==null || document.forms["Form"]["rue"].value =="" || document.forms["Form"]["rue"].value == undefined){
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
    //var test = localStorage.getItem('the_print_cart');
    let arr = this.product;
  //  console.log('mon tableau', arr)
    if(arr!=null){
      for (let i=0;i<arr.length;i++){
        let totalP = 0;
        totalP = arr[i].products.qte * arr[i].products.price;
        this.totalt = this.totalt+(arr[i].products.qte * arr[i].products.price);
        //console.log('mon i:',i, totalP);
        //console.log('mon total',this.totalt);
      } 
      return this.totalt;
    }
    
  }

  int(number){
    return parseInt(number);
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

  apply(){
    this.loading = true;
      console.log();
      let data = {
        code : this.code_promo
      }
      this.serviceApi.getDatas("checkpromo", data).subscribe( async (da:any)=>{
        console.log("promo", da);
        this.loading = false;
        if(da.data.length == 0){
          this.notice.showError("Dësolé ce code promo n'existe pas. Veuillez essayer un autre", "Code promo");
        }
        else{
          //let date  =new Date().toJSON().slice(0,10).replace(/-/g,'/');
          //console.log(date);
          //console.log(new Date(da.data[0].status).toJSON().slice(0,10).replace(/-/g,'/'));
          if(new Date(da.data[0].status).toJSON().slice(0,10).replace(/-/g,'/')>=new Date().toJSON().slice(0,10).replace(/-/g,'/')){
              //this.
              let bonprix = this.totalAmount() + (this.int(this.itemDel.price) || 0);
              if(da.data[0]=="Pourcentage"){
                this.promoPrice = 0;
                this.realPrice = 0;
                this.promoPrice = bonprix * da.data[0].value / 100;
                this.realPrice =  bonprix - this.promoPrice;
              }
              else{
                this.promoPrice = 0;
                this.realPrice = 0;
                this.promoPrice = da.data[0].value;
                this.realPrice =  bonprix - this.promoPrice;
              }

          }
          else{
            this.notice.showError("Dësolé ce code promo n'est déjà expiré. Veuillez essayer un autre", "Code promo")
          }

        } 
      })
  }


  getPanier(){
    this.loading = true;
    this.panierService.getPanier(localStorage.getItem('userUID')).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log("panier ici ", data);
     if(data.length>0){
        this.product = data;
        this.loading = false;
        this.delivery_points();
      } 
    });
}

  getPaniers(){
   // var test = localStorage.getItem('the_print_cart');
    //this.product = JSON.parse(test);
    //console.log(this.product);
    return this.product;
  }

  onChange($event){
    this.idLivraiosn = $event.target.value;
    localStorage.setItem('delivery_infos_id', $event.target.value);
    console.log("livraiosn", $event.target.value);
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
      else if (element.type=="agence"){
        this.pointsA.push(element);
      }
      else{
        this.pointsP.push(element);
      }
      
    });
    //this.getAgence(data);
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


/* 
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
} */




getOrders(){
  console.log("Mon panier est pliein", this.getPaniers())
  this.product= this.getPaniers();
  this.new_product = [];
  this.product.forEach(element => {
    let product = {
      format : element.products.format,
      id : element.products.product.id,
      images : element.products.image,
      note : element.productsnote,
      qte : element.products.qte,
      price : element.products.price,
      p_name : element.products.product.name
    }
    this.new_product.push(product);
  });
  return this.new_product;
}


test(){
  console.log(this.getOrders())
}


buyNow(){
  this.loading = true;
  //window.location.href = "#/redirect";
  //this.saveOrders();
  //this.payNow();
}



testons(){
  this.notice.showSuccess("Paiement effectué", "SUper");
}

testonss(){
  this.notice.showSuccess("Paiement effectué", "SUper");
}

saveOrders(datas){
  console.log("this.idLivraiosn,", this.idLivraiosn);
  //test(){
       this.realPrice = 0;
       let bonprix = this.totalAmount() + (this.int(this.itemDel.price) || 0);
       this.realPrice =  bonprix - this.promoPrice;
       console.log("ici le prix", this.realPrice );
      // let dati = new Date();
       //dati.format("y-m-d");
        let data = {
          //products : this.getOrders(),
          shipping_total :this.realPrice,
          status : this.verify.data.status,
          ptn : this.verify.data.ptn,
          transaction_id : this.verify.data.trid,
          shipping_method : this.verify.data.merchant,
          payment_method_id : this. getPhone(this.paymement_number),
          notes : "Paiement de produits",
          shipping_address_id : localStorage.getItem('delivery_infos_id'),
          currency : "XAF",
          user_id : this.user.id
        }  
  
       this.serviceApi.getDatas("order", data).subscribe( async (da:any)=>{
        console.log("order", da);
        if(da.success == true){
          console.log("goood", da.success);
          //localStorage.removeItem('the_print_cart');
         // this.notice.showSuccess("Votre commande a été enregistrée, nous vous contacterons dans les plus brefs délais.", "Votre commade")
         this.saveItems(da);
        } 
      }) 
  
    }


    saveItems(item){
      console.log("items", this.getOrders());
      console.log("retour", item);
      this.getOrders().forEach(element => {

        let idCMD = 'CMD-'+item.data.id+'-' + Math.random().toString(36).substr(2, 9);
        this.db.collection("items_orders").add({
          name: element.p_name,
          price: element.price,
          qte: element.qte,
          format: element.format || "",
          cmd: item.data.id,
          notes: element.note || "",
          itemId:idCMD,
          images:element.images,
          dateCreated: firebase.firestore.Timestamp.fromDate(new Date()),
          visible: true
        }); 
      });

      let array = [];
      array = this.getPaniers();
      array.forEach(element => {
        this.panierService.delete(element.id).then(() => {
        })
      });
      this.loading = false;
      //console.log();
      let params = {
        reload : 1,
        status : this.verify.data.status
      }

      this.functions.goToProduct("/success", params);
     // this.payNow(item.data.id, item.data.shipping_total);

    }

    testt(){
      console.log("J'ai finis, Merci");
    }


    updateClientPhoto(url, id){
      this.db.collection("clients_photos").add({
        idCMD: id,
        url: url,
        dateCreated: firebase.firestore.Timestamp.fromDate(new Date()),
        visible: true
      }); 
    }




    payByMobileMoney(){
      if(this.paymement_type ==null || this.paymement_type=="" || this.paymement_type==undefined){
        this.notice.showError("Veuillez sélectionner une méthode de paiement.", "Méthode de paiement incorecte");
      }
      else if(this.paymement_number==null || this.paymement_number.length != 13 ){
        this.notice.showError("Veuillez saisir un numéro de téléphone correct.", "Numéro de paiement incorect");
      }
      else{
        this.methodService = this.services.find((service) => service.id == this.paymement_type);
        if(this.checkMtnPhone(this.paymement_number, this.methodService.regex)==false){
          this.notice.showError("Veuillez saisir un numéro de téléphone correspondant à votre méthode de paiement", "Numéro de paiement incorect");
        }
        else{
          console.log("phone", this. getPhone(this.paymement_number));
          this.realPrice = 0;
          let bonprix = this.totalAmount() + (this.int(this.itemDel.price) || 0);
          this.realPrice =  bonprix - this.promoPrice;
          console.log("ici le prix", this.realPrice )
          let data = {
            'customerNumber' : this. getPhone(this.paymement_number),
            'service' : this.paymement_type,
            'method': this.methodService.name,
            'amount':this.realPrice,
            'user': JSON.parse(localStorage.getItem('is_user_infos'))
          }
          //console.log("object", data);
          this.MakeCashout(data);
        }
      }
    }

    getPhone(phone){
      let phone1 = phone.replace("+","");
      return phone1.replace(/\s/g, '');
  }

    checkMtnPhone(number, regex){
      let phone1 = number.replace("+","");
      let phone = phone1.replace(/\s/g, '');
      var phoneRGEX = regex;
      return phoneRGEX.test(phone);
    }

    async MakeCashout(data){
      this.loading = true;
      if(await this.con.getData("ping").toPromise()){
          console.log("passé")
          let donnees1 = {
            serviceid : data.service
          }
          this.getService = {};
          this.getService  = await this.con.getDatas("get_cashout", donnees1).toPromise();
          console.log("le service ici", this.getService);
            if(this.getService.status=="success"){
              let donnees2 = {
                quotestd : this.getService.data.payItemId,
                amount : data.amount
              }
              this.postQuote = {};
              this.postQuote  = await this.con.getDatas("post_quote", donnees2).toPromise();
              console.log("le post quote ici", this.postQuote);
              if(this.postQuote.status=="success"){
                let donnees3 = {
                  quoteId: this.postQuote.data.quoteId,
                  phone_number: data.customerNumber,
                  email: data.user.email || 'contact@theprintplus-cm.com',
                  t_id : 'cmd' + Math.random().toString(36).substr(2, 9),
                  user: data.user.fisrt_name+" "+data.user.last_name,
                  address: "Mambanda Bonaberi",
                  service_number: data.customerNumber
                }
                //this.postCollect  = await this.con.getDatas("post_collect", donnees3).toPromise();
                console.log("le post collect ici", this.postCollect);
                  try {
                    this.postCollect = {};
                    this.postCollect  = await this.con.getDatas("post_collect", donnees3).toPromise();
                    if(this.postCollect.status=="success"){
                      console.log("postcollect", this.postCollect);
                      this.loading = false;
                      this.hitCodeDiv = true;
                      this.startTimer();
                     // this.loading = false;
                     // this.hitCodeDiv = true;
               /*       let donnees4 = {
                      ptn : this.postCollect.data.ptn
                    }
                    this.verify = {};
                    this.verify  = await this.con.getDatas("verify", donnees4).toPromise();
                    console.log("le verify ici", this.verify);
                    if(this.verify.status=="success"){
                           this.loading = false;
                           this.saveOrders(this.verify);

                    }
                    else{
                      this.loading = false;
                    } */
                    }
                    else{
                      console.log("33Trnasaction echouée..........");
                      this.loading = false;
                    }
                  } catch (err) {
                    this.loading = false;
                     console.log("erreur", err);
                    
                  }
  
              }
              else{
                this.loading = false;
              }
              
            }
            else{
              this.loading = false;
            } 
  
      }
      else{
          console.log("API indisponible")
          this.loading = false;
      }
    }

    formatTime(seconds) {
      var min = new String(Math.floor(seconds / 60));
      var sec = new String(seconds % 60);
    
      while (min.length < 2) min = '0' + min;
      while (sec.length < 2) sec = '0' + sec;
    
      return min + ':' + sec;
    };

    async continue(){
      this.loading = true;
      //data.trid
      //  const modalRef = this.modalService.open(NgbdModalContent);
      let donnees4 = {
        trid : this.postCollect.data.trid,
        ptn :""
        }
      this.verify = {};
      console.log("trid", donnees4)
      this.verify  = await this.con.getDatas("verify", donnees4).toPromise();
      console.log("le verify ici", this.verify);
      if(this.verify.data.status=="SUCCESS"){
      this.loading = false;
      this.saveOrders(this.verify);
      
      }
      else if(this.verify.data.status=="ERRORED"){
        this.loading = false;
        this.notice.showWarning("Oups, votre paiement a échoué veuillez réssayer.", "Paiement échoué");
        this.hitCodeDiv = false;
      }
      else if(this.verify.data.status=="PENDING"){
        this.notice.showWarning("Veuillez Confirmez votre transaction avant de poursuivre. Si cette erreur persite veuillez contacter notre service client.", "Paiement En attende");
        //this.hitCodeDiv = true;
      }
      else{
        this.loading = false;
       // this.saveOrders(this.verify);
        this.notice.showWarning("Une erreur s'est produite, veuillez réessayer ultérieurement.", "Paiement En attende");
      }
    }

    oberserableTimer() {
      const source = timer(1000, 2000);
      const abc = source.subscribe(val => {
        console.log(val, '-');
        this.subscribeTimer = this.timeLeft - val;
      });
    }
  
    startTimer() {
      this.interval = setInterval(() => {
        if(this.timeLeft > 0) {
          let mv = this.timeLeft--;
          this.sec = "Veuillez patienter pendant "+mv+" secondes."
        } else {
          //this.timeLeft = 60;
          clearInterval(this.interval);
          this.timeLeft = 0;
          this.sec = "";
        }
      },1000)
    }


    onPay(test){

    }

    update_cmd(){
      var payInfos = JSON.parse(localStorage.getItem('is_pay_infos'));
      console.log("Ici et ici pour le paiement", payInfos);
      if(payInfos!=null){
        this.serviceApi.getDatas("validate_order", payInfos).subscribe( async (da:any)=>{
          console.log(da);
          if(da.success==true){
            if(da.data.status =="ACCEPTED"){
              localStorage.removeItem('the_print_cart');
              localStorage.removeItem('is_user_format');
              localStorage.removeItem('is_user_delivery');
              localStorage.removeItem('temp_image');
              localStorage.removeItem('is_pay_infos');
              //location.reload();
              let params = {
                reload : 1,
              }
              this.notice.showSuccess("Votre commande a été enregistrée, nous vous contacterons dans les plus brefs délais.", "Votre commade");
              //this.router.navigate(['/mon-compte']);
              //this.functions.goToProduct("/success", params);
              this.bulkDelete();
            }
            else{
              //location.reload();
              //let texte = '<button  (click)="buyNow()" style="width: 100%;" class="btn btn-primary btn-lg btn-block" type="btn">Rafraichir la page</button>';
              //this.notice.showWarning("Nous n'avons pas pu confirmer votre paiement. Pour réessayez, veuillez rechargez la page. <br>"+texte+"", "Votre paiement")
              if(this.showed==true){
              this.toastr.warning("Nous n'avons pas pu confirmer votre paiement. Pour réessayez, veuillez cliquez sur ce message pour recharger la page.", "Votre paiement")
              .onTap
              .pipe(take(1))
              .subscribe(() => this.toasterClickedHandler());
              this.showed = false;
            }
            }
          }
          else{
              if(this.showed==true){
                this.toastr.warning("Nous n'avons pas pu confirmer votre paiement. Pour réessayer, veuillez cliquez sur ce message pour recharger la page.", "Votre paiement")
                .onTap
                .pipe(take(1))
                .subscribe(() => this.toasterClickedHandler());
                this.showed = false;
              }
          }
        })
      }
    }


    toasterClickedHandler() {
      //this.router.navigate(['/paiement']);
      location.reload();
    }

    bulkDelete(){
      this.product.forEach(element => {
        this.panierService.delete(element.id).then(() => {
        })
        .catch(err => console.log(err)); 
      }); 
      this.router.navigate(['/success']);
    }

}