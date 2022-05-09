import {Component,TemplateRef,Injectable } from '@angular/core';
import {ProgramsService} from '../../core/programs/programs.service';
import {ScopeService} from '../../core/scope/scope.service';
import {Scope} from '../../core/scope/scope';
import {Programs} from '../../core/programs/programs';
import {EnginesService} from '../../core/engines/engines.service';
import {Engine} from '../../core/engines/engines';
import {ScanService} from '../../core/scan/scan.service';
import {AddScanData} from '../../core/scan/scan';

import {
  NbToastrService,
  NbComponentStatus,
  NbDialogService

} from '@nebular/theme';
import { result } from 'lodash';



@Component({
  
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent  {
 
  @Injectable()
  loading=true
  flipped=false
  loadingRefreshProgram=false
  loadingRefreshScope=false
  scopeChoosed=false
  scopeTemp:Scope[]=<any>[]
  selectedPlateform:any='all';
  listeProgramInti:Programs[]=<any>[]
  listeProgramYwh:Programs[]=<any>[]
  listeProgramHackerone :Programs[]=<any>[]
  scopeModal:any;
  loadingModal=false;
  listEngines:Engine[]=<any>[]
  currentScope=0
  engineByDomain:any[]=[]
  constructor(private toastrService: NbToastrService,
              private programsService:ProgramsService,
              private scopeService:ScopeService,
              private dialogService:NbDialogService,
              private enginesService:EnginesService,
              private scansService:ScanService) {
    
    this.getProgram()
    

  } 

  ngOnInit(): void {

   
  }
  scopeAsString(a:Scope[]){
    return a.map( x => x.scope)
  }
  lauchScan(domain:any){
    console.log(domain)
    this.loadingModal=false;
    let scanAttr:AddScanData;
    this.listEngines.forEach((element)=>{
      if(element.id==this.engineByDomain[domain as keyof typeof this.engineByDomain]){
        scanAttr=Object.assign(element.infos,{"domain":domain})

        this.scansService.addScans({"scan":scanAttr}).subscribe((result)=>{
          this.loadingModal=false
          this.showToast(result.message,'success')
          this.getScope(this.currentScope)
        },(err)=>{
          this.loadingModal=false
          this.showToast(err.message,'danger')
        })
      }
    })
  }
  syncProg(){
    this.loadingRefreshProgram=true
    this.programsService.syncPrograms().subscribe((result)=> {
      this.loadingRefreshProgram=false
      this.showToast(result.message,'success')

    },(err)=> {
      this.loadingRefreshProgram=false
      this.showToast(err.message,'danger')
    })
  }
  toggle(event:any,domain:any){
    this.engineByDomain[domain as keyof typeof this.engineByDomain]=event
    console.log(this.engineByDomain)
  }
  syncScope(id:number){
    this.scopeService.syncScope(id).subscribe( (result) => {
      this.showToast(result.message,'success')
    },(err)=>{
      this.showToast(err.message,'danger')
    })
  }
  getScope(id:number,search:string=''){
    this.currentScope=id
    this.loading=true
    this.scopeService.getScope(id,search).subscribe( (result)=> {
      this.scopeTemp=result.data
      this.loading=false
    },(err)=>{
      this.loading=false
      this.showToast(err.message,'danger')
    })
    //this.scopeModal = this.dialogService.open(dialog, { context: '' });
    this.flipped=true
  }
  openModal(dialog: TemplateRef<any>,domains:string[]){
    domains=domains.map( domain => this.cleanScope(domain))
    this.loadingModal=true
    this.enginesService.getEngines().subscribe((result)=>{
      this.loadingModal=false
      this.listEngines=result.data
    },(err)=>{
      this.loadingModal=false
      this.showToast(err.message,'danger')
    })
    this.scopeModal=this.dialogService.open(dialog, { context: domains });
  }
  cleanScope(data:any){
    data=data.replace(/^https?:\/\//, '')
    data=data.replace(/^http?:\/\//, '')
    data=data.replace(/\*/, '')

    return data
  }
  closeModal(){
    
    this.scopeModal.close()
  }
  getProgram(search:any='',platfrom:any='all'){
    this.loading=true
    this.listeProgramYwh=[]
    this.listeProgramInti=[]
    var stateLoadYWH=0
    var stateLoadInti=0
    var stateLoadHackerone=0
    if(platfrom=='yeswehack' || platfrom=='all'){
      stateLoadYWH=1
      this.programsService.getPrograms('yeswehack',search).subscribe( (result)=> {
        if( (stateLoadInti==0 ||stateLoadInti==2) && (stateLoadHackerone==0 ||stateLoadHackerone==2) )this.loading=false
        stateLoadYWH=2
        this.listeProgramYwh=result.data

      },(err)=>{
        this.loading=false
        this.showToast(err.message,'danger')
      })
    }
    if(platfrom=='intigriti' || platfrom=='all'){
      stateLoadInti=1
      this.programsService.getPrograms('intigriti',search).subscribe( (result)=> {
        if((stateLoadYWH==0 ||stateLoadYWH==2) && (stateLoadHackerone==0 ||stateLoadHackerone==2) )this.loading=false
        stateLoadInti=2
        this.listeProgramInti=result.data
      },(err)=>{

        this.showToast(err.message,'danger')
      })
    }
    
    if(platfrom=='hackerone' || platfrom=='all'){
      stateLoadHackerone=1
      this.programsService.getPrograms('hackerone',search).subscribe( (result)=> {
        if((stateLoadYWH==0 ||stateLoadYWH==2) && (stateLoadInti==0 ||stateLoadInti==2) )this.loading=false
        stateLoadHackerone=2
        this.listeProgramHackerone=result.data
      },(err)=>{

        this.showToast(err.message,'danger')
      })
    }

  }
  back(){
    this.flipped=false
  }
  showToast(message: string, status: NbComponentStatus = 'danger') {
    if(status == 'danger' ) this.toastrService.show(message, 'Error', { status });
    if(status == 'success' ) this.toastrService.show(message, 'Success', { status });
  }


}
