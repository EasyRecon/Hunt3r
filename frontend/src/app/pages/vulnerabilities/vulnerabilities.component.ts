import {Component, OnInit} from '@angular/core';
import {VulnerabilitiesService} from '../../core/vulnerabilities/vulnerabilities.service';
import {Vulnerabilities} from '../../core/vulnerabilities/vulnerabilities';
import { MessageService  } from '../../shared/message.service';




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
  criticity=''
  checkedAll=false
  selectedVuln:Vulnerabilities[]=<any>[]

  

  constructor(private vulnerabilitiesService : VulnerabilitiesService,private messageService: MessageService) {
   
    this.getVulnerabilities()

  }
  getVulnerabilities() {
    this.loading=true
    this.vulnerabilitiesService.getVulnerabilities(this.limit,this.page,this.criticity).subscribe((result)=> {
      this.loading=false
      this.vulnerabilitiesList=result.data
      this.total_pages=result.total_pages
    },(err)=> {
      this.loading=false
      this.messageService.showToast(err.message, 'danger');
    })
  }
  log(a:any){
    console.log(a)
  }
  selectAll(checked: boolean){
    this.checkedAll = checked;
    if(checked)this.selectedVuln=this.vulnerabilitiesList
    else this.selectedVuln=<any>[]
  }
  selectOne(checked: boolean,id:number){
    if(checked) this.addVuln(id)
    else this.removeVuln(id)
    console.log(this.selectedVuln)
  }

  addVuln(id:number){
    this.vulnerabilitiesList.forEach(item=>{
      if(id==item.id){
        this.selectedVuln.push(item)
      }
    })
  }
  removeVuln(id:number){
    this.selectedVuln= this.selectedVuln.filter((item)=> {
      return id!=item.id
    })
  }
  async deleteVulnerabilities(id:number){
    new Promise((resolve, reject) =>{
      this.loading=true
      this.vulnerabilitiesService.deleteVulnerabilities(id).subscribe((result)=> {
        this.loading=false
        this.messageService.showToast(result.message, 'success');
        resolve(true)
      },(err)=> {
        this.loading=false
        this.messageService.showToast(err.message, 'danger');
        reject(false)
      })
    })
  }
  deleteSelectedVulnerabilities(){
    let last = this.selectedVuln[this.selectedVuln.length-1]
   this.selectedVuln.forEach(async item => {
      await this.deleteVulnerabilities(item.id).then(async x => {
          if(item.id==last.id){
              await new Promise(f => setTimeout(f, 1000));
              this.selectAll(false)
              this.getVulnerabilities()
          }
      })

    })
  }
  ngOnInit(): void {

   
  }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
  changeCriticity(event:any){
    this.criticity=event
  }
  changeLimit(event:any){
    this.limit=event
    if(event=='-1')this.page=1
    this.getVulnerabilities()
  }
  goToPage(page:number){
    this.page=page
    this.getVulnerabilities()
  }
}
