import { GetTeamsUseCase } from '../get-teams-usecase'
import { ITeamsQS, TeamDTO } from '../query-service-interface/teams-qs'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'

jest.mock('../query-service-interface/teams-qs')

describe('GetTeamsUseCase', () => {
  let mockTeamsQS: MockedObjectDeep<ITeamsQS>

  beforeAll(() => {
    mockTeamsQS = mocked({
      getAll: jest.fn(),
    } as ITeamsQS, true)
  })

  it('[正常系]: getAll が正常にデータを返す', async () => {
    const expectedData = [
      {
        id: 'team1',
        name: '1',
        pairs: [
          {
            id: 'pair1',
            name: 'a',
            participants: [
              { id: '1', name: 'Alice', email: 'alice@example.com', status: 'ACTIVE' },
              { id: '2', name: 'Bob', email: 'bob@example.com', status: 'ACTIVE' },
            ]
          },
          {
            id: 'pair2',
            name: 'b',
            participants: [
              { id: '3', name: 'Charlie', email: 'charlie@example.com', status: 'ACTIVE' },
            ],
          },
        ],
      },
      {
        id: 'team2',
        name: '2',
        pairs: [
          {
            id: 'pair3',
            name: 'c',
            participants: [
              { id: '4', name: 'Dave', email: 'dave@example.com', status: 'active' },
            ],
          },
        ],
      },
    ] as TeamDTO[]
    mockTeamsQS.getAll.mockResolvedValueOnce(expectedData)

    const usecase = new GetTeamsUseCase(mockTeamsQS)
    const result = await usecase.do()

    expect(result).toEqual(expectedData)
  })

  it('[異常系]: getAll が例外をスローした場合、例外をスローする', async () => {
    const ERROR_MESSAGE = 'error!'
    mockTeamsQS.getAll.mockRejectedValueOnce(new Error(ERROR_MESSAGE))

    const usecase = new GetTeamsUseCase(mockTeamsQS)

    await expect(usecase.do()).rejects.toThrow(ERROR_MESSAGE)
  })
})
