import {Injectable} from '@angular/core';
import {CanActivate, Router} from "@angular/router";
import {NbAuthService} from "@nebular/auth";
import { NbToastrService, NbComponentStatus } from '@nebular/theme';
import {tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: NbAuthService,
              private router: Router,
              private toastrService: NbToastrService) {
                //this.authService.isAuthenticated().subscribe( (x) => {console.log(x)})
  }

  canActivate() {

   
    return this.authService.isAuthenticated()
      .pipe(
        tap(authenticated => {
          if (!authenticated) {
            this.router.navigate(['auth/login']).then(r => this.showFailedToast(`You are not logged in!`));
          }
        })
      );

  }
  showFailedToast(message: string, status: NbComponentStatus = 'danger') {
    this.toastrService.show(message, 'Error', { status });
  }
}
