import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NbLayoutModule,NbSelectModule, NbContextMenuModule,NbDatepickerModule,NbThemeModule, NbUserModule,NbToastrModule,NbSidebarModule, NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule,NbListModule,NbMenuModule} from '@nebular/theme';
import {NbEvaIconsModule} from '@nebular/eva-icons';
import {HttpClientModule,HTTP_INTERCEPTORS} from "@angular/common/http";

import {NbAuthModule, NbAuthJWTToken, NbPasswordAuthStrategy,NB_AUTH_TOKEN_INTERCEPTOR_FILTER} from "@nebular/auth";
import {baseUrl, dashboard, login} from "../environments/environment";
import {AuthGuardService} from "./shared/auth-guard.service";
import {AuthModule}   from './auth/auth.module'

import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { JWTInterceptor } from './shared/interceptor';


import { RoleProvider } from './acl/role.provider';
import {ErrorService} from './shared/errors.service'
import { UseHttpImageSourcePipeModule } from '@this-dot/ng-utils';

import {NotifService} from './core/notif/notif.service'
import {EnginesService} from './core/engines/engines.service'
import {VulnerabilitiesService} from './core/vulnerabilities/vulnerabilities.service'
import {UserService} from './core/user/user.service'
import {UrlsService} from './core/urls/urls.service'
import {ToolsService} from './core/tools/tools.service'
import {SubdomainsService} from './core/subdomains/subdomains.service'
import {ServerService} from './core/server/server.service'
import {ScopeService} from './core/scope/scope.service'
import {ScanService} from './core/scan/scan.service'
import {ProgramsService} from './core/programs/programs.service'
import {NucleiService} from './core/nuclei/nuclei.service'
import {MeshsService} from './core/meshs/meshs.service'
import {LeaksService} from './core/leaks/leaks.service'
import {InvoicesService} from './core/invoices/invoices.service'
import {DomainsService} from './core/domains/domains.service'
import {CloudProviderService} from './core/cloudProvider/cloudProvider.service'
import {BugbountyPlatformService} from './core/bugbountyPlatform/bugbountyPlatform.service'
import {HttpService} from './shared/http.service'


@NgModule({
  declarations: [
    AppComponent,

    
  ],
  imports: [   
    BrowserModule,
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',
          token: {
            class: NbAuthJWTToken,
            key: 'Authorization'
          },
          baseEndpoint: `${baseUrl}`,
          login: {
            endpoint: `${login}`,
            method: 'post',
     
            redirect: {
              success: `${dashboard}`,
              failure: null // stay on the same page
            }
          }
        })
      ],
      forms: {},
    }),
    RouterModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({name: localStorage.getItem('theme') || 'default'}),
    NbLayoutModule,
    NbCardModule, 
    NbIconModule, 
    NbInputModule, 
    NbTreeGridModule,
    NbListModule,
    NbSelectModule,
    NbEvaIconsModule,
    NbContextMenuModule,
    HttpClientModule,
    NbUserModule,
    NbMenuModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbToastrModule.forRoot({}),
    AuthModule,
    NbDatepickerModule.forRoot(),
    NbSecurityModule.forRoot({
      // ...
     }),

     UseHttpImageSourcePipeModule.forRoot({
      loadingImagePath: '/assets/images/your-custom-loading-image.png',
      errorImagePath: 'assets/images/your-custom-error-image.png',
    }),
  ],

  providers: [ 
    ErrorService,
    AuthGuardService,
    NbAuthJWTToken,
    RoleProvider,
    NotifService,
    HttpService,
//own service
    EnginesService,
    VulnerabilitiesService,
    UserService,
    UrlsService,
    ToolsService,
    SubdomainsService,
    ServerService,
    ScopeService,
    ScanService,
    ProgramsService,
    NucleiService,
    MeshsService,
    InvoicesService,
    DomainsService,
    CloudProviderService,
    BugbountyPlatformService,
    LeaksService,
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor,  multi: true},
    { provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: function () { return false; }, },
    { provide: NbRoleProvider, useClass: RoleProvider },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
