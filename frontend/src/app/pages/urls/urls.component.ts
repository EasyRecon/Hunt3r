import {Component } from '@angular/core';
import { UrlsService } from 'src/app/core/urls/urls.service';
import { Url } from 'src/app/core/urls/urls';
import { MessageService  } from '../../shared/message.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'


@Component({
  
  templateUrl: './urls.component.html',
  styleUrls: ['./urls.component.scss']
})
export class UrlsComponent  {
 
  page:number=1
  limit:number=10
  status_code:any=''
  idSub:any
  urlList:Url[]= <any>[]
  loading=true
  total_pages:number=1

  constructor(private messageService: MessageService,
              private urlsService:UrlsService,
              private location: Location,
              private Activatedroute:ActivatedRoute) {
    
    this.idSub=this.Activatedroute.snapshot.paramMap.get("idSub") || '';
    this.getUrls()

  } 

  ngOnInit(): void {

   
  }
  getUrls() {
    this.loading=true
    this.urlsService.getUrls(this.idSub,this.page,this.limit,this.status_code).subscribe( (result)=> {
      this.loading=false
      this.urlList=result.data
      this.total_pages=result.total_pages
     },(err)=>{
      this.loading=false
      this.messageService.showToast(err.message,'danger')
    })
  }
  changeLimit(event:any){
    this.limit=event
    if(event=='-1')this.page=1
    this.getUrls()
  }
  goToPage(page:number){
    this.page=page
    this.getUrls()
  }
  search(status_code:any){
    this.status_code=status_code
    this.getUrls()
  }
  back(){
    this.location.back()
  }
}
