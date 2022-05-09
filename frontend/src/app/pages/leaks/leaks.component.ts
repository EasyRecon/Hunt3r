import {Component, OnInit} from '@angular/core';
import {LeaksService} from '../../core/leaks/leaks.service';
import {Leak} from '../../core/leaks/leaks';
import { MessageService  } from '../../shared/message.service';


@Component({
  
  templateUrl: './leaks.component.html',
  styleUrls: ['./leaks.component.scss']
})
export class LeaksComponent implements OnInit {

  leaksList:Leak[]=<any>[]
  loading=true

  limit=10
  page=1
  total_pages=1

  constructor(private leaksService : LeaksService,private messageService: MessageService) {


    this.getLeaks()
  }

  ngOnInit(): void {

   
  }
  getLeaks(domain:string=''){
    this.loading=true
    this.leaksService.getLeaks(domain,this.limit,this.page).subscribe( (result)=> {
      this.loading=false
      this.leaksList=result.data
      this.total_pages=result.total_pages
    },(err)=> {
      this.loading=false
      this.messageService.showToast(err.message,'danger')
    })
  }
  changeLimit(event:any){
    this.limit=event
    if(event=='')this.page=1
    this.getLeaks('')
  }
  goToPage(page:number){
    this.page=page
    this.getLeaks('')
  }
}
