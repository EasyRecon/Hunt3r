import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthRoutingModule} from './auth-routing.module';
import {NbAuthModule} from "@nebular/auth";
import {LoginComponent} from './login/login.component';

import {NbAlertModule, NbButtonModule, NbCheckboxModule, NbIconModule, NbInputModule} from '@nebular/theme';
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";

export interface NbAuthSocialLink {
  link?: string,
  url?: string,
  target?: string,
  title?: string,
  icon?: string,
}

const socialLinks: NbAuthSocialLink[] = [];
export const defaultSettings: any = {
  
  forms: {
    login: {
      redirectDelay: 0, // delay before redirect after a successful login, while success message is shown to the user
      strategy: 'email',  // strategy id key.
      rememberMe: true,   // whether to show or not the `rememberMe` checkbox
      showMessages: {     // show/not show success/error messages
        success: true,
        error: true
      },
    },
  }
};

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AuthRoutingModule,
    NbAlertModule,
    NbButtonModule,
    NbCheckboxModule,
    NbInputModule,
    NbIconModule,
    
  ]
})
export class AuthModule {

}
