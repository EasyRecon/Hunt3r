import {Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder  } from '@angular/forms';
import { DataCloudProvider } from '../../core/cloudProvider/cloudProvider'
import { CloudProviderService } from '../../core/cloudProvider/cloudProvider.service'
import { MessageService  } from '../../shared/message.service';


@Component({
  selector: 'ngx-dashboard',
  templateUrl: './cloudSettings.component.html',
  styleUrls: ['./cloudSettings.component.scss']
})
export class CloudSettingsComponent implements OnInit {

  data= {};
  user: DataCloudProvider = {} as DataCloudProvider;
  scalewayForm: FormGroup = <FormGroup> {};
  awsForm: FormGroup = <FormGroup> {};
  scaleway = {
    "access_key":"",
			"secret_key":"",
			"organization_id":"",
			"project_id":"",
			"region":"",
			"zone":"",
      "ssh_key": ""
  }
  scalewayExist = false;
  awsExist      = false;
  aws = {
    "access_key":"",
		"secret_key":"",
		"region":"",
    "ssh_key": ""
  }

  loading = true;
  constructor(private fbuilder: FormBuilder,
              private messageService: MessageService,
              private cloudService : CloudProviderService) {


      this.scalewayForm = this.initForm()
      this.awsForm = this.initForm()
  }
  initForm(){
    return this.fbuilder.group({
      access_key: '',
      secret_key: '',
      organization_id: '',
      project_id: '',
      region: '',
      zone: '',
      ssh_key: ''
});
  }
  ngOnInit(): void {
    this.scalewayExist = false;
    this.awsExist      = false;
    this.getCloudProvider()

  }

  getCloudProvider() {
    this.cloudService.getCloudProvider().subscribe( (result) => {
      result.data.forEach( (element) => {
        if(element.name == 'scaleway'){
          this.scaleway = element.infos
          this.scalewayExist=true
        } 
        if(element.name == 'aws'){
          this.aws = element.infos
          this.awsExist = true
        } 
      });     
      this.loading = false;
    },(err) =>{
      this.loading = false;
      this.messageService.showToast(err.message,'danger')
    })
  }

  updatecloud(event:any,type:'scaleway'|'aws') {
    event.preventDefault()
    this.loading = true;
    let data = this[`${type}Form`].value
    data.ssh_key=btoa(data.ssh_key)
    let finalData = {"provider": {"name":type,"infos":data}}
    if(finalData.provider.infos.secret_key.charAt(1) == '*') delete finalData.provider.infos.secret_key
    let action:'create'|'update'='create'
    if(this[`${type}Exist`]) action='update'
      Object.keys(finalData.provider.infos).forEach(key => {
        if (finalData.provider.infos[key] === '') {
          delete finalData.provider.infos[key];
        }
      });
      this.cloudService[`${action}Cloud`](finalData).subscribe( (result) => {
        this.loading = false;
        this.messageService.showToast(result.message,'success')
        this.getCloudProvider()
      },(err) =>{
        this.loading = false;
        this.messageService.showToast(err.message,'danger')
      })
  }

  deletecloud(type:'aws'|'scaleway') {
    this.loading = true;
    this.cloudService.deleteCloud(type).subscribe( (result) => {
      this.messageService.showToast(`Cloud provider ${type} has been deleted`,'success')
      this[`${type}Exist`]=false
      this.loading = false;
      this.getCloudProvider()
    },(err) =>{
      this.loading = false;
      this.messageService.showToast(err.message,'danger')
    })
  }

  updateaws(event:any) {
    event.preventDefault()

  }
}
