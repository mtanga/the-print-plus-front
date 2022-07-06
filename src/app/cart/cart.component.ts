import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { FunctionsService } from '../services/functions.service';
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

  constructor(
    private router: Router,
    private functions : FunctionsService
  ) { 

  }

  ngOnInit(): void {
    this.getPanier();
  }

  getPanier(){
    var test = localStorage.getItem('the_print_cart');
    this.product = JSON.parse(test);
    console.log("Les produits", this.product);
  }

  pay(){
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
    var test = localStorage.getItem('the_print_cart');
    let arr = JSON.parse(test);
    console.log(item)
    for (let i=0;i<arr.length;i++){
      if(arr[i].id==item.id){
        console.log("troue");
        arr[i].qte = arr[i].qte+1;
        console.log('nouveau', arr);
        let json = JSON.stringify(arr);
        localStorage.setItem('the_print_cart', json); 
        //this.total=this.getotal(arr);
        this.getPanier();

      }
    } 
  }
  remove(item){
    var test = localStorage.getItem('the_print_cart');
    let arr = JSON.parse(test);
    console.log(item)
    for (let i=0;i<arr.length;i++){
      if(arr[i].id==item.id){
        console.log("troue");
        if(arr[i].qte>1){
          arr[i].qte = arr[i].qte-1;
          console.log('nouveau', arr);
          let json = JSON.stringify(arr);
          localStorage.setItem('the_print_cart', json); 
          //this.total=this.getotal(arr);
          this.getPanier();
        }
      }
    } 
  }

  delete(items){
    if(confirm("Êtes vous sûr de vouloir supprimer cette image ?")) {
      var test = localStorage.getItem('the_print_cart');
      let arr = JSON.parse(test);
      for (let i=0;i<arr.length;i++){
        if(arr[i].id==items.id){
          //console.log('le bon:', arr[i]);
          //console.log('le bon index:', i);
          arr.splice(i, 1);
          let json = JSON.stringify(arr);
          localStorage.setItem('the_print_cart', json); 
          this.getPanier();
        }
    }
    }

}

totalAmount() {
  this.totalt = 0;
  var test = localStorage.getItem('the_print_cart');
  let arr = JSON.parse(test);
  console.log('mon tableau', arr)
  for (let i=0;i<arr.length;i++){
    let totalP = 0;
    totalP = arr[i].qte * arr[i].price;
    this.totalt = this.totalt+(arr[i].qte * arr[i].price);
    console.log('mon i:',i, totalP);
    console.log('mon total',this.totalt);
  } 
  return this.totalt;
}

}
