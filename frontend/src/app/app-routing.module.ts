import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from "./shared/auth-guard.service";



export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module')
      .then(m => m.AuthModule)
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.modules')
      .then(m => m.PagesModule),
      canActivate: [AuthGuardService]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.modules')
      .then(m => m.AdminModule),
      canActivate: [AuthGuardService]
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
