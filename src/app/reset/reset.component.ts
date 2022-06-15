import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  phone_number : any;
  loginEmail : boolean = true;

  
  constructor() { }

  ngOnInit(): void {
  }

}
