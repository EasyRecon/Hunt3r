import {Component, OnInit,TemplateRef,ViewChild} from '@angular/core';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SubdomainsService } from '../../core/subdomains/subdomains.service';
import { Subdomain } from '../../core/subdomains/subdomains';
import {baseUrl } from "../../../environments/environment";
import { MessageService  } from '../../shared/message.service';

import {
  NbDialogService

} from '@nebular/theme';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
@Component({
  templateUrl: './subdomains.component.html',
  styleUrls: ['./subdomains.component.scss']
})

export class SubdomainsComponent implements OnInit {

  loadingSubomain=true
  searchTechno=''
  searchDomain=''
  searchSubdomain=''
  searchStatusCode=''
  techno_icon:Object={}
  @ViewChild('dialogScreen', { read: TemplateRef }) dialogScreen:any;
  domain=''
  limit=10
  page=1
  total_pages=1
  subdomainsList:Subdomain[]=<any>[]
  apiUrl=baseUrl

  screenModaldialog:any='';
  constructor(private location: Location,
              private Activatedroute:ActivatedRoute,
              private dialogService: NbDialogService,
              private subdomainService:SubdomainsService,
              private messageService: MessageService,
              private httpClient: HttpClient) {
 
   this.domain=this.Activatedroute.snapshot.paramMap.get("domain") || '';
  this.getSubdomains()
  this.getAllProperties()
  }

  getSubdomains() {
    this.loadingSubomain=true
    this.subdomainService.getSubdomain(this.page,this.limit,this.domain,this.searchSubdomain,this.searchTechno).subscribe( (result)=> {
      this.loadingSubomain=false
      this.subdomainsList=result.data
      this.total_pages=result.total_pages
    },(err)=>{
      this.loadingSubomain=false
      this.messageService.showToast(err.message,'danger')
    })
  }

  ngOnInit(): void {


  }

  screenModal(url:any){

    this.screenModaldialog=this.dialogService.open(this.dialogScreen, { context: url});
  }
  closeModal(){
    this.screenModaldialog.close()
  }
  searchSubomainInit(technologieSearch:string,subdomainSearch:string,statusCodeSearch:string,domainSearch:string){
    this.searchDomain=domainSearch
    this.searchTechno=technologieSearch
    this.searchSubdomain=subdomainSearch
    this.searchStatusCode=statusCodeSearch
    this.getSubdomains() 
  }


  back(): void {
    this.location.back()
  }

  changeLimit(event:any){
    this.limit=event
    if(event=='')this.page=1
    this.getSubdomains()
  }
  goToPage(page:number){
    this.page=page
    this.getSubdomains()
  }
  getAllProperties(){
    this.httpClient.get<{}>('/assets/json/icon.json').subscribe( (result)=> {
     this.techno_icon=result
    })
  }
  getImgTech(techno:any){
    return this.techno_icon[techno as keyof typeof this.techno_icon]
  }
}
