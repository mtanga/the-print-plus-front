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
    
  }


  

}
