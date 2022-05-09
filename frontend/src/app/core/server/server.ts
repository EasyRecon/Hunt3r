export interface Server {
    uid:string;
    name:string
    domain:string
    ip:string
    instance:string
    instance_type:string
    state:string
    cost:string
}

export interface ServerData {
    message:string
    data:Server[]
}