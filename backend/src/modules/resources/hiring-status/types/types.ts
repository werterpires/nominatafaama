export interface IHiringStatus {
    hiring_status_id: number;
    hiring_status_name: string;
    hiring_status_description: string;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface ICreateHiringStatus {
    hiring_status_name: string;
    hiring_status_description: string;
  }
  
  export interface IUpdateHiringStatus {
    hiring_status_id: number;
    hiring_status_name: string;
    hiring_status_description: string;
  }
  