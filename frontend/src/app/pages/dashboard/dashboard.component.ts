import {Component, OnInit} from '@angular/core';
//import {NbAuthService,NbAuthJWTToken} from '@nebular/auth';
import {UserService} from '../../core/user/user.service';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  data= {};
  user = {
    name : String,

  }


  constructor(private userService:UserService,private httpClient: HttpClient) {
  
  }

  ngOnInit(): void {


  }

}
