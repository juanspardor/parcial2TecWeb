/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, JoinTable, JoinColumn, ManyToMany } from 'typeorm';
import { TrackEntity } from '../track/track.entity';
import { PerformerEntity } from '../performer/performer.entity';

@Entity()
export class AlbumEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    caraturla: string;

    @Column()
    nombre: string;

    @Column()
    fechaLanzamiento: Date;

    @Column()
    descripcion: string;

    @OneToMany(()=> TrackEntity, track => track.album)
    @JoinColumn()
    tracks: TrackEntity[];

    @ManyToMany(()=>PerformerEntity, performer => performer.albums)
    performers : PerformerEntity[];



}
