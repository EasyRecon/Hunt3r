export interface Leak {
   username: string
   email:string
   password:string
}
export interface LeakData {
   message:string
   data: Leak[]
   total_pages:number
}