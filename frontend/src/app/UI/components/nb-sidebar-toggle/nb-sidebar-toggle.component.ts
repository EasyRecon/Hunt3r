import { NbSidebarService,NbMenuService,NB_WINDOW,NbThemeService,NbMediaBreakpointsService } from '@nebular/theme';
import { Component, OnInit,Inject, } from '@angular/core';
import { map,filter,takeUntil } from 'rxjs/operators';
import {NbAuthService,NbAuthJWTToken,NbAuthToken} from '@nebular/auth'
import {UserService} from '../../../core/user/user.service'
import {NotifService} from '../../../core/notif/notif.service'
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'nb-sidebar-toggle',
  templateUrl: './nb-sidebar-toggle.component.html',
  styleUrls: ['./nb-sidebar-toggle.component.scss'],
  styles: [`
    :host nb-layout-header button:last-child {
      margin-left: auto;
      
    }
  `],
})

export class NbSidebarToggleComponent implements OnInit {

  userPictureOnly: boolean = false;
  user = {user_id:0,user_email:'',exp:0};

  userMenu = [ { title: 'Profile'}, { title: 'Logout' } ];

  notif:Array<any>=[{"name":""}];
  private destroy$: Subject<void> = new Subject<void>();
  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
  ];

  currentTheme:any = 'default';
  backgroundColor ='black'

  constructor(private sidebarService: NbSidebarService,
              private nbMenuService: NbMenuService,
              private router : Router,
              private authService : NbAuthService,
               @Inject(NB_WINDOW) private window:any,
               private Jwt : NbAuthJWTToken ,
               private userService: UserService,
               private notifService: NotifService,
               private themeService: NbThemeService,
               private breakpointService: NbMediaBreakpointsService
             ) {

         
    this.authService.onTokenChange() 
        .subscribe( (token: NbAuthToken) => {
        if (token.isValid()) {
          this.user = token.getPayload(); // receive payload from token and assign it to our `user` variable
            console.log('check token')
            if(Math.floor(Date.now() / 1000) > this.user.exp){
              localStorage.clear();
              this.router.navigateByUrl('/auth/login');
            }
        } else {
          localStorage.clear();
          this.router.navigateByUrl('/auth/login');
        }
      });
  }

 async getNotification(){
    this.notifService.getNotif().subscribe( (result)=> {

      if(result.data.length>0)this.notif=[{ "title": 'Delete all notifications',"icon":"trash-outline"}]
      result.data.forEach((element)=> {
        let icon=''
        if(element.message_type=='success') icon='checkmark-circle-outline'
        if(element.message_type=='warning') icon='alert-circle-outline'
        if(element.message_type=='danger') icon='close-circle-outline'
        this.notif.push({"title":element.message,"icon":icon})
      })
    })
  }


  changeTheme(themeName: string) {
    localStorage.setItem('theme', themeName)
    this.themeService.changeTheme(themeName);
  }

toggleTheme(){
  let theme = localStorage.getItem('theme') || 'default'
  if(theme=='default'){
    this.themeService.changeTheme('dark');
    localStorage.setItem('theme', 'dark')
    this.backgroundColor ='white'
  } else {
    this.themeService.changeTheme('default');
    localStorage.setItem('theme', 'default')
    this.backgroundColor ='black'
  }
}

  async ngOnInit() {
    await this.getNotification()
    this.nbMenuService.onItemClick()
    .pipe(
      filter(({ tag }) => tag === 'user-context-menu'),
      map(({ item: { title } }) => title),
    )
    .subscribe(title => {
      if(title=='Logout') {
        this.userService.logoutUser().subscribe( (result) => {

        })
        localStorage.clear();
        this.router.navigateByUrl('/auth/login');
      }
      if(title=='Profile'){
        this.router.navigateByUrl('/pages/user');
      }
    });

    this.nbMenuService.onItemClick()
    .pipe(
      filter(({ tag }) => tag === 'notif-context-menu'),
      map(({ item: { title } }) => title),
    )
    .subscribe(title => {
      if(title=='Delete all notifications') {
        this.notifService.deleteNotif().subscribe( (result) => {
          this.notif=[{"name":""}]
        })
      }
    });


    this.currentTheme = this.themeService.currentTheme;




    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);


  }



  toggleLeft(event:any) {
    event.preventDefault()
    this.sidebarService.toggle(true, 'left');
    return false
  }
  toggleRight() {
    this.sidebarService.toggle(false, 'right');
  }


}