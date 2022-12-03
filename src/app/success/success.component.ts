import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { exit } from 'process';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  sub: any;
  status: any;
  constructor(
    private route : ActivatedRoute,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.sub = this.route
    .queryParams
    .subscribe( params  => {
      this.status = parseInt(params['status']);
    }); 
  }

}
