import * as faker from 'faker'
import { Task } from '../src/domain/entity/task/task'
import { Genre } from '../src/domain/entity/task/task';

export const createTaskTestData = () => {
  const genres: Genre[] = ['BASIS', 'TEST', 'DATABASE', 'ARCHITECTURE', 'FRONTEND', 'TEAM_DEV', 'MVP'];

  return new Task({
    id: faker.random.uuid(),
    title: faker.name.title(),
    genre: faker.random.arrayElement(genres),
    description: faker.lorem.paragraph(),
  })
}