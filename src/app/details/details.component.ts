import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FunctionsService } from '../services/functions.service';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  items : any;
  imagesItem : any;
  productsCollection : AngularFirestoreCollection<any[]> | undefined;
  imagesCollection : AngularFirestoreCollection<any[]> | undefined;
  products : Observable<any> | undefined;
  images : Observable<any> | undefined;
  categories : any = [];
  sub: any;
  searchValue : any;
public loading = false;

  constructor(
    private db: AngularFirestore,
    private route : ActivatedRoute,
    private functions : FunctionsService,
    private router: Router,
  ) 
  { }


  ngOnInit(): void {
    this.sub = this.route
    .queryParams
    .subscribe( params  => {
      let id = parseInt(params['id']);
      
      if(id){
        this.loading = true;
        this.getItems(id);
      }
      else{
        
        this.router.navigate(['/home']);
      }
      
    });
  }

  downloadPdf(base64String, fileName) {
    const source = base64String;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${fileName}.jpg`
    link.click();
  }

  onClickDownloadPdf(url){
   // console.log(url)
        var a = document.createElement("a"); //Create <a>
        a.href = url; //Image Base64 Goes here
        a.download = "Image.png"; //File name Here
        a.click(); //Downloaded file
  }


  getItems(id){
    this.items = [];
    this.productsCollection = this.db.collection('items_orders', ref => ref.where('cmd', '==', id));
    this.products = this.productsCollection.snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      });
      })
    );
    this.products.subscribe(da=>{
      this.items = da;
      console.log(this.items);
      this.loading = false;
    })
  }

gotToItem(id){
  let params = {
    id : id,
  }
  this.functions.goToProduct("/detail", params);
}
/*   getImages(id){
    this.imagesItem = [];
    this.imagesCollection = this.db.collection('clients_photos', ref => ref.where('idCMD', '==', id));
    this.images = this.imagesCollection.snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      });
      })
    );
    this.images.subscribe(da=>{
      this.imagesItem = da;
      console.log(this.imagesItem);
    })
    this.loading = false;
    return this.imagesItem;
  } */

}
