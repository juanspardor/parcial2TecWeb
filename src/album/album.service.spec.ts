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
  });

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

});
