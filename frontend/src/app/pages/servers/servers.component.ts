import {Component, OnInit} from '@angular/core';
import {ServerService} from '../../core/server/server.service';
import {Server} from '../../core/server/server';

import {
  NbToastrService,
  NbComponentStatus

} from '@nebular/theme';
import { result } from 'lodash';



@Component({
  
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.scss']
})
export class ServersComponent implements OnInit {
  loading=false
  serverList:Server[] = <any>[]

  constructor(private serverService : ServerService,private toastrService: NbToastrService) {
    

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
      this.showToast(err.message,'danger')
    })
  }
  deleteServer(uid:string){
    this.loading=true
    this.serverService.deleteServers(uid).subscribe( (result)=>{
      this.loading=false
      this.showToast(result.message,'success')
      this.getServer()
    },(err)=> {
      this.showToast(err.message,'danger')
    })
  }
  showToast(message: string, status: NbComponentStatus = 'danger') {
    if(status == 'danger' ) this.toastrService.show(message, 'Error', { status });
    if(status == 'success' ) this.toastrService.show(message, 'Success', { status });
  }


}
