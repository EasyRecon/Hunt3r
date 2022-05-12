import { Component } from '@angular/core';




@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `

<router-outlet></router-outlet>
  `,
})
export class PagesComponent {

  constructor() {
  }
}

