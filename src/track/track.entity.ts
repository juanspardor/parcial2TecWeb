/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, JoinTable, JoinColumn, ManyToOne } from 'typeorm';
import { AlbumEntity } from '../album/album.entity';

@Entity()
export class TrackEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    nombre: string;


    @Column()
    duracion: number;


    @ManyToOne(()=>AlbumEntity, album => album.tracks)
   album: AlbumEntity;

}
