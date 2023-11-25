/* eslint-disable prettier/prettier */
import {IsDate, IsNotEmpty, IsString} from 'class-validator';
export class AlbumDto {

    @IsString()
    @IsNotEmpty()
    readonly caraturla: string;

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsDate()
    @IsNotEmpty()
    readonly fechaLanzamiento: Date;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;
}
