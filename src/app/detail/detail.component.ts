import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FunctionsService } from '../services/functions.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

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
      let id = params['id'];
      console.log("ici non", id);
      if(id){
        this.loading = true;
        this.getImages(id);
      }
      else{
         this.router.navigate(['/home']);
      }
      
    });
  }

getImages(id){
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
  }

}
