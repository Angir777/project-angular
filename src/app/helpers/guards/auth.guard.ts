import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LoggedUserService } from '../../services/logged-user/logged-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loggedUserService: LoggedUserService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.loggedUserService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url },
        replaceUrl: true,
      });
      return false;
    }
  }
}
