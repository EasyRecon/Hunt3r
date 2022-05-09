export interface ToolsConfig {
   name:string;
   infos:{
      user:string;
      password:string;
      api_key:string;
      url:string;
      config_value:string;
      webhook:string
   }
}
export interface ToolsData {
   message: string;
   data: ToolsConfig[];
}
export interface ToolsConfigModel {
   message: string;
   data: any[];
}

export interface ToolsConfigUpdate {
   tool:ToolsConfig
}