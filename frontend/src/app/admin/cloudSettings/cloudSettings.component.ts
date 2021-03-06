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
			"organization_id":"",
			"project_id":"",
			"region":"",
			"zone":"",
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

  updatescaleway(event:any) {
    event.preventDefault()
    this.loading = true;
    let data = this.scalewayForm.value
    data.ssh_key=btoa(data.ssh_key)
    let finalData = {"provider": {"name":"scaleway","infos":data}}
    if(finalData.provider.infos.secret_key.charAt(1) == '*') delete finalData.provider.infos.secret_key
    let action:'create'|'update'='create'
    if(this.scalewayExist) action='update'
      Object.keys(finalData.provider.infos).forEach(key => {
        if (finalData.provider.infos[key] === '') {
          delete finalData.provider.infos[key];
        }
      });
      this.cloudService[`${action}Scaleway`](finalData).subscribe( (result) => {
        this.loading = false;
        this.messageService.showToast(result.message,'success')
        this.getCloudProvider()
      },(err) =>{
        this.loading = false;
        this.messageService.showToast(err.message,'danger')
      })
  }

  deletescaleway() {
    this.loading = true;
    this.cloudService.deleteScaleway().subscribe( (result) => {
      this.messageService.showToast('Cloud provider scaleway has been deleted','success')
      this.scalewayExist=false
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
