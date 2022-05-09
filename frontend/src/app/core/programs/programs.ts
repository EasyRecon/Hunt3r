
export interface Programs {
    id: number ;
    name:string;
    slug:string;
    vdp:boolean;
    scopes:number
 }

 export interface ProgramsData {
    message:string;
    data:Programs[]
 }