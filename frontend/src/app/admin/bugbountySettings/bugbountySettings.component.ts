import {Component, OnInit } from '@angular/core';

import { FormGroup,FormBuilder  } from '@angular/forms';
import { BugbountyPlatformService } from '../../core/bugbountyPlatform/bugbountyPlatform.service'
import { MessageService  } from '../../shared/message.service';


@Component({
  selector: 'ngx-dashboard',
  templateUrl: './bugbountySettings.component.html',
  styleUrls: ['./bugbountySettings.component.scss']
})
export class BugbountySettingsComponent implements OnInit {


  yeswehackForm: FormGroup = <FormGroup> {};
  yeswehack = {
    "email":"",
    "password":"",
    "otp":""
  }
  
  intigritiForm: FormGroup = <FormGroup> {};
  intigriti = {
    "email":"",
    "hunter_username":"",
    "password":"",
    "otp":""
  }

  hackeroneForm: FormGroup = <FormGroup> {};
  hackerone = {
    "email":"",
    "password":"",
    "otp":""
  }



  loading=true

  constructor(private fbuilder: FormBuilder,
              private messageService: MessageService,
              private bugbountyPlatform : BugbountyPlatformService) {

      this.yeswehackForm = this.fbuilder.group({
          email:'',
          password:'',
          otp:''
      });
      this.intigritiForm = this.fbuilder.group({
        email:'',
        password:'',
        otp:''
    });
    this.hackeroneForm = this.fbuilder.group({
        email:'',
        password:'',
    });
  }

  ngOnInit(): void {
    this.getPlatform()
  }

  getPlatform(){
    this.intigriti = {
      "email":"",
      "hunter_username":"",
      "password":"",
      "otp":""
    }
    this.yeswehack = {
      "email":"",
      "password":"",
      "otp":""
    }
    this.hackerone = {
      "email":"",
      "password":"",
      "otp":""
    }
    this.bugbountyPlatform.getPlatform().subscribe( (result) => {
      
      result.data.forEach( (element:any) => {
        let name:'yeswehack'|'hackerone'|'intigriti'=element.name
        this[name].email=element.email
      });     
      this.loading = false;
    },(err) =>{
      this.loading = false;
      this.messageService.showToast(err.message,'danger')
    })
  }

  updateOrCreate(event:any,platform:'yeswehack'|'hackerone'|'intigriti'){
    this.loading=true
    event.preventDefault()
    let formName:'yeswehackForm'|'hackeroneForm'|'intigritiForm'=`${platform}Form`
    let data = this[formName].value
    if(data.otp == "" ) delete data.otp
    data.name=platform
    let finalData = {"platform": data}
    if(this[platform].email!='' ){
      this.updatePlatform(finalData)
    } else {
      this.createPlatform(finalData)
    }
  }

  updatePlatform(data:any){
    this.bugbountyPlatform.updatePlatform(data).subscribe( (result) =>{
      this.loading=false
      this.messageService.showToast(result.message,'success')
      this.getPlatform()
    },(err) =>{
      this.loading = false;
      this.messageService.showToast(err.message,'danger')
    })
  }
  createPlatform(data:any){
    this.bugbountyPlatform.createPlatform(data).subscribe( (result) =>{
      this.loading=false
      this.messageService.showToast(result.message,'success')
      this.getPlatform()
    },(err) =>{
      this.loading = false;
      this.messageService.showToast(err.message,'danger')
    })
  }
  deletePlatform(platform:string) {
    this.loading = true;
    this.bugbountyPlatform.deletePlatform(platform).subscribe( (result) => {
      this.loading=false
      this.messageService.showToast(result.message,'success')
      this.getPlatform()
    },(err) =>{
      this.loading = false;
      this.messageService.showToast(err.message,'danger')
    })
  }
}
