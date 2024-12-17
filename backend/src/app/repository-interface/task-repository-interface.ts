import { Task } from '../../domain/entity/task/task';

export interface ITaskRepository {
  findAll(): Promise<Task[]>;
}