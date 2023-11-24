/* eslint-disable prettier/prettier */
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service';
import { AlbumEntity } from './album.entity';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('AlbumService', () => {
  let service: AlbumService;
  let repository: Repository<AlbumEntity>;
  let albumsList: AlbumEntity[];



  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumService],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    repository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    await seedDatabase();
  });

  const seedDatabase =async () => {
    repository.clear();
    albumsList = [];
    for(let i = 0; i<5; i++){
      const album: AlbumEntity = await repository.save({
        nombre: faker.person.firstName(),
        caraturla: faker.image.url(),
        fechaLanzamiento: faker.date.birthdate(),
        descripcion: faker.lorem.sentence()
      })
      albumsList.push(album)
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

});
