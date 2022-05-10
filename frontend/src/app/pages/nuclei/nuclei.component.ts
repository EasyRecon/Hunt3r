import {Component, OnInit,TemplateRef} from '@angular/core';
import {NucleiService} from '../../core/nuclei/nuclei.service';
import { FormGroup,FormBuilder   } from '@angular/forms';
import { ReplaySubject,Observable } from "rxjs";
import { MessageService  } from '../../shared/message.service';
import {
  NbComponentStatus,
  NbDialogService

} from '@nebular/theme';



@Component({
  
  templateUrl: './nuclei.component.html',
  styleUrls: ['./nuclei.component.scss']
})
export class NucleiComponent implements OnInit {

  uploadTemplateForm: FormGroup = <FormGroup> {};
  loading = false;
  loadingModal = false 
  templateList:string[]=<any>[]
  uploadModal:any;
  fileTemp:string=''
  constructor(private nucleiService : NucleiService,
    private messageService: MessageService,
              private dialogService: NbDialogService,
              private fbuilder: FormBuilder) {
    this.uploadTemplateForm = this.fbuilder.group({
      name: '',
      value:''
  });
  this.getTemplate()

  }

  ngOnInit(): void {

   
  }



  openUploadModal(dialog: TemplateRef<any>){
      this.uploadModal = this.dialogService.open(dialog, { context: '' });
  }
  closeUploadModal(){
    this.uploadModal.close()
  }
  onFileSelected(event:any) {
    this.convertFile(event.target.files[0]).subscribe( (base64:any) => {
      this.fileTemp = base64;
    });
  }

  convertFile(file : File) : Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event:any) => result.next(btoa((event.target.result).toString()));
    return result;
  }


  uploadTemplate(event:any){
    event.preventDefault()
    this.loadingModal = true 
    let data = this.uploadTemplateForm.value

    data = {"template":{"name":data.name,"value":this.fileTemp}}

    this.nucleiService.addTemplate(data).subscribe((result)=> {
      this.loadingModal=false
      this.closeUploadModal()
      this.getTemplate()

    },(err)=> {
      this.loadingModal=false
      this.messageService.showToast(err.message,'danger')
    })
  }
  deleteTemplate(name:string){
    this.loading=true
    this.nucleiService.deleteTemplate(name).subscribe((result)=> {
        this.loading=false
        this.messageService.showToast(result.message,'success')
        this.getTemplate()
    },(err)=> {
      this.loading=false
      this.messageService.showToast(err.message,'danger')
    })
  }
  getTemplate(){
    this.loading=true
    this.nucleiService.getTemplate().subscribe( (result) => {
      this.loading=false
      this.templateList=result.data
    },(err)=> {
      this.loading=false
      this.messageService.showToast(err.message,'danger')
    })
  
  }
}
