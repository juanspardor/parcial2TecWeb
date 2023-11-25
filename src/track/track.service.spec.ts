/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TrackService } from './track.service';
import { TrackEntity } from './track.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { AlbumEntity } from '../album/album.entity';
import { AlbumService } from '../album/album.service';

describe('TrackService', () => {
  let service: TrackService;
  let repository: Repository<TrackEntity>;
  let albumRepository: Repository<AlbumEntity>;
  let tracksList: TrackEntity[];
  let album: AlbumEntity

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TrackService, AlbumService],
    }).compile();

    service = module.get<TrackService>(TrackService);
    
    repository = module.get<Repository<TrackEntity>>(getRepositoryToken(TrackEntity));
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    await seedDatabase();
  });

  const seedDatabase =async () => {
    repository.clear()
    albumRepository.clear()
    tracksList = [];
    for(let i = 0; i<5; i++){
      const track: TrackEntity = await repository.save({
        nombre: faker.person.firstName(),
        duracion: faker.number.int()
      })
      tracksList.push(track)
    }

    const albumCreado = await albumRepository.save({
      nombre: faker.person.firstName(),
        caraturla: faker.image.url(),
        fechaLanzamiento: faker.date.birthdate(),
        descripcion: faker.lorem.sentence()
    })
    album = albumCreado;
  }


  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('findAll should return all tracks', async () => {
    const tracks: TrackEntity[] = await service.findAll();
    expect(tracks).not.toBeNull();
    expect(tracks).toHaveLength(tracksList.length);
  });

  it('findOne should return a track by id', async () => {
    const storedTrack: TrackEntity = tracksList[0];
    const track: TrackEntity = await service.findOne(storedTrack.id);
    expect(track).not.toBeNull();
    expect(track.nombre).toEqual(storedTrack.nombre)
    expect(track.duracion).toEqual(storedTrack.duracion)
  });

  it('findOne should throw an exception for an invalid museum', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The track with the given id was not found")
  });

  it('create should return a new track', async () => {
    const track: TrackEntity = {
      id: "",
      nombre: faker.person.firstName(), 
      duracion: faker.number.int(), 
      album: null
    }

    const newTrack: TrackEntity = await service.create(album.id, track);
    expect(newTrack).not.toBeNull();

  });

  it('create should throw an exception when using an invalid album',async () => {
    const track: TrackEntity = {
      id: "",
      nombre: faker.person.firstName(), 
      duracion: faker.number.int(), 
      album: null
    }
    await expect(() => service.create("0",track)).rejects.toHaveProperty("message", "The album with the given id was not found")
  })

  it('create should throw an exception when using an invalid track',async () => {
    const track: TrackEntity = {
      id: "",
      nombre: faker.person.firstName(), 
      duracion: -100, 
      album: null
    }
    await expect(() => service.create(album.id,track)).rejects.toHaveProperty("message", "The duration is negative")
  })
});
