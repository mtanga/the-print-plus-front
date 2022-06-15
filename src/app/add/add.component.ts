import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {CroppedEvent} from 'ngx-photo-editor';
import { FunctionsService } from '../services/functions.service';
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

  constructor( 
    private route : ActivatedRoute,
    private functions : FunctionsService
    ) { }

  ngOnInit(): void {
    this.sub = this.route
    .queryParams
    .subscribe( params  => {
      this.product = parseInt(params['id']);
    });
  }



  
  fileChangeEvent(event: any) {
    this.imageChangedEvent = event;
    this.uploaded = true;

  }

  imageCropped(event: CroppedEvent) {
    this.base64 = event.base64;
  }

  productGo(){
    let params = {
      id : this.product,
    }
    localStorage.setItem("imgData", this.base64);
    localStorage.setItem('temp_image', JSON.stringify(this.base64));
    this.functions.goToProduct("/produit", params);
  }

}
