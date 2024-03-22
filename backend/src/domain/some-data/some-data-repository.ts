import { SomeData } from '../../domain/some-data/some-data'

export interface ISomeDataRepository {
  save(someData: SomeData): Promise<SomeData>
}
