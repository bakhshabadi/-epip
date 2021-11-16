import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { CustomerService } from '../../services/customer.service';

describe('AppController', () => {
  let appController: EventController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [CustomerService],
    }).compile();

    appController = app.get<EventController>(EventController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getAll(null)).toBe('Hello World!');
    });
  });
});
