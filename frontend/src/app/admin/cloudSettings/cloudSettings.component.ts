import {Component, OnInit,TemplateRef } from '@angular/core';

import {UserService} from '../../core/user/user.service';
import { HttpClient } from '@angular/common/http';
import {NbDialogService } from '@nebular/theme'
import { FormGroup,FormBuilder  } from '@angular/forms';
import { DataCloudProvider } from '../../core/cloudProvider/cloudProvider'
import { CloudProviderService } from '../../core/cloudProvider/cloudProvider.service'
import {
  NbToastrService,
  NbComponentStatus

} from '@nebular/theme';


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
    private toastrService: NbToastrService,
    private cloudService : CloudProviderService) {


      this.scalewayForm = this.fbuilder.group({
          access_key: '',
          secret_key: '',
          organization_id: '',
          project_id: '',
          region: '',
          zone: '',
          ssh_key: ''
    });


    this.awsForm = this.fbuilder.group({
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
      this.showToast(err.message,'danger')
    })
  }

  updatescaleway(event:any) {
    event.preventDefault()
    this.loading = true;
    let data = this.scalewayForm.value
    data.ssh_key=btoa(data.ssh_key)
    let finalData = {"provider": {"name":"scaleway","infos":data}}
    if(this.scalewayExist) {
      if(finalData.provider.infos.secret_key.charAt(1) == '*') delete finalData.provider.infos.secret_key
      Object.keys(finalData.provider.infos).forEach(key => {
        if (finalData.provider.infos[key] === '') {
          delete finalData.provider.infos[key];
        }
      });
      this.cloudService.updateScaleway(finalData).subscribe( (result) => {
        
        this.showToast('Cloud provider scaleway has been updated','success')
        this.getCloudProvider()
      },(err) =>{
        this.loading = false;
        this.showToast(err.message,'danger')
      })
    } else {
      this.cloudService.createScaleway(finalData).subscribe( (result) => {
        this.scalewayExist=true
        this.showToast('Cloud provider scaleway has been created','success')
      },(err) =>{
        this.loading = false;
        this.showToast(err.message,'danger')
      })
    }

  }
  deletescaleway() {
    this.loading = true;
    this.cloudService.deleteScaleway().subscribe( (result) => {
      this.showToast('Cloud provider scaleway has been deleted','success')
      this.scalewayExist=false
      this.getCloudProvider()
    },(err) =>{
      this.loading = false;
      this.showToast(err.message,'danger')
    })
  }

  updateaws(event:any) {
    event.preventDefault()

  }



  showToast(message: string, status: NbComponentStatus = 'danger') {
    if(status == 'danger' ) this.toastrService.show(message, 'Error', { status });
    if(status == 'success' ) this.toastrService.show(message, 'Success', { status });
  }
}
