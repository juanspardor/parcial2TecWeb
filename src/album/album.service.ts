/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { AlbumEntity } from './album.entity';
import { TrackEntity } from '../track/track.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AlbumService {
    constructor(
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>
    ){}

    async findAll(): Promise<AlbumEntity[]> {
        return await this.albumRepository.find({ relations: ["tracks", "performers"] });
    }

    async findOne(id: string): Promise<AlbumEntity> {
        const album: AlbumEntity = await this.albumRepository.findOne({where: {id}, relations: ["tracks", "performers"] } );
        if (!album)
          throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
    
        return album;
    }

    async create(album: AlbumEntity): Promise<AlbumEntity> {

        const nombre = album.nombre;
        const descripcion = album.descripcion;

        if(nombre === "" || nombre === undefined)
            throw new BusinessLogicException("The album has no nombre", BusinessError.PRECONDITION_FAILED);

        if(descripcion === "" || descripcion === undefined)
            throw new BusinessLogicException("The album has no descripcion", BusinessError.PRECONDITION_FAILED);

        
        return await this.albumRepository.save(album);
    }

    async delete(id: string) {
        const album: AlbumEntity = await this.albumRepository.findOne({where:{id}, relations: ["tracks", "performers"]});
        if (!album)
          throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
      
        const tracks: TrackEntity[] = album.tracks;

        const longitud = tracks.length
        if(longitud > 0 )
            throw new BusinessLogicException("The album has tracks associated", BusinessError.PRECONDITION_FAILED);
        
        await this.albumRepository.remove(album);
    }


}
