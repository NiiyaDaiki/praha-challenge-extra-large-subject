import { SomeData } from '../../domain/some-data/some-data'
import { createRandomIdString } from '../../util/random'
import { ISomeDataRepository } from '../../domain/some-data/some-data-repository'

export class PostSomeDataUseCase {
  private readonly someDataRepo: ISomeDataRepository
  public constructor(someDataRepo: ISomeDataRepository) {
    this.someDataRepo = someDataRepo
  }
  public async do(params: { required: boolean; number: number }) {
    const { required, number } = params

    const someDataEntity = new SomeData({
      id: createRandomIdString(),
      required,
      number,
    })
    await this.someDataRepo.save(someDataEntity)
  }
}
