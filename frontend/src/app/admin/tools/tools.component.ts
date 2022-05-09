import {Component, OnInit,TemplateRef,ViewChild,AfterViewInit } from '@angular/core';
import {ToolsService} from '../../core/tools/tools.service';
import {
  NbToastrService,
  NbComponentStatus,
  NbDialogService

} from '@nebular/theme';

import { FormGroup,FormBuilder   } from '@angular/forms';
import { ToolsConfig } from 'src/app/core/tools/tools';




@Component({
  
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit, AfterViewInit  {
  dialogueRefUpdate:any;

  loading = true;
  toolModel:any[]=[];
  toolsList:any[]=[]
  tools:ToolsConfig[]=<ToolsConfig[]>[]
modalHTML:any;


@ViewChild('dialogCreateUserPassword', { read: TemplateRef }) dialogCreateUserPassword:any;
@ViewChild('dialogCreateApiKey', { read: TemplateRef }) dialogCreateApiKey:any;
@ViewChild('dialogCreateConfig', { read: TemplateRef }) dialogCreateConfig:any;
@ViewChild('dialogCreateUserApikey', { read: TemplateRef }) dialogCreateUserApikey:any;
@ViewChild('dialogCreateUrlApikey', { read: TemplateRef }) dialogCreateUrlApikey:any;
@ViewChild('dialogCreateWebhook', { read: TemplateRef }) dialogCreateWebhook:any;
private defaultTabButtonsTpl: any;

toolsFormUserPassword: FormGroup = <FormGroup> {};
toolsFormUserApiKey: FormGroup = <FormGroup> {};
toolsFormUrlApiKey: FormGroup = <FormGroup> {};
toolsFormConfig: FormGroup = <FormGroup> {};
toolsFormApikey: FormGroup = <FormGroup> {};
toolsFormWebhook: FormGroup = <FormGroup> {};

  dialogueRefCreate:any;


  constructor(private toastrService: NbToastrService,private toolsService:ToolsService,private fbuilder: FormBuilder,private dialogService: NbDialogService) {
    this.toolsFormUserPassword= this.fbuilder.group({ name: '',user: '', password: ''});
    this.toolsFormApikey= this.fbuilder.group({ name: '',api_key: ''  });
    this.toolsFormUserApiKey= this.fbuilder.group({ name: '',api_key: '',user:''  });
    this.toolsFormUrlApiKey= this.fbuilder.group({ name: '',api_key: '',url:''  });
    this.toolsFormConfig= this.fbuilder.group({ name: '',config_value:''  });
    this.toolsFormWebhook= this.fbuilder.group({ name: '',webhook:''  });
    this.getToolsModel()
    this.getTools()

  }


  ngOnInit(): void {

  }
  ngAfterViewInit() {

  }



  showToast(message: string, status: NbComponentStatus = 'danger') {
    if(status == 'danger' ) this.toastrService.show(message, 'Error', { status });
    if(status == 'success' ) this.toastrService.show(message, 'Success', { status });
  }

  closeModal() {
    this.dialogueRefCreate.close();
  }
  createModal(tool:any){

    let listRequired=Array()
    this.toolModel[tool].forEach((element:any)=> {
      listRequired.push(element)
    })
    if(listRequired.length==1 && listRequired.includes('config_value')){
      this.dialogueRefCreate = this.dialogService.open(this.dialogCreateConfig, { context: tool });
      this.toolsFormConfig.controls['name'].setValue(tool);
    } 
    if(listRequired.length==1 && listRequired.includes('api_key')){
      this.dialogueRefCreate = this.dialogService.open(this.dialogCreateApiKey, { context: tool });
      this.toolsFormApikey.controls['name'].setValue(tool);
    } 
    if(listRequired.length==1 && listRequired.includes('webhook')){
      this.dialogueRefCreate= this.dialogService.open(this.dialogCreateWebhook, { context: tool });
      this.toolsFormWebhook.controls['name'].setValue(tool);
   }
    if(listRequired.length==2 && listRequired.includes('user') && listRequired.includes('password')){
      this.dialogueRefCreate= this.dialogService.open(this.dialogCreateUserPassword, { context: tool });
      this.toolsFormUserPassword.controls['name'].setValue(tool);
    } 
    if(listRequired.length==2 && listRequired.includes('api_key') && listRequired.includes('user')){
       this.dialogueRefCreate= this.dialogService.open(this.dialogCreateUserApikey, { context: tool });
       this.toolsFormUserApiKey.controls['name'].setValue(tool);
    }
    if(listRequired.length==2 && listRequired.includes('api_key') && listRequired.includes('url')){
      this.dialogueRefCreate= this.dialogService.open(this.dialogCreateUrlApikey, { context: tool });
      this.toolsFormUrlApiKey.controls['name'].setValue(tool);
   }
   
  }
  updateModal(tool:any){

    let listRequired=Array()
    this.toolModel[tool].forEach((element:any)=> {
      listRequired.push(element)
    })
    
    if(listRequired.length==1 && listRequired.includes('config_value')){
      this.dialogueRefCreate = this.dialogService.open(this.dialogCreateConfig, { context: tool });
      var config_value=''
      this.tools.forEach((element)=>{ 
        if(element.name==tool){ 
          config_value= atob(element.infos.config_value)
        } 
      })
      this.toolsFormConfig.controls['config_value'].setValue(config_value);
      this.toolsFormConfig.controls['name'].setValue(tool);
    } 
    if(listRequired.length==1 && listRequired.includes('api_key')){
      this.dialogueRefCreate = this.dialogService.open(this.dialogCreateApiKey, { context: tool });
      var api_key=''
      this.tools.forEach((element)=>{ 
        if(element.name==tool){ 
          api_key=element.infos.api_key
        } 
      })
      this.toolsFormApikey.controls['api_key'].setValue(api_key);
      this.toolsFormApikey.controls['name'].setValue(tool);
    } 
    if(listRequired.length==2 && listRequired.includes('webhook') ){
      this.dialogueRefCreate= this.dialogService.open(this.dialogCreateUrlApikey, { context: tool });
      var webhook=''

      this.tools.forEach((element)=>{ 
        if(element.name==tool){ 
          webhook=element.infos.webhook
        } 
      })
      this.toolsFormUrlApiKey.controls['webhook'].setValue(webhook);
      this.toolsFormUrlApiKey.controls['name'].setValue(tool);
   }
    if(listRequired.length==2 && listRequired.includes('user') && listRequired.includes('password')){
      this.dialogueRefCreate= this.dialogService.open(this.dialogCreateUserPassword, { context: tool });
      var user=''
      var password=''
      this.tools.forEach((element)=>{ 
        if(element.name==tool){ 
          user=element.infos.user
          password=element.infos.password
        } 
      })
      this.toolsFormUserPassword.controls['user'].setValue(user);
      this.toolsFormUserPassword.controls['password'].setValue(password);
      this.toolsFormUserPassword.controls['name'].setValue(tool);
    } 
    if(listRequired.length==2 && listRequired.includes('api_key') && listRequired.includes('user')){
       this.dialogueRefCreate= this.dialogService.open(this.dialogCreateUserApikey, { context: tool });
       var user=''
       var api_key=''
       this.tools.forEach((element)=>{ 
         if(element.name==tool){ 
           user=element.infos.user
           api_key=element.infos.api_key
         } 
       })
       this.toolsFormUserPassword.controls['user'].setValue(user);
       this.toolsFormUserPassword.controls['password'].setValue(api_key);
       this.toolsFormUserApiKey.controls['name'].setValue(tool);
    }
    if(listRequired.length==2 && listRequired.includes('api_key') && listRequired.includes('url')){
      this.dialogueRefCreate= this.dialogService.open(this.dialogCreateUrlApikey, { context: tool });
      var url=''
      var api_key=''
      this.tools.forEach((element)=>{ 
        if(element.name==tool){ 
          user=element.infos.url
          api_key=element.infos.api_key
        } 
      })
      this.toolsFormUrlApiKey.controls['url'].setValue(url);
      this.toolsFormUrlApiKey.controls['password'].setValue(api_key);
      this.toolsFormUrlApiKey.controls['name'].setValue(tool);
   }
   
  }

  inputForm(event:any){

  }
  updateTools(event:any,type:any){
    this.loading=true
    event.preventDefault()
    var data:any={}
    if(type=='userPassword'){
       data = this.toolsFormUserPassword.value
    }
    else if(type=='apiKey'){
      data = this.toolsFormApikey.value
    }
    else if(type=='config'){
      data = this.toolsFormConfig.value
      data.config_value=btoa( data.config_value)
    }
    else if(type=='userApikey'){
      data = this.toolsFormUserApiKey.value
    }
    else if(type=='UrlApikey'){
      data = this.toolsFormUrlApiKey.value
    }
    else if(type=='Webhook'){
      data = this.toolsFormWebhook.value
    }
    let name = data.name
    delete data.name
    let finalData={"tool":{"name":name,"infos":data}}
    this.toolsService.updateTools(finalData).subscribe( (result) => {
        this.closeModal()
        this.loading=false
        this.showToast(result.message,'success')
        this.getTools()
    },(err) => {
      this.loading=false
      this.showToast(err.message,'danger')
    })
  }
  getTools(){
    this.loading=true
    this.toolsService.getTools().subscribe( (result) => {
      this.loading=false
      this.tools=result.data
      
    },(err) => {
      this.loading=false
      this.showToast(err.message,'danger')
    })
  }
  getKey(tool:any){
    let data=''
    this.tools.forEach((element)=>{
      if(element.name==tool){
        data=Object.keys(element.infos).join(',')
      }
    })
    return data
  }
  parseToolsRequirement(){

  }
  getToolsModel() {
    this.toolsService.getToolsModel().subscribe( (result) => {
      this.toolModel=result.data
      this.toolsList=Object.keys(result.data)
    },(err) => {
      this.loading=false
      this.showToast(err.message,'danger')
    })
  }

}
