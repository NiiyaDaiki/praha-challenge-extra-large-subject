import { Pair } from '../../domain/entity/pair';

export interface IPairRepository {
  findById(id: string): Promise<Pair | undefined>;
}