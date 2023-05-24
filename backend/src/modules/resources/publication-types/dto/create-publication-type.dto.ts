import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePublicationTypeDto {
    
    @IsNotEmpty()
    @IsString()
    @Length(1, 150)
    publication_type:string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 500)
    instructions:string

}





