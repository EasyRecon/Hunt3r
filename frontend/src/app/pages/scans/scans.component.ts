import {Component, OnInit,TemplateRef} from '@angular/core';
import {ScanService} from '../../core/scan/scan.service';
import {Scan,AddScanData} from '../../core/scan/scan';
import {Engine} from '../../core/engines/engines';
import {EnginesService} from '../../core/engines/engines.service';
import { FormGroup,FormBuilder} from '@angular/forms';
import { MessageService  } from '../../shared/message.service';
import {
  NbDialogService

} from '@nebular/theme';



@Component({
  
  templateUrl: './scans.component.html',
  styleUrls: ['./scans.component.scss']
})
export class ScansComponent implements OnInit {
  scans:Scan[]=<any>[]
  loading = true;
  loadingModal=false
  enginesList:Engine[]=<any>[]
  addScanModal:any;
  engine:number=0
  engineForm:FormGroup = <FormGroup> {};
  regexList = Array()
  constructor(private fbuilder: FormBuilder,
    private scansService : ScanService,
    private messageService: MessageService,
    private engineService: EnginesService,
    private dialogService: NbDialogService) {
    
    this.engineForm = this.fbuilder.group({
      "scan_id": "",
});
    
    this.getScan()


  }
  open(dialog: TemplateRef<any>){
    this.addScanModal=this.dialogService.open(dialog, { context: '' });
    this.getEngine()
  } 
  closeModal(){
    this.addScanModal.close();
  }

  getEngine() {
    this.engineService.getEngines().subscribe((result)=>{
      this.loadingModal=false
      this.enginesList=result.data
    },(err)=>{
      this.loadingModal=false
      this.messageService.showToast(err.message,'danger')
    })
  }

  ngOnInit(): void {

   
  }
  removeRegex() {
    if (this.regexList.length > 1) {
      this.regexList.pop()
    }
  }
addRegex(){
  this.regexList.push('')
}
  setValue(event: any, i: number) {
    this.regexList[i] = event.target.value
  }
  onChange(event:any){
    console.log(event)
    this.engine=event
  }
  getScan(){
    this.loading=true
    this.scansService.getScans().subscribe((result)=>{
      this.loading=false
      this.scans=result.data

    },(err)=>{
      this.loading=false
      this.messageService.showToast(err.message,'danger')
    })
  }
  addScan(domain:any){
    this.loadingModal=true
    let scanProperties:AddScanData;
    this.enginesList.forEach((element)=>{
      console.log(element,this.engine)
      if(element.id==this.engine){
        element.infos.excludes = this.regexList.filter((element: any) => {
          return element !== '';
        });
        scanProperties= Object.assign(element.infos,{"domain":domain})
        this.scansService.addScans({"scan":scanProperties}).subscribe((result)=>{
          this.loadingModal=false
          this.closeModal()
          this.messageService.showToast(result.message,'success')
        },(err)=>{
          this.loadingModal=false
          this.messageService.showToast(err.message,'danger')
        })
      }
    })
  }
}
