import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { finalize, map, take } from 'rxjs/operators';
import {formatDate} from '@angular/common';


//import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
//import { AngularFireStorage } from '@angular/fire/storage';

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class PanierService {

  private dbPath = '/paniers';


  Ref: AngularFirestoreCollection<any>;
  images: any = [];


  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    ) {
    this.Ref = db.collection(this.dbPath);
  }

  
  getAll(): AngularFirestoreCollection<any> {
    //return this.Ref;
    return this.db.collection('offers', ref => ref.orderBy('dateCreated', 'desc').where('visible', '==', true));
  }


  getAllss(id): AngularFirestoreCollection<any> {
    //return this.Ref;
    return this.db.collection('offers', ref => ref.orderBy('dateCreated', 'desc').where('visible', '==', true).where('userCreated', '==', id));
  }

  getPanier(id): AngularFirestoreCollection<any> {
    return this.db.collection('paniers', ref => ref.where('user', '==', id));
  }

  getAlllSub(id): AngularFirestoreCollection<any> {
    //return this.Ref;
    return this.db.collection('offers', ref => ref.orderBy('dateCreated', 'desc').where('subcategory', '==', id).where('visible', '==', true));
  }

  getAlls(): AngularFirestoreCollection<any> {
    //return this.Ref;
    return this.db.collection('offers', ref => ref.orderBy('dateCreated', 'desc'));
    //return this.db.collection('offers', ref => ref.where('visible', '==', false));
  }


  getOne(id) {
    return this.Ref.doc(id).ref.get();
  }

  create(data: any) {     
     // console.log("images ici", this.images)
      //offer.dateCreated = new Date();
     return this.Ref.add({ ...data });
  }

  update(id: string, data: any): Promise<void> {
    return this.Ref.doc(id).update(data);
  }


  increment(id: string, data){
    return this.Ref.doc(id).update(data);
  }

  decrement(id: string, data: any): Promise<void> {
    return this.Ref.doc(id).update(
      firebase.firestore.FieldValue.arrayUnion(data)
    );
  }

  like(id: string, data: any): Promise<void> {
    return this.Ref.doc(id).update(data);
  }
  
  delete(id: string): Promise<void> {
    return this.Ref.doc(id).delete();
  }

  storeImages(images){
    console.log("images ici 1", images)
    let rdN = Math.random().toString(36).substr(2, 9);
    images.photoURL.forEach(image => {
      //console.log(image.webviewPath);
      let pic = image.webviewPath;
      const filePath = `offer_photos/${rdN}`;
      const ref = this.storage.ref(filePath);

      const task = ref.putString(pic, 'data_url');
      task.snapshotChanges().pipe(
        finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          this.images.push(url);
          console.log("Votre image", url);
          });   
        })
      )//.subscribe();

      
    }, (err) => {
      console.log(err);
     })


    }
   

}

