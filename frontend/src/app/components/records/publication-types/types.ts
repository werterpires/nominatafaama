export interface IPublicationType {
    publication_type_id: number;
    publication_type: string;
    instructions: string;
  }

  export interface CreatePublicationTypeDto {
    publication_type: string;
    instructions: string;
  }

  export interface UpdatePublicationTypeDto {
    publication_type: string;
    instructions: string;
    publication_type_id: number;
  }




