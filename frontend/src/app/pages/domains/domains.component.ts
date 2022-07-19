import {Component, OnInit,TemplateRef,ViewChild} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { DomainsService } from '../../core/domains/domains.service';
import { Domain } from '../../core/domains/domains';
import { Router } from '@angular/router';
import { MessageService  } from '../../shared/message.service';
import {
  NbToastrService,
  NbComponentStatus,
  NbDialogService

} from '@nebular/theme';

@Component({
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.component.scss']
})
export class DomainsComponent implements OnInit {

  loadingDomain=true
  searchTechno=''
  searchDomain=''
  searchUrl=''
  searchStatusCode=''

  confirmDialogModal:any;
  @ViewChild('dialogConfirm', { read: TemplateRef }) dialogConfirm:any;

  domainsList:Domain[]=<any>[]


  limit=10
  page=1
  total_pages=1

  constructor(private router:Router,
              private dialogService: NbDialogService,
              private domainService:DomainsService,
              private messageService: MessageService) {
  this.getDomains()
  }

  getDomains() {
    this.loadingDomain=true
    this.domainService.getDomain(this.limit,this.page,this.searchDomain,this.searchUrl,this.searchStatusCode,this.searchTechno).subscribe( (result)=> {
      this.loadingDomain=false
      this.domainsList=result.data
      this.total_pages=result.total_pages
    },(err)=>{
      this.loadingDomain=false
      this.messageService.showToast(err.message,'danger')
    })
  }
  deleteDomainModale(id:number){

      this.confirmDialogModal = this.dialogService.open(this.dialogConfirm, { context: id });
  
  }
  changeLimit(event:any){
    this.limit=event
    if(event=='-1')this.page=1
    this.getDomains()
  }
  goToPage(page:number){
    this.page=page
    this.getDomains()
  }

  searchDomainInit(technologieSearch:string,urlSearch:string,statusCodeSearch:string,domainSearch:string){
    this.searchDomain=domainSearch
    this.searchTechno=technologieSearch
    this.searchUrl=urlSearch
    this.searchStatusCode=statusCodeSearch
    this.getDomains() 
  }

  deleteDomain(id:string){
    this.confirmDialogModal.close()
    this.loadingDomain=true
    this.domainService.deleteDomain(parseInt(id)).subscribe( (result)=>{
      this.loadingDomain=false
      this.messageService.showToast(result.message,'success')
      this.getDomains()
    },(err)=>{
      this.loadingDomain=false
      this.messageService.showToast(err.message,'danger')
    })
  }
  goToSubdomain(name:any){
    this.router.navigate(['pages','subdomains',name]);
  }
  ngOnInit(): void {


  }
}
