import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";
import { table } from "console";


export class UpdatePublicationType {

    @IsNotEmpty()
    @IsNumber()
    publication_type_id:number;

    @IsNotEmpty()
    @IsString()
    @Length(1, 500)   
    instructions: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 150)
    publication_type: string;

}



