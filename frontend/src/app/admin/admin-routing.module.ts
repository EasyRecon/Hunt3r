import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AdminComponent } from './admin.component';



import { UsersComponent } from './users/users.component';

import { CloudSettingsComponent } from './cloudSettings/cloudSettings.component';
import { BugbountySettingsComponent } from './bugbountySettings/bugbountySettings.component';
import { BugbountyScopeSyncComponent } from './bugbountyScopeSync/bugbountyScopeSync.component';
import { BugbountyStatComponent } from './bugbountyStat/bugbountyStat.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { ToolsComponent } from './tools/tools.component';
import { MeshsComponent } from './meshs/meshs.component';
import { MeshsSyncComponent } from './meshsSync/meshsSync.component';

const routes: Routes = [{
  path: '',
  component: AdminComponent,
  children: [
    {
      path: 'users',
      component: UsersComponent,
    },
    {
      path: 'cloud/settings',
      component: CloudSettingsComponent,
    },
    {
      path: 'platform/settings',
      component: BugbountySettingsComponent,
    },
    {
      path: 'platform/intigriti/invoices',
      component: InvoicesComponent,
    },
    {
      path: 'platform/scope/sync',
      component: BugbountyScopeSyncComponent,
    },
    {
      path: 'platform/stat',
      component: BugbountyStatComponent,
    },
    {
      path: 'tools/settings',
      component: ToolsComponent,
    },
    {
      path: 'meshs',
      component: MeshsComponent,
    },
    {
      path: 'meshs/sync/:id',
      component: MeshsSyncComponent,
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
export class AdminRoutingModule {
}
