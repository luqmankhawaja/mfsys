import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthServiceService } from './auth-service.service';
@Injectable({
  providedIn:'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,private authService: AuthServiceService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (!this.authService.getIsAuthenticated()) {
      this.router.navigate(['/sign-in'])
     return false;
    }
    // if (state.url.endsWith('/sign-in')) {
    //   this.router.navigate(['/sign-in']);
    //   return false; // Redirect to /sign-in if URL does not end with /sign-in
    // }
    return true;
  }
}
