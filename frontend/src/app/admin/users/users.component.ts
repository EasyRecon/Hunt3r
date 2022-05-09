import {Component, OnInit,TemplateRef} from '@angular/core';
import {UserService} from '../../core/user/user.service';
import {User} from '../../core/user/user';
import { FormGroup,FormBuilder   } from '@angular/forms';
import {
  NbToastrService,
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

  constructor(private fbuilder: FormBuilder,private dialogService: NbDialogService,private userService : UserService,private toastrService: NbToastrService) {

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
      this.showToast(err.message,'danger')
    })
  }

  
  deleteUser(id:number){
    this.loading = true 
    this.userService.deleteUser(id).subscribe( (result) => {
      this.loading = false 
      this.showToast('User has benn deleted','success')
      this.getUsers()
    },(err) =>{
      this.loading = false 
      this.showToast(err.message,'danger')
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
      this.showToast('Cloud provider scaleway has been updated','success')
      this.getUsers()
    },(err) =>{
      this.loadingModal = false 
      this.showToast(err.message,'danger')
    })
  }

  open(dialog: TemplateRef<any>) {
    this.addUserModal = this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
  }

  showToast(message: string, status: NbComponentStatus = 'danger') {
    if(status == 'danger' ) this.toastrService.show(message, 'Error', { status });
    if(status == 'success' ) this.toastrService.show(message, 'Success', { status });
  }


}
