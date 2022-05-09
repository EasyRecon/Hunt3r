import { Component } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';

import {NbLayoutModule} from '@nebular/theme';




@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `

<router-outlet></router-outlet>
  `,
})
export class PagesComponent {

  constructor(private sidebarService: NbSidebarService,private componentNGX: NbLayoutModule) {
  }
  toggle() {
    this.sidebarService.toggle(true);
    return false;
  }



}

