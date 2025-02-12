import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../app.module';

describe('Tasks API Integration Tests with Seeded Data', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // CI環境ではseedコマンドによりDBに初期データが投入されている前提とする
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should retrieve the task list with valid tasks', async () => {
    const response = await request(app.getHttpServer())
      .get('/tasks')
      .expect(200);

    expect(response.body).toHaveProperty('tasks');
    expect(Array.isArray(response.body.tasks)).toBeTruthy();

    const tasks = response.body.tasks;
    // 数十件取得されることを前提として、ある程度の件数が返っているか検証
    expect(tasks.length).toBeGreaterThan(0);

    const validGenres = ['BASIS', 'TEST', 'DATABASE', 'ARCHITECTURE', 'FRONTEND', 'TEAM_DEV', 'MVP'];

    tasks.forEach((task: any) => {
      // IDがUUID形式であることを検証
      expect(task).toHaveProperty('id');
      expect(task.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

      // titleは文字列かつ空文字ではないことを検証
      expect(task).toHaveProperty('title');
      expect(typeof task.title).toBe('string');
      expect(task.title.length).toBeGreaterThan(0);

      // genreが定義済みの値のいずれかであることを検証
      expect(task).toHaveProperty('genre');
      expect(validGenres).toContain(task.genre);

      // descriptionは文字列であることを検証
      expect(task).toHaveProperty('description');
      expect(typeof task.description).toBe('string');
    });
  });
});
