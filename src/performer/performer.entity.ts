/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, JoinTable, JoinColumn, ManyToMany } from 'typeorm';
import { AlbumEntity } from '../album/album.entity';
@Entity()
export class PerformerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    imagen: string;

    @Column()
    descripcion: string;

    @ManyToMany(()=>AlbumEntity, album => album.performers)
    @JoinTable()
    albums : AlbumEntity[];


}
