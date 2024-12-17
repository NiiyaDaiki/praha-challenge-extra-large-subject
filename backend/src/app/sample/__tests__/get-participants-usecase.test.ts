import { GetParticipantsUseCase } from '../get-participants-usecase'
import { IParticipantsQS } from '../query-service-interface/participants-qs'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { MembershipStatus } from '../../../domain/entity/participant'

jest.mock('../query-service-interface/participants-qs')

describe('GetParticipantsUseCase', () => {
  let mockParticipantsQS: MockedObjectDeep<IParticipantsQS>

  beforeAll(() => {
    mockParticipantsQS = mocked({
      getAll: jest.fn(),
    } as IParticipantsQS, true)
  })

  it('[正常系]: getAll が正常にデータを返す', async () => {
    const expectedData = [
      { id: '1', name: 'Participant 1', email: 'test@gmail.com', status: 'ACTIVE' as MembershipStatus },
      { id: '2', name: 'Participant 2', email: 'test@gmail.com', status: 'ACTIVE' as MembershipStatus }
    ]
    mockParticipantsQS.getAll.mockResolvedValueOnce(expectedData)

    const usecase = new GetParticipantsUseCase(mockParticipantsQS)
    const result = await usecase.do()

    expect(mockParticipantsQS.getAll).toHaveBeenCalledTimes(1)
    expect(result).toEqual(expectedData)
  })

  it('[異常系]: getAll が例外をスローした場合、例外をスローする', async () => {
    const ERROR_MESSAGE = 'error!'
    mockParticipantsQS.getAll.mockRejectedValueOnce(new Error(ERROR_MESSAGE))

    const usecase = new GetParticipantsUseCase(mockParticipantsQS)

    await expect(usecase.do()).rejects.toThrow(ERROR_MESSAGE)
  })
})
