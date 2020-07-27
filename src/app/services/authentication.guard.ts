import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { map } from 'rxjs/operators';
// import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authenticationService.getStatus().pipe(
      map((status) => {
        if (status) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );

    // return this.authenticationService.getStatus().pipe(
    //   map((user) => (user === null ? false : true)),
    //   tap((hasUser) => {
    //     if (!hasUser) {
    //       this.router.navigate(['/login']);
    //     }
    //   })
    // );
  }
}
