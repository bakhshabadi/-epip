import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
// import { CustomerService } from '../../services/customer.service';

describe('AppController', () => {
  let appController: PostController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      // providers: [CustomerService],
    }).compile();

    appController = app.get<PostController>(PostController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getAll(null)).toBe('Hello World!');
    });
  });
});
