import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { NoticeService } from '../services/notice.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {
  myData: any[];
  totalt: number;
  product: any = [];
  format: any;
  infos: any;
  user: any;
  edit: boolean = true;
  edit_add : boolean = false;
  private _prevSelected: any;
  new_product: any = [];
  paid : boolean = false;



  constructor(
    private http: HttpClient,
    private serviceApi : ApiService,
    private notice : NoticeService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.saveOrders();
  }


  getOrders(){
    this.product= this.getPanier();;
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


  getPanier(){
    var test = localStorage.getItem('the_print_cart');
    //this.product = JSON.parse(test);
    //console.log(this.product);
    return JSON.parse(test);
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

  getuser(){
    //this.user = JSON.parse(localStorage.getItem('is_user_infos'));
    return  JSON.parse(localStorage.getItem('is_user_infos'));
    //this.getAdresse(this.user.id);
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
          user_id : this. getuser().id,
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

}
