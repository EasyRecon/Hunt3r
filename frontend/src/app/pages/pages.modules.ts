import { NgModule, TemplateRef} from '@angular/core';
import {NbContextMenuModule , NbSelectModule,NbButtonModule,NbActionsModule,NbLayoutModule,NbAccordionModule, NbThemeModule, NbUserModule,NbToastrModule,NbSidebarModule, NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule,NbListModule,NbMenuModule,} from '@nebular/theme';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
//import { MiscellaneousModule } from '../miscellaneous/miscellaneous.module';


import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';


import { UserService } from '../core/user/user.service';
import {NbFormFieldModule,NbBadgeModule,NbSpinnerModule,NbTabsetModule,NbDialogService,NbDialogModule,NbButtonGroupModule,NbCheckboxModule} from '@nebular/theme'
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../UI/ui.module';
import { ProgramsComponent } from './programs/programs.component';
import { CommonModule } from '@angular/common'
import { ServersComponent } from './servers/servers.component';
import { NucleiComponent } from './nuclei/nuclei.component';
import { ScansComponent } from './scans/scans.component';
import { VulnerabilitiesComponent } from './vulnerabilities/vulnerabilities.component';
import {LeaksComponent } from './leaks/leaks.component';
import {DomainsComponent } from './domains/domains.component';
import {SubdomainsComponent } from './subdomains/subdomains.component';
import { LazyLoadModule   } from '../shared/lazyLoad/lazyLoadModule';
import { UseHttpImageSourcePipeModule } from '@this-dot/ng-utils';
import {EnginesComponent } from './engines/engines.component';


@NgModule({
  imports: [
    ThemeModule,
    NbMenuModule.forRoot(),
    PagesRoutingModule,
    NbLayoutModule,
    NbThemeModule,
    NbUserModule,
    NbToastrModule,
    NbSidebarModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbButtonModule,
    NbSelectModule,
    NbActionsModule,
    NbTreeGridModule,
    NbListModule,
    NbContextMenuModule,
    NbAccordionModule,
    NbFormFieldModule,
    NbSpinnerModule,
    ReactiveFormsModule,
    NbTabsetModule,
    NbDialogModule.forRoot({}),
    CommonModule,
    NbButtonGroupModule,
    NbCardModule,
    NbBadgeModule,
    NbCheckboxModule,
    LazyLoadModule,
    UseHttpImageSourcePipeModule
    
    //MiscellaneousModule
  ],
  declarations: [
    
    PagesComponent,
    DashboardComponent,
    UserComponent,
    ProgramsComponent,
    ServersComponent,
    NucleiComponent,
    ScansComponent,
    VulnerabilitiesComponent,
    LeaksComponent,
    DomainsComponent,
    SubdomainsComponent,
    EnginesComponent,
    

  ],
  providers:[
    UserService,
    NbDialogService,
     
 
  ]
})
export class PagesModule {
}
