import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NbAuthService, NbAuthToken } from '@nebular/auth';
import { NbRoleProvider } from '@nebular/security';
import { observable, of } from 'rxjs';

@Injectable()
export class RoleProvider implements NbRoleProvider {

  constructor(private authService: NbAuthService) {
  }

  getRole(): Observable<string> {

    let result='';
    this.authService.onTokenChange().subscribe((token: NbAuthToken) => {
      if (token.isValid()) {
        result = token.getPayload()['user_role'];
      } else {
        result = 'guest';
      }
    });
    return of(result);

   
  }
}