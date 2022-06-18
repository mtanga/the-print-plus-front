import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import {CroppedEvent} from 'ngx-photo-editor';
import { ApiService } from '../services/api.service';
import { FunctionsService } from '../services/functions.service';
import { NoticeService } from '../services/notice.service';

import { filter, pairwise } from 'rxjs/operators';



@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  imageChangedEvent: any;
  base64: any;
  uploaded : boolean = false
  sub: any;
  product : any;
  infos: any = [];
  images : any = []
  nombre_fois : any = 0;
  previous_url : any;

  constructor( 
    private route : ActivatedRoute,
    private functions : FunctionsService,
    private _sanitizer: DomSanitizer,
    private serviceApi : ApiService,
    private notice : NoticeService,
    private router: Router,
    ) { 
      this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        this.previous_url = events[0].urlAfterRedirects;
        console.log('previous url', this.previous_url);
        console.log('current url', events[1].urlAfterRedirects);
      });
    }

  ngOnInit(): void {
    this.sub = this.route
    .queryParams
    .subscribe( params  => {
      this.product = parseInt(params['id']);
      this.getProduct(this.product);
    });
  }


  getProduct(product: any) {
       let data = {
      id : product
    }
    this.serviceApi.getDatas("getproduit", data).subscribe( async (da:any)=>{
      console.log(da.data);
      console.log(da.data[0].photos);
      this.infos = da.data[0];
    })
  }



  
  fileChangeEvent(event: any) {
    this.imageChangedEvent = event;
    this.uploaded = true;

  }

  imageCropped(event: CroppedEvent) {
    this.base64 = event.base64;
    this.images.push(this.base64);
    this.nombre_fois = this.nombre_fois + 1;
    console.log(this.images);
    console.log(this.nombre_fois)
  }

  productGo(){
    let params = {
      id : this.product,
    }
    localStorage.setItem("imgData", this.base64);
    localStorage.setItem('temp_image', JSON.stringify(this.images));
    this.functions.goToProduct("/produit", params);
  }


  delete(img){
    console.log(img);
    this.images.splice(img, 1);
    this.nombre_fois = this.nombre_fois - 1;
  }
}
