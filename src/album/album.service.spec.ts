/* eslint-disable prettier/prettier */
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service';
import { AlbumEntity } from './album.entity';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TrackEntity } from '../track/track.entity';

describe('AlbumService', () => {
  let service: AlbumService;
  let repository: Repository<AlbumEntity>;
  let albumsList: AlbumEntity[];
  let trackRepository: Repository<TrackEntity>;



  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumService],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    repository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    trackRepository = module.get<Repository<TrackEntity>>(getRepositoryToken(TrackEntity));
    await seedDatabase();
  });

  const seedDatabase =async () => {
    trackRepository.clear();
    const track: TrackEntity = await trackRepository.save({
      nombre: faker.lorem.word(),
      duracion: faker.number.int()
    })

    repository.clear();
    albumsList = [];
    for(let i = 0; i<4; i++){
      const album: AlbumEntity = await repository.save({
        nombre: faker.person.firstName(),
        caraturla: faker.image.url(),
        fechaLanzamiento: faker.date.birthdate(),
        descripcion: faker.lorem.sentence(),
        tracks: [track]
      })
      albumsList.push(album)

      const albumSolo: AlbumEntity = await repository.save({
        nombre: faker.person.firstName(),
        caraturla: faker.image.url(),
        fechaLanzamiento: faker.date.birthdate(),
        descripcion: faker.lorem.sentence()
      })

      albumsList.push(albumSolo)
    }
    
  }
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a album', async () => {
    const album = {
      id : "",
      nombre: faker.person.firstName(),
      caraturla: faker.image.url(),
      fechaLanzamiento: faker.date.anytime(),
      descripcion: faker.lorem.sentence(),
      tracks: [],
      performers: []
    }

    const newAlbum: AlbumEntity = await service.create(album);
    expect(newAlbum).not.toBeNull();

  } )

  it('create should throw an exception for an album with no desciption',async () => {
    const album = {
      id : "",
      nombre: faker.person.firstName(),
      caraturla: faker.image.url(),
      fechaLanzamiento: faker.date.anytime(),
      descripcion: "",
      tracks: [],
      performers: []
    }

    await expect(() => service.create(album)).rejects.toHaveProperty("message", "The album has no descripcion")
  })

  it('findAll should return all albums', async () => {
    const albums: AlbumEntity[] = await service.findAll();
    expect(albums).not.toBeNull();
    expect(albums).toHaveLength(albumsList.length);
  });

  it('findOne should return a album by id', async () => {
    const storedAlbum: AlbumEntity = albumsList[0];
    const album: AlbumEntity = await service.findOne(storedAlbum.id);
    expect(album).not.toBeNull();
    expect(album.caraturla).toEqual(storedAlbum.caraturla)
    expect(album.nombre).toEqual(storedAlbum.nombre)
    expect(album.fechaLanzamiento).toEqual(storedAlbum.fechaLanzamiento)
    expect(album.descripcion).toEqual(storedAlbum.descripcion)

  });

  it('findOne should throw an exception for an invalid album', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The album with the given id was not found")
  });


  it('delete should remove a museum', async () => {
    const album: AlbumEntity = albumsList[4];
    await service.delete(album.id);
  
    const deletedAlbum: AlbumEntity = await repository.findOne({ where: { id: album.id } })
    expect(deletedAlbum).toBeNull();
  });

  it('delete should throw an exception for an invalid museum', async () => {
    const album: AlbumEntity = albumsList[0];
    await service.delete(album.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The album with the given id was not found")
  });
  


});
