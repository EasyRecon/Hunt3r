import {Component, OnInit,TemplateRef } from '@angular/core';

import { FormGroup,FormBuilder  } from '@angular/forms';
import { BugbountyPlatformService } from '../../core/bugbountyPlatform/bugbountyPlatform.service'
import {
  NbToastrService,
  NbComponentStatus

} from '@nebular/theme';


@Component({
  selector: 'ngx-dashboard',
  templateUrl: './bugbountySettings.component.html',
  styleUrls: ['./bugbountySettings.component.scss']
})
export class BugbountySettingsComponent implements OnInit {


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
    "hunter_username":"",
    "password":"",
    "otp":""
  }

  hackeroneForm: FormGroup = <FormGroup> {};
  hackeroneExist=false;
  hackerone = {
    "email":"",
    "password":"",
    "otp":""
  }



  loading=true

  constructor(private fbuilder: FormBuilder,
    private toastrService: NbToastrService,
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
    this.yeswehackExist = false;
    this.intigritiExist = false;
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
      
      this.yeswehackExist = false;
      this.intigritiExist = false;
      this.hackeroneExist = false
      result.data.forEach( (element) => {
        console.log(this.yeswehackExist)
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

      });     
      this.loading = false;
    },(err) =>{
      this.loading = false;
      this.showToast(err.message,'danger')
    })
  }

  updateYeswehack(event:any) {
    this.loading=true
    event.preventDefault()
    let data = this.yeswehackForm.value
    let finalData = {"platform": data}
    data.name='yeswehack'
    if(this.yeswehackExist)
    {
      this.updatePlatform(data)
    } else {
      this.createPlatform(data)
    }
  }

  updateIntigriti(event:any) {
    this.loading=true
    event.preventDefault()
    let data = this.intigritiForm.value
    if(data.otp=='') delete data.otp
    let finalData = {"platform": data}
    data.name='intigriti'
    if(this.intigritiExist)
    {
      this.updatePlatform(data)
    } else {
      this.createPlatform(data)
    }
  }

  updateHackerone(event:any) {
    this.loading=true
    event.preventDefault()
    let data = this.hackeroneForm.value
    if(data.otp == "" ) delete data.otp
    data.name='hackerone'
    if(this.yeswehackExist)
    {
      this.updatePlatform(data)
    } else {
      this.createPlatform(data)
    }
  }

  updatePlatform(data:any){
    this.bugbountyPlatform.updatePlatform(data).subscribe( (result) =>{
      this.loading=false
      this.showToast(result.message,'success')
      this.getPlatform()
    },(err) =>{
      this.loading = false;
      this.showToast(err.message,'danger')
    })
  }
  createPlatform(data:any){
    this.bugbountyPlatform.createPlatform(data).subscribe( (result) =>{
      this.loading=false
      this.showToast(result.message,'success')
      this.getPlatform()
    },(err) =>{
      this.loading = false;
      this.showToast(err.message,'danger')
    })
  }
  deletePlatform(platform:string) {
    this.loading = true;
    this.bugbountyPlatform.deletePlatform(platform).subscribe( (result) => {
      this.loading=false
      this.showToast(result.message,'success')
      this.getPlatform()
    },(err) =>{
      this.loading = false;
      this.showToast(err.message,'danger')
    })
  }


  showToast(message: string, status: NbComponentStatus = 'danger') {
    if(status == 'danger' ) this.toastrService.show(message, 'Error', { status });
    if(status == 'success' ) this.toastrService.show(message, 'Success', { status });
  }
}
