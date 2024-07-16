import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { LoggedUserService } from '../../services/logged-user/logged-user.service';

/**
 * Guard sprawdzający dostep do chronionych tras
 */
@Injectable({
  providedIn: 'root',
})
class AuthGuardHelper {
  constructor(
    private loggedUserService: LoggedUserService,
    private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
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

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(AuthGuardHelper).canActivate(next, state);
};
