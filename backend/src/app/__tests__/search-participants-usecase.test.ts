import { SearchParticipantsUseCase } from '../search-participants-usecase'
import { IParticipantTasksQS } from '../query-service-interface/participant-tasks-qs'
import { SearchParticipantTasksDTO } from '../query-service-interface/participant-tasks-qs'
import { MembershipStatus } from "../../domain/entity/participant"
import { Progress } from "../../domain/entity/task/progress"

describe('SearchParticipantsUseCase', () => {
  let participantTasksQS: jest.Mocked<IParticipantTasksQS>
  let usecase: SearchParticipantsUseCase

  beforeEach(() => {
    participantTasksQS = {
      search10ParticipantsByTaskProgress: jest.fn()
    }

    usecase = new SearchParticipantsUseCase(participantTasksQS)
  })

  it('[正常系]: cursorなしで検索が行われ、結果が返る', async () => {
    const params = {
      taskIds: ['task1', 'task2'],
      progress: 'COMPLETED' as Progress,
    }

    const mockResult = [
      new SearchParticipantTasksDTO({
        id: 'pt1',
        progress: 'COMPLETED',
        task: { id: 'task1', genre: 'DATABASE', title: 'Task Title 1' },
        participant: { id: 'p1', name: 'John', status: 'ACTIVE' as MembershipStatus },
      }),
      new SearchParticipantTasksDTO({
        id: 'pt2',
        progress: 'COMPLETED',
        task: { id: 'task2', genre: 'ARCHITECTURE', title: 'Task Title 2' },
        participant: { id: 'p2', name: 'Jane', status: 'ACTIVE' as MembershipStatus },
      })
    ]
    participantTasksQS.search10ParticipantsByTaskProgress.mockResolvedValueOnce(mockResult)

    const result = await usecase.do(params)

    expect(participantTasksQS.search10ParticipantsByTaskProgress).toHaveBeenCalledWith({
      taskIds: ['task1', 'task2'],
      progress: 'COMPLETED',
      cursor: undefined
    })
    expect(result).toEqual(mockResult)
  })

  it('[正常系]: cursorありで検索が行われ、結果が返る', async () => {
    const params = {
      taskIds: ['task3'],
      progress: 'IN_REVIEW' as Progress,
      cursor: 'cursor-id'
    }
    const mockResult = [
      new SearchParticipantTasksDTO({
        id: 'pt3',
        progress: 'IN_REVIEW',
        task: { id: 'task3', genre: 'DATABASE', title: 'DB Task' },
        participant: { id: 'p3', name: 'Alice', status: 'ACTIVE' as MembershipStatus }
      })
    ]
    participantTasksQS.search10ParticipantsByTaskProgress.mockResolvedValueOnce(mockResult)

    const result = await usecase.do(params)

    expect(participantTasksQS.search10ParticipantsByTaskProgress).toHaveBeenCalledWith({
      taskIds: ['task3'],
      progress: 'IN_REVIEW',
      cursor: 'cursor-id'
    })
    expect(result).toEqual(mockResult)
  })

  it('[異常系]: search10ParticipantsByTaskProgressがエラーを投げた場合、同じエラーがスローされる', async () => {
    const params = {
      taskIds: ['task1'],
      progress: 'NOT_STARTED' as Progress
    }
    const error = new Error('Error!')
    participantTasksQS.search10ParticipantsByTaskProgress.mockRejectedValueOnce(error)

    await expect(usecase.do(params)).rejects.toThrow('Error!')
    expect(participantTasksQS.search10ParticipantsByTaskProgress).toHaveBeenCalledWith({
      taskIds: ['task1'],
      progress: 'NOT_STARTED',
      cursor: undefined
    })
  })
})
