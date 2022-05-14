
export interface Engine {
   id:number
   name: string,
   infos:{
      type_scan: "recon"|"nuclei",
      instance_type: string,
      provider: string,
      notifs: boolean,
      active_recon: boolean,
      intel: boolean,
      leak: boolean,
      nuclei: boolean,
      all_templates: boolean,
      custom_interactsh:boolean,
      nuclei_severity:string[],
      permutation: boolean,
      gau: boolean,
      custom_templates: string[]
   }

}

export interface AddEngineResponse {
   message:string
   data: string
}
export interface EngineResponse {
   message:string
   data: Engine[]
}