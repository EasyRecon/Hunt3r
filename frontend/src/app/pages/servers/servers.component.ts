import {Component, OnInit} from '@angular/core';
import {ServerService} from '../../core/server/server.service';
import {Server} from '../../core/server/server';
import { MessageService  } from '../../shared/message.service';





@Component({
  
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.scss']
})
export class ServersComponent implements OnInit {
  loading=false
  serverList:Server[] = <any>[]

  constructor(private serverService : ServerService,private messageService: MessageService) {
    

    this.getServer()
  }

  ngOnInit(): void {

   
  }
  getServer(){
    this.loading=true
    this.serverService.getServers().subscribe( (result)=> {
      this.loading=false
      this.serverList=result.data
    },(err)=> {
      this.loading=false
      this.messageService.showToast(err.message,'danger')
    })
  }
  deleteServer(uid:string){
    this.loading=true
    this.serverService.deleteServers(uid).subscribe( (result)=>{
      this.loading=false
      this.messageService.showToast(result.message,'success')
      this.getServer()
    },(err)=> {
      this.messageService.showToast(err.message,'danger')
    })
  }
}
