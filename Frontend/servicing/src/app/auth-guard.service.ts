import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService  {

  constructor() { }
}

// import { Injectable } from '@angular/core';
// import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, CanActivateChild } from '@angular/router';
// import { Observable } from 'rxjs';
// import { AuthServiceService } from './auth-service.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuardService implements CanActivate, CanActivateChild{

//   constructor(private authService: AuthServiceService, private router: Router) {}

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
//   boolean  | Promise {
//     if (!this.authService.LoginStatus) {
//       this.router.navigate(['login']);
//     }
//     return this.authService.LoginStatus;
//   }

//   canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
//   boolean | Observable<boolean> | Promise<boolean> {
//     return this.canActivate(route, state);
//   }
// }
