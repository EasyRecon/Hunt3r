import {Injectable} from '@angular/core';
import {CanActivate, Router} from "@angular/router";
import {NbAuthService,NbAuthToken} from "@nebular/auth";
import { NbToastrService, NbComponentStatus } from '@nebular/theme';
import {tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate {


  user = {user_id:0,user_email:'',exp:0};


  constructor(private authService: NbAuthService,
              private router: Router,
              private toastrService: NbToastrService) {
                //this.authService.isAuthenticated().subscribe( (x) => {console.log(x)})
                this.authService.onTokenChange() 
                .subscribe( (token: NbAuthToken) => {
                if (token.isValid()) {
                  this.user = token.getPayload(); // receive payload from token and assign it to our `user` variable
                    console.log('check token')
                    if(Math.floor(Date.now() / 1000) > this.user.exp){
                      localStorage.clear();
                      this.router.navigateByUrl('/auth/login');
                    }
                } else {
                  localStorage.clear();
                  this.router.navigateByUrl('/auth/login');
                }
              });
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
