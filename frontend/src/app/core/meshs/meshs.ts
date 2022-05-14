export interface MeshConfig {
   id:number;
   name:string;
   url:string;
   token:string;
}
export interface MeshData {
   message: string;
   data: MeshConfig[];
}
export interface CreateMesh {
   mesh: MeshConfig;
}

export interface MeshResponse{
   message: string;
   data: any;
}
export interface MeshSyncData {
meshs:{
      url:string,
   token:string
   type:string
}

}
export interface MeshSyn {
meshs:{
      url:string,
   token:string
   type:string
   domain:string
}

}