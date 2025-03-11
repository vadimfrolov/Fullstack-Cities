import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCityRecordDto {
    @ApiProperty({
        required: true,
        type: 'string',
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}