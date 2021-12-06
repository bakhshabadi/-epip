import { Test, TestingModule } from '@nestjs/testing';
import { DivarController } from './divar.controller';
import { CustomerService } from '../../services/customer.service';

describe('AppController', () => {
  let appController: DivarController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DivarController],
      providers: [CustomerService],
    }).compile();

    appController = app.get<DivarController>(DivarController);
  });

  
});
