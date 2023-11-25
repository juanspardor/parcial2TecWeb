/* eslint-disable prettier/prettier */
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { PerformerEntity } from './performer.entity';
import { PerformerService } from './performer.service';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';


describe('PerformerService', () => {
  let service: PerformerService;
  let repository: Repository<PerformerEntity>;
  let performersList: PerformerEntity[];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerformerService],
    }).compile();

    service = module.get<PerformerService>(PerformerService);
    repository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear()
    performersList = [];
    const performerBueno: PerformerEntity = await repository.save({
      nombre: faker.person.firstName(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.word(),
    })

    performersList.push(performerBueno);

    
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all performers', async () => {
    const performes: PerformerEntity[] = await service.findAll();
    expect(performes).not.toBeNull();
    expect(performes).toHaveLength(performersList.length);
  });

  it('findOne should return a performer by id', async () => {
    const storedPerformer: PerformerEntity = performersList[0];
    const performer: PerformerEntity = await service.findOne(storedPerformer.id);
    expect(performer).not.toBeNull();
    expect(performer.nombre).toEqual(storedPerformer.nombre)
    expect(performer.imagen).toEqual(storedPerformer.imagen)
    expect(performer.descripcion).toEqual(storedPerformer.descripcion)
  });

  it('findOne should throw an exception for an invalid performer', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The performer with the given id was not found")
  });

  it('create should return a new performer', async () => {
    const performer: PerformerEntity = {
      id: "",
      nombre: faker.company.name(), 
      descripcion: faker.lorem.sentence(), 
      imagen: faker.image.url(),
      albums: [],
    }

    const newPerformer: PerformerEntity = await service.create(performer);
    expect(newPerformer).not.toBeNull();

  });

  it('create should throw an exception for an invalid performer', async () => {
    const performer: PerformerEntity = {
      id: "",
      nombre: faker.company.name(), 
      descripcion: faker.lorem.paragraph(), 
      imagen: faker.image.url(),
      albums: [],
    }
    await expect(() => service.create(performer)).rejects.toHaveProperty("message", "The performers descripcion is too long")


  });
});
