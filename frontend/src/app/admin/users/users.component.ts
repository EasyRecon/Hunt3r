import {Component, OnInit,TemplateRef} from '@angular/core';
import {UserService} from '../../core/user/user.service';
import {User} from '../../core/user/user';
import { FormGroup,FormBuilder   } from '@angular/forms';
import { MessageService  } from '../../shared/message.service';
import {
  NbComponentStatus,
  NbDialogService

} from '@nebular/theme';





@Component({
  
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {


  loading = true;
  loadingModal = false;

  users: User[] = [{
    id: 0,
    email: '',
    role: '',
    created_at: ''

  }]
  addUserModal:any;
  createUserFrom: FormGroup = <FormGroup> {};

  constructor(private fbuilder: FormBuilder,
              private dialogService: NbDialogService,
              private userService : UserService,
              private messageService: MessageService) {

    this.createUserFrom = this.fbuilder.group({
      email: '',
      password: '',
      password_confirmation: ''
  });
    this.getUsers()
  }

  ngOnInit(): void {
  }
  getUsers() {
    this.userService.getAllUsers().subscribe( (result) => {
        this.users = result.data
        this.loading = false
    },(err) =>{
      this.loading = false 
      this.messageService.showToast(err.message,'danger')
    })
  }
  parseDate(date:any){
    let dateObject = new Date(date)
    let options:any = { hour: 'numeric',minute: 'numeric',second: 'numeric' ,weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return dateObject.toLocaleDateString("fr-FR",options)
  }
  
  deleteUser(id:number){
    this.loading = true 
    this.userService.deleteUser(id).subscribe( (result) => {
      this.loading = false 
      this.messageService.showToast(result.message,'success')
      this.getUsers()
    },(err) =>{
      this.loading = false 
      this.messageService.showToast(err.message,'danger')
    })
  }


  createUser(event:any) {
    event.preventDefault()
    this.loadingModal = true 
    let data = this.createUserFrom.value
    let finalData = {"user":data}
    this.userService.createUser(finalData).subscribe( (result) => {
      this.loadingModal = false 
      this.loading = true 
      this.addUserModal.close()
      this.messageService.showToast(result.message,'success')
      this.getUsers()
    },(err) =>{
      this.loadingModal = false 
      this.messageService.showToast(err.message,'danger')
    })
  }

  open(dialog: TemplateRef<any>) {
    this.addUserModal = this.dialogService.open(dialog);
  }
}
