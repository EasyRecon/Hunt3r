import {Component, OnInit} from '@angular/core';
import {VulnerabilitiesService} from '../../core/vulnerabilities/vulnerabilities.service';
import {Vulnerabilities} from '../../core/vulnerabilities/vulnerabilities';
import { FormGroup,FormBuilder,FormControl,Validators   } from '@angular/forms';
import {
  NbToastrService,
  NbComponentStatus

} from '@nebular/theme';



@Component({
  
  templateUrl: './vulnerabilities.component.html',
  styleUrls: ['./vulnerabilities.component.scss']
})
export class VulnerabilitiesComponent implements OnInit {

  vulnerabilitiesList:Vulnerabilities[]=<any>[]
  loading = true;

  limit=10
  page=1
  total_pages=1
  

  constructor(private vulnerabilitiesService : VulnerabilitiesService,private fbuilder: FormBuilder,private toastrService: NbToastrService) {
   
    this.getVulnerabilities()

  }
  getVulnerabilities() {
    this.loading=true
    this.vulnerabilitiesService.getVulnerabilities(this.limit,this.page).subscribe((result)=> {
      this.loading=false
      this.vulnerabilitiesList=result.data
      this.total_pages=result.total_pages
    },(err)=> {
      this.loading=false
      this.showToast(err.message,'danger')
    })
  }

  deleteVulnerabilities(id:number){
    this.loading=true
    this.vulnerabilitiesService.deleteVulnerabilities(id).subscribe((result)=> {
      this.loading=false
      this.getVulnerabilities()
    },(err)=> {
      this.loading=false
      this.showToast(err.message,'danger')
    })
  }

  ngOnInit(): void {

   
  }
  changeLimit(event:any){
    this.limit=event
    if(event=='')this.page=1
    this.getVulnerabilities()
  }
  goToPage(page:number){
    this.page=page
    this.getVulnerabilities()
  }
  showToast(message: string, status: NbComponentStatus = 'danger') {
    if(status == 'danger' ) this.toastrService.show(message, 'Error', { status });
    if(status == 'success' ) this.toastrService.show(message, 'Success', { status });
  }


}
