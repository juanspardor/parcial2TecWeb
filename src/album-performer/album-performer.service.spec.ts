/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PerformerEntity } from '../performer/performer.entity';
import { Repository } from 'typeorm';
import { AlbumEntity } from '../album/album.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AlbumPerformerService } from './album-performer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AlbumPerformerService', () => {
  let service: AlbumPerformerService;
  let albumRepository: Repository<AlbumEntity>
  let performerRepository: Repository<PerformerEntity>
  let album: AlbumEntity
  let performersList: PerformerEntity[]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumPerformerService],
    }).compile();

    service = module.get<AlbumPerformerService>(AlbumPerformerService);
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    performerRepository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    albumRepository.clear()
    performerRepository.clear()

    performersList = [];
    for(let i = 0; i<3 ;i++)
    {
      const performer: PerformerEntity = await performerRepository.save(
        {
          nombre: faker.person.firstName(),
          imagen: faker.image.url(),
          descripcion: faker.lorem.sentence()
        }
      )
      performersList.push(performer)
    }

    album = await albumRepository.save({
      nombre: faker.person.firstName(),
      caraturla: faker.image.url(),
      fechaLanzamiento: faker.date.birthdate(),
      descripcion: faker.lorem.sentence(),
      performers: performersList
    })
  }

  it('addPerformerToAlbum should throw an exception for a album with already 3 performers',async () => {
    const newPerformer: PerformerEntity = await performerRepository.save({
      nombre: faker.person.firstName(),
          imagen: faker.image.url(),
          descripcion: faker.lorem.sentence()
    })

    await expect(() => service.addPerformerToAlbum(album.id, newPerformer.id)).rejects.toHaveProperty("message", "The album exceeds maximum number of performers")
  })

  it('addPerformerToAlbum should add a performer to an album',async () => {
    const newPerformer: PerformerEntity = await performerRepository.save({
      nombre: faker.person.firstName(),
          imagen: faker.image.url(),
          descripcion: faker.lorem.sentence()
    })

    const newAlbum: AlbumEntity = await albumRepository.save({
      nombre: faker.person.firstName(),
      caraturla: faker.image.url(),
      fechaLanzamiento: faker.date.birthdate(),
      descripcion: faker.lorem.sentence(),
    })

    const result: AlbumEntity = await service.addPerformerToAlbum(newAlbum.id, newPerformer.id);
    expect(result.performers.length).toBe(1);

  })


  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
