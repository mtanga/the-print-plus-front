import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { FunctionsService } from '../services/functions.service';
import { PanierService } from '../services/panier.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  product : any ;
  format: any;
  qtee : number;
  totalt: number;
  public loading = false;

  constructor(
    private router: Router,
    private functions : FunctionsService,
    private panierService : PanierService
  ) { 



  }

  ngOnInit(): void {
    this.loading = true;
    this.getPanier();
  }

  getPanier(){
    if(localStorage.getItem('userUID')){
      this.panierService.getPanier(localStorage.getItem('userUID')).snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ id: c.payload.doc.id, ...c.payload.doc.data() })
          )
        )
      ).subscribe(data => {
        console.log("panier ici ", data);
        this.loading = false;
       if(data.length>0){
          this.product = data;
        } 
      });
    }
    else{
      this.loading = false;
    }
  }

  pay(){
    let data = {
      type : "paiement",
      link : "/paiement",
      key :  "id",
      value : ""
    }
    localStorage.removeItem('current_url');
    localStorage.setItem('current_url', JSON.stringify(data));
    this.router.navigate(['/paiement']);
  }

  edit(item, id){
    let params = {
      id : id
    }
    //let json = JSON.stringify(item);
    localStorage.setItem('cart_item_temp', JSON.stringify(item)); 
    this.functions.goToProduct("/edit", params);
  }

  getFormat(id, item){
    console.log("id" ,id)
    console.log("item" ,item)
    item.formats.forEach(element => {
      if(element.name == id){
     // console.log(element)
      this.format = element;
      }
    });
    return this.format;
  }

  total(number, qte){
    return parseInt(number)*parseInt(qte);
  }

  int(number){
    return parseInt(number);
  }

  str(number){
    return String(number);
  }

  add(item){
    console.log(item);
    item.products.qte = item.products.qte +1;
    console.log(item);
     let data = {
       products : item.products
    }
    this.panierService.update(item.id, data).then(() => {
      this.getPanier();
    })
    .catch(err => console.log(err));  
}

  remove(item){
    console.log(item);
    if(item.products.qte>1){
      item.products.qte = item.products.qte - 1;
      let data = {
        products : item.products
     }
     this.panierService.update(item.id, data).then(() => {
       this.getPanier();
     })
     .catch(err => console.log(err));  
    }
  }

  delete(item){
    if(confirm("Êtes vous sûr de vouloir supprimer cette image ?")) {
      this.panierService.delete(item.id).then(() => {
        this.getPanier();
      })
      .catch(err => console.log(err));  
     }
}

totalAmount() {
  this.totalt = 0;
  //var test = localStorage.getItem('the_print_cart');
  let arr = this.product;
  //console.log('mon tableau', arr)
  if(arr!=null){
    for (let i=0;i<arr.length;i++){
      let totalP = 0;
      totalP = arr[i].products.qte * arr[i].products.price;
      this.totalt = this.totalt+(arr[i].products.qte * arr[i].products.price);
     // console.log('mon i:',i, totalP);
      //console.log('mon total',this.totalt);
    } 
  }
  return this.totalt;
}

}
