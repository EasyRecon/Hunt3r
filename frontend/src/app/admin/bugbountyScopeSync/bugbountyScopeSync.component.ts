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
  yeswehackExist=false;
  yeswehack = {
    "email":"",
    "password":"",
    "otp":""
  }
  
  intigritiForm: FormGroup = <FormGroup> {};
  intigritiExist=false;
  intigriti = {
    "email":"",
    "password":"",
    "otp":""
  }
  loading=true

  hackeroneForm: FormGroup = <FormGroup> {};
  hackeroneExist=false;
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
    this.yeswehackExist = false;
    this.intigritiExist = false;
    this.hackeroneExist = false
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
      this.yeswehackExist = false;
      this.intigritiExist = false;
      this.hackeroneExist = false
      result.data.forEach( (element) => {
        this.updateObjectVar(element)
      });     
      this.loading = false;
    },(err) =>{
      this.loading = false;
      this.messageService.showToast(err.message,'danger')
    })
  }
  updateObjectVar(element:any) {
    if(element.name == 'yeswehack'){
      this.yeswehack.email = element.email
      this.yeswehackExist=true
    } 
    if(element.name == 'intigriti'){
      this.intigriti.email = element.email
      this.intigritiExist = true
    } 
    if(element.name == 'hackerone'){
      this.hackerone.email = element.email
      this.hackeroneExist = true
    } 
  }

  platformData(event:any,platform:string){
    this.loading=true
    event.preventDefault()
    let exist = false
    let data:any
    if(platform=='yeswehack'){
      exist = this.yeswehackExist
      data = this.intigritiForm.value
      data.name='yeswehack'
    }
    if(platform=='intigriti'){
      exist = this.intigritiExist
      data = this.intigritiForm.value
      data.name='intigriti'
    }
    if(platform=='hackerone'){
      exist = this.hackeroneExist
      data = this.hackeroneForm.value
      data.name='hackerone'
    }
    if(data.otp == "" ) delete data.otp
    if(exist){
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
