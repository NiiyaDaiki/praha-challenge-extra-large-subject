import { GetPairsUseCase } from '../get-pairs-usecase'
import { IPairsQS, PairDTO } from '../query-service-interface/pairs-qs'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'

jest.mock('../query-service-interface/pairs-qs')

describe('GetPairsUseCase', () => {
  let mockPairsQS: MockedObjectDeep<IPairsQS>

  beforeAll(() => {
    mockPairsQS = mocked({
      getAll: jest.fn(),
    } as IPairsQS, true)
  })

  it('[正常系]: getAll が正常にデータを返す', async () => {
    const expectedData = [
      {
        id: 'pair1',
        name: 'a',
        participants: [
          { id: '1', name: 'Alice', email: 'alice@example.com', status: 'ACTIVE' },
          { id: '2', name: 'Bob', email: 'bob@example.com', status: 'ACTIVE' },
        ],
      },
      {
        id: 'pair2',
        name: 'b',
        participants: [
          { id: '3', name: 'Charlie', email: 'charlie@example.com', status: 'ACTIVE' },
        ],
      },
    ] as PairDTO[]
    mockPairsQS.getAll.mockResolvedValueOnce(expectedData)
    const usecase = new GetPairsUseCase(mockPairsQS)

    const result = await usecase.do()

    expect(result).toEqual(expectedData)
  })

  it('[異常系]: getAll が例外をスローした場合、例外をスローする', async () => {
    const ERROR_MESSAGE = 'error!'
    mockPairsQS.getAll.mockRejectedValueOnce(new Error(ERROR_MESSAGE))

    const usecase = new GetPairsUseCase(mockPairsQS)

    await expect(usecase.do()).rejects.toThrow(ERROR_MESSAGE)
  })
})
