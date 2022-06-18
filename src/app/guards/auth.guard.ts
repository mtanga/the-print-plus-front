import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NoticeService } from '../services/notice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private router: Router,
    private notice : NoticeService
    ){
  }
  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot): boolean {
    let user = localStorage.getItem('is_user_infos');
    if(user){
      return true;
    }
    else{
      this.notice.showError("Vous devez vous connecter pour poursuivre", "Mon compte");
      //localStorage.setItem('current_url', this.router.url);
      this.router.navigate(['/connexion']);
      return false;
    }
}
}
