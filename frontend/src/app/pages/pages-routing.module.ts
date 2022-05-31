import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { UserComponent } from './user/user.component';

import { ProgramsComponent } from './programs/programs.component';
import { ServersComponent } from './servers/servers.component';
import { NucleiComponent } from './nuclei/nuclei.component';
import { ScansComponent } from './scans/scans.component';
import { VulnerabilitiesComponent } from './vulnerabilities/vulnerabilities.component';
import {LeaksComponent } from './leaks/leaks.component';
import {DomainsComponent } from './domains/domains.component';
import {SubdomainsComponent } from './subdomains/subdomains.component';
import {EnginesComponent } from './engines/engines.component';
import {UrlsComponent } from './urls/urls.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [

    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'user',
      component: UserComponent,
    },
    {
      path: 'programs',
      component: ProgramsComponent,
    },
    {
      path: 'engines',
      component: EnginesComponent,
    },
    {
      path: 'domains',
      component: DomainsComponent,
    },
    {
      path: 'subdomains/:domain',
      component: SubdomainsComponent,
    },
    {
      path: 'urls/:idSub',
      component: UrlsComponent,
    },
    {
      path: 'servers',
      component: ServersComponent,
    },
    {
      path: 'nuclei',
      component: NucleiComponent,
    },
    {
      path: 'leaks',
      component: LeaksComponent,
    },
    {
      path: 'scans',
      component: ScansComponent,
    },
    {
      path: 'vulnerabilities',
      component: VulnerabilitiesComponent,
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      redirectTo: 'dashboard',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
