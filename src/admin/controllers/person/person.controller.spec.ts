import { Test, TestingModule } from '@nestjs/testing';
import { PersonController } from './person.controller';
import { CustomerService } from '../../services/customer.service';

describe('AppController', () => {
  let appController: PersonController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
      providers: [CustomerService],
    }).compile();

    appController = app.get<PersonController>(PersonController);
  });

  // describe('root', () => {
  //   it('should return "Hello World!"', () => {
  //     expect(appController.getAll(null)).toBe('Hello World!');
  //   });
  // });
});
