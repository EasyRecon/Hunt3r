import {Component,TemplateRef,Injectable } from '@angular/core';
import {ProgramsService} from '../../core/programs/programs.service';
import {ScopeService} from '../../core/scope/scope.service';
import {Scope} from '../../core/scope/scope';
import {Programs} from '../../core/programs/programs';
import {EnginesService} from '../../core/engines/engines.service';
import {Engine} from '../../core/engines/engines';
import {ScanService} from '../../core/scan/scan.service';
import {AddScanData} from '../../core/scan/scan';
import { MessageService  } from '../../shared/message.service';
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
  listeProgramIntigriti:Programs[]=<any>[]
  listeProgramYeswehack:Programs[]=<any>[]
  listeProgramHackerone :Programs[]=<any>[]
  scopeModal:any;
  loadingModal=false;
  listEngines:Engine[]=<any>[]
  currentScope=0
  engineByDomain:any[]=[]
  regexList=Array()
  scrollY:number=0
  constructor(private messageService: MessageService,
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
        element.infos.excludes = this.regexList[domain].filter((element:any) => {
          return element !== '';
        });
        scanAttr=Object.assign(element.infos,{"domain":domain})
        if(scanAttr.domain.constructor === Array)scanAttr.domain=scanAttr.domain[0]
        this.scansService.addScans({"scan":scanAttr}).subscribe((result)=>{
          this.loadingModal=false
          this.messageService.showToast(result.message,'success')
          this.scopeModal.close()
          this.getScope(this.currentScope)
        },(err)=>{
          this.loadingModal=false
          this.messageService.showToast(err.message,'danger')
        })
      }
    })
  }
  syncProg(){
    this.loadingRefreshProgram=true
    this.programsService.syncPrograms().subscribe((result)=> {
      this.loadingRefreshProgram=false
      this.messageService.showToast(result.message,'success')

    },(err)=> {
      this.loadingRefreshProgram=false
      this.messageService.showToast(err.message,'danger')
    })
  }
  toggle(event:any,domain:any){
    this.engineByDomain[domain as keyof typeof this.engineByDomain]=event
    console.log(this.engineByDomain)
  }
  syncScope(id:number){
    this.scopeService.syncScope(id).subscribe( (result) => {
      this.messageService.showToast(result.message,'success')
    },(err)=>{
      this.messageService.showToast(err.message,'danger')
    })
  }
  getScope(id:number,search:string=''){
    window.scroll(0, 0);
    this.scrollY=window.pageYOffset
    this.currentScope=id
    this.loading=true
    this.scopeService.getScope(id,search).subscribe( (result)=> {
      this.scopeTemp=result.data
      this.loading=false
    },(err)=>{
      this.loading=false
      this.messageService.showToast(err.message,'danger')
    })
    //this.scopeModal = this.dialogService.open(dialog, { context: '' });
    this.flipped=true
    
  }
  openModal(dialog: TemplateRef<any>,domains:string[]){
   // domains=domains.map( domain => this.cleanScope(domain))
    for(var i = 0; i < domains.length; i++) {
      this.regexList[domains[i] as keyof typeof this.regexList]=Array('')
    };
    this.loadingModal=true
    this.enginesService.getEngines().subscribe((result)=>{
      this.loadingModal=false
      this.listEngines=result.data
    },(err)=>{
      this.loadingModal=false
      this.messageService.showToast(err.message,'danger')
    })
    this.scopeModal=this.dialogService.open(dialog, { context: domains });
  }
  closeModal(){
    
    this.scopeModal.close()
  }
  getProgram(search:any='',platform:'all'|'yeswehack'|'intigriti'|'hackerone'='all'){
    this.listeProgramIntigriti=<any>[]
    this.listeProgramYeswehack=<any>[]
    this.listeProgramHackerone=<any>[]
    if(platform=='all'){
      this.getProgramFromPlatform(search, ['yeswehack','intigriti','hackerone'])
    } else {
      this.getProgramFromPlatform(search, [platform])
    }
  }
  getProgramFromPlatform(search:any='',platform:any[]){
    
    platform.forEach( (plat:any) => {
      this.loading=true
      this.programsService.getPrograms(plat,search).subscribe( (result)=> {
        let upperPlatform:'Yeswehack'|'Intigriti'|'Hackerone'=plat.charAt(0).toUpperCase()+plat.slice(1)
        let listName:'listeProgramYeswehack'|'listeProgramIntigriti'|'listeProgramHackerone'=`listeProgram${upperPlatform}`
        this[listName]=result.data
        this.loading=false
      },(err)=>{
        this.loading=false
        this.messageService.showToast(err.message,'danger')
      })
    })
  }
  back(){
    window.scroll(0, this.scrollY);
    this.flipped=false
  }
  addRegex(name:string){
    this.regexList[name as keyof typeof this.regexList].push('')
  }
  removeRegex(name: string) {
    if (this.regexList[name as keyof typeof this.regexList].length>1){
      this.regexList[name as keyof typeof this.regexList].pop()    
    }
  }
  setValue(event:any,i:number,domain:string){
    this.regexList[domain as keyof typeof this.regexList][i] = event.target.value
  }
}
