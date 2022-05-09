import { Component } from '@angular/core';
import{ NbThemeService } from '@nebular/theme';
@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Hunt3r-UI';
  constructor(private themeService: NbThemeService) {
    //this.themeService.changeTheme('corporate');
  }
}
