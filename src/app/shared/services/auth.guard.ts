﻿import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';


@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router,
              private authenticationService: AuthService) {
  }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      const role = route.data.role;
      if (role && !(role == currentUser.role)) {
        this.router.navigate(['/home']);
        return false;
      }
      return true;
    }
    
    this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
    return false;
  }
}
