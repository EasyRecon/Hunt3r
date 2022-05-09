import {Component, OnInit} from '@angular/core';
import {UserService} from '../../core/user/user.service';
import {User} from '../../core/user/user';
import { FormGroup,FormBuilder,FormControl,Validators   } from '@angular/forms';
import {
  NbToastrService,
  NbComponentStatus

} from '@nebular/theme';



@Component({
  
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: User = {
    id: 0,
    email: '',
    role: '',
    created_at: ''
};
  id : any ='';
  updateUserSpinner = false;
  userForm: FormGroup = <FormGroup> {};
  loading = true;
  constructor(private userService : UserService,private fbuilder: FormBuilder,private toastrService: NbToastrService) {
    

    
    this.userForm = this.fbuilder.group({
        id: '',
        email: '',
        password: '',
        role: '',
        created_at: ''
    });
      this.userService.getCurrentUser().subscribe( (result) => {
        this.user = result.data
        this.userForm = this.fbuilder.group({
          id: this.user.id,
          email: this.user.email,
          password: '',
          role: this.user.role,
          created_at: this.user.created_at
      });
      this.loading=false
    },(err) =>{
      this.loading=false
      this.showToast(err.error,'danger')
    })


  }

  ngOnInit(): void {

   
  }
  updateUser(event:any){
    this.loading=true
    event.preventDefault()

    let data = this.userForm.value
    if(data.password == '' ) delete data.password
    this.userService.updateCurrentUser(data).subscribe( (result) => {
      this.user = result.data
      this.showToast('User has been updated','success')
      this.loading=false
      
    },(err) =>{
      this.loading=false
      this.showToast(err.error,'danger')
    })
  
  }
  showToast(message: string, status: NbComponentStatus = 'danger') {
    if(status == 'danger' ) this.toastrService.show(message, 'Error', { status });
    if(status == 'success' ) this.toastrService.show(message, 'Success', { status });
  }


}
