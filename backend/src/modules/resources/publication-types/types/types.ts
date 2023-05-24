export interface IPublicationType {
  publication_type_id: number;
  publication_type: string;
  instructions: string;
  created_at: Date;
  updated_at: Date;
}

export interface ICreatePublicationType {
  publication_type: string;
  instructions: string;
}

export interface IUpdatePublicationType {
  publication_type: string;
  instructions: string;
  publication_type_id: number;
}
