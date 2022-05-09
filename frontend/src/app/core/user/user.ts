
export interface User {
    id: number ;
    email: string ;
    role: string;
    created_at: string;
 }
 export interface UpdateUser {
    id: number;
    email: string;
    password: string;
    role: string;
    created_at: string;
 }

 export interface DataUser {
    data: User
 }

 export interface DataUsers {
   data: User[]
}

export interface AddUser {
   "user":{
      email: string ;
      password: string;
      password_confirm: string;
   }
}

export interface UserResponse {
   success: string;
}
