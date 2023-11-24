/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { TrackEntity } from './track.entity';
import { AlbumEntity } from '../album/album.entity';

@Injectable()
export class TrackService {
    constructor(
        @InjectRepository(TrackEntity)
        private readonly trackRepository: Repository<TrackEntity>,

        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>
    ){}


    async findAll(): Promise<TrackEntity[]> {
        return await this.trackRepository.find({ relations: ["albums"] });
    }

    async findOne(id: string): Promise<TrackEntity> {
        const track: TrackEntity = await this.trackRepository.findOne({where: {id}, relations: ["albums"] } );
        if (!track)
          throw new BusinessLogicException("The track with the given id was not found", BusinessError.NOT_FOUND);
    
        return track;
    }

    async create(albumId: string, track: TrackEntity): Promise<TrackEntity> {
        const album: AlbumEntity  = await this.albumRepository.findOne({ where: { id: albumId } });
        if(!album)
            throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);

        const duracion = track.duracion;
        if(duracion < 0 )
            throw new BusinessLogicException("The duration is negative", BusinessError.PRECONDITION_FAILED);

        return await this.trackRepository.save(track);
    }
}
