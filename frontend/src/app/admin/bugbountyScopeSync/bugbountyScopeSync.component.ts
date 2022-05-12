import {Component, OnInit } from '@angular/core';

import { FormGroup,FormBuilder  } from '@angular/forms';
import { BugbountyPlatformService } from '../../core/bugbountyPlatform/bugbountyPlatform.service'
import { MessageService  } from '../../shared/message.service';



@Component({
  selector: 'ngx-dashboard',
  templateUrl: './bugbountyScopeSync.component.html',
  styleUrls: ['./bugbountyScopeSync.component.scss']
})
export class BugbountyScopeSyncComponent implements OnInit {


  yeswehackForm: FormGroup = <FormGroup> {};
  yeswehack = {
    "email":"",
    "password":"",
    "otp":""
  }
  
  intigritiForm: FormGroup = <FormGroup> {};
  intigriti = {
    "email":"",
    "password":"",
    "otp":""
  }
  loading=true

  hackeroneForm: FormGroup = <FormGroup> {};
  hackerone = {
    "email":"",
    "password":"",
    "otp":""
  }


  constructor(private fbuilder: FormBuilder,
    private messageService: MessageService,
    private bugbountyPlatform : BugbountyPlatformService) {

      this.yeswehackForm = this.fbuilder.group({
          email:'',
          hunter_username:'',
          password:'',
          otp:''
      });
      this.intigritiForm = this.fbuilder.group({
        email:'',
        hunter_username:'',
        password:'',
        otp:''
    });
    this.hackeroneForm = this.fbuilder.group({
      email:'',
      hunter_username:'',
      password:'',
      otp:''
  });
  }

  ngOnInit(): void {
    this.getPlatform()
  }
  resetLocalVar(){
    this.intigriti = {
      "email":"",
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
  }

  getPlatform(){
    this.resetLocalVar()
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


  platformData(event:any,platform:'yeswehack'|'hackerone'|'intigriti'){
    this.loading=true
    event.preventDefault()
    let formName:'yeswehackForm'|'hackeroneForm'|'intigritiForm'=`${platform}Form`
    let exist = ''
    let data:any

    exist = this[platform].email
    data = this[formName].value
    data.name=platform

    if(data.otp == "" ) delete data.otp
    if(exist!=''){
      this.updatePlatform(data)
    } else {
      this.createPlatform(data)
    }
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

  deletePlatform(name:string) {
    this.loading = true;
    this.bugbountyPlatform.deletePlatform(name).subscribe( (result) => {
      this.loading=false
      this.messageService.showToast(result.message,'success')
      this.getPlatform()
    },(err) =>{
      this.loading = false;
      this.messageService.showToast(err.message,'danger')
    })
  }
}
