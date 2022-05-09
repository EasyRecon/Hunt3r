
export interface Notif {
    message_type: string ;
    message: string ;
    created_at: string;
 }

 
export interface NotifData {
   message:string;
   data: Notif[]
}
export interface DeleteNotif {
   message:string;
   data: null
}
