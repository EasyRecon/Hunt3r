import { NgModule, TemplateRef} from '@angular/core';
import {NbContextMenuModule,
         NbSelectModule,
         NbButtonModule,
         NbActionsModule,
         NbLayoutModule,
         NbAccordionModule,
         NbThemeModule,
         NbUserModule,NbToastrModule,
         NbSidebarModule,
         NbCardModule,
         NbIconModule,
         NbInputModule,
         NbTreeGridModule,
         NbListModule,
         NbMenuModule,
         NbFormFieldModule,
         NbSpinnerModule,
         NbTabsetModule,
         NbDialogService,
         NbDialogModule,
         NbButtonGroupModule,
         NbDatepickerModule,
         NbCheckboxModule} from '@nebular/theme';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';


import {MeshsSyncComponent} from './meshsSync/meshsSync.component'

import { UsersComponent } from './users/users.component';
import { CloudSettingsComponent } from './cloudSettings/cloudSettings.component';
import { BugbountySettingsComponent } from './bugbountySettings/bugbountySettings.component';
import { BugbountyScopeSyncComponent } from './bugbountyScopeSync/bugbountyScopeSync.component';
import { BugbountyStatComponent } from './bugbountyStat/bugbountyStat.component';
import { InvoicesComponent } from './invoices/invoices.component';

import { UserService } from '../core/user/user.service';

import { ReactiveFormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../UI/ui.module';
import { CommonModule } from '@angular/common'
import  {ToolsComponent } from './tools/tools.component'
import  {MeshsComponent } from './meshs/meshs.component'


import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent
} from 'echarts/components';




import {
  CanvasRenderer
} from 'echarts/renderers';


echarts.use(
  [TitleComponent, TooltipComponent, GridComponent, LineChart, CanvasRenderer]
);


@NgModule({
  imports: [
    ThemeModule,
    NbMenuModule.forRoot(),
    AdminRoutingModule,
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
    NgxEchartsModule.forRoot({ echarts }),
    NbDatepickerModule,
    NbCheckboxModule,
    
    
    
    
    //MiscellaneousModule
  ],
  declarations: [
   AdminComponent,
    UsersComponent,
    CloudSettingsComponent,

    BugbountySettingsComponent,
    BugbountyScopeSyncComponent,
    BugbountyStatComponent,
    InvoicesComponent,
    ToolsComponent,
    MeshsComponent,
    MeshsSyncComponent
    
  ],
  providers:[
    UserService,
    NbDialogService
 
  ]
})
export class AdminModule {
}
