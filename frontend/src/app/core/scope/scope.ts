export interface Scope {
    id:number;
    scope:string;
    scope_type:string;
    last_scan:string;
    leaks:number;
}

export interface ScopeSyncResponse {
    message:string;
    data:Scope[];
}