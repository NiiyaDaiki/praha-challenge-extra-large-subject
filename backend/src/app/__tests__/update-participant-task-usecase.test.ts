import { UpdateParticipantTaskUseCase } from '../update-participant-task-usecase'
import { IParticipantTaskRepository } from '../repository-interface/participant-task-repository-interface'
import { ParticipantTask } from '../../domain/entity/participant-task'
import { Progress } from '../../domain/entity/task/progress'

describe('UpdateParticipantTaskUseCase', () => {
  let participantTaskRepo: jest.Mocked<IParticipantTaskRepository>
  let usecase: UpdateParticipantTaskUseCase

  beforeEach(() => {
    participantTaskRepo = {
      findOneByParticipantIdAndTaskId: jest.fn(),
      save: jest.fn(),
    }

    usecase = new UpdateParticipantTaskUseCase(participantTaskRepo)

    jest.spyOn(console, 'log').mockImplementation(() => { })
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('[正常系]: progressをNOT_STARTEDからIN_REVIEWに変更', async () => {
    const participantTask = ParticipantTask.reconstruct({
      id: 'pt1',
      participantId: 'p1',
      taskId: 't1',
      progress: 'NOT_STARTED'
    })
    participantTaskRepo.findOneByParticipantIdAndTaskId.mockResolvedValueOnce(participantTask)
    participantTaskRepo.save.mockResolvedValueOnce(participantTask)

    await expect(
      usecase.do({
        participantId: 'p1',
        taskId: 't1',
        progress: 'IN_REVIEW'
      })
    ).resolves.toBeUndefined()

    expect(participantTaskRepo.findOneByParticipantIdAndTaskId).toHaveBeenCalledWith('p1', 't1')
    expect(participantTaskRepo.save).toHaveBeenCalledTimes(1)
    const savedTask = participantTaskRepo.save.mock.calls[0]?.[0] as ParticipantTask
    expect(savedTask.progress).toBe('IN_REVIEW')
  })

  it('[正常系]: 同じprogress値で更新(変化なし)してもエラーなく完了', async () => {
    const participantTask = ParticipantTask.reconstruct({
      id: 'pt3',
      participantId: 'p3',
      taskId: 't3',
      progress: 'NOT_STARTED'
    })
    participantTaskRepo.findOneByParticipantIdAndTaskId.mockResolvedValueOnce(participantTask)
    participantTaskRepo.save.mockResolvedValueOnce(participantTask)

    await expect(
      usecase.do({
        participantId: 'p3',
        taskId: 't3',
        progress: 'NOT_STARTED'
      })
    ).resolves.toBeUndefined()

    expect(participantTaskRepo.save).toHaveBeenCalledTimes(1)
    const savedTask = participantTaskRepo.save.mock.calls[0]?.[0] as ParticipantTask
    // 変更はないが、エラーなくsaveは呼ばれている
    expect(savedTask.progress).toBe('NOT_STARTED')
  })

  it('[異常系]: 不正なprogressを指定した場合エラー', async () => {
    await expect(
      usecase.do({
        participantId: 'p1',
        taskId: 't1',
        progress: 'INVALID' as Progress
      })
    ).rejects.toThrow('progressの値が不正です')

    expect(participantTaskRepo.findOneByParticipantIdAndTaskId).not.toHaveBeenCalled()
    expect(participantTaskRepo.save).not.toHaveBeenCalled()
  })

  it('[異常系]: participantTaskが見つからない場合エラー', async () => {
    participantTaskRepo.findOneByParticipantIdAndTaskId.mockResolvedValueOnce(undefined)
    await expect(
      usecase.do({
        participantId: 'p1',
        taskId: 't1',
        progress: 'NOT_STARTED'
      })
    ).rejects.toThrow('参加者課題が見つかりませんでした')
    expect(participantTaskRepo.save).not.toHaveBeenCalled()
  })



  it('[異常系]: COMPLETED状態のタスクを変更しようとするとエラー', async () => {
    const completedTask = ParticipantTask.reconstruct({
      id: 'pt2',
      participantId: 'p2',
      taskId: 't2',
      progress: 'COMPLETED'
    })
    participantTaskRepo.findOneByParticipantIdAndTaskId.mockResolvedValueOnce(completedTask)

    await expect(
      usecase.do({
        participantId: 'p2',
        taskId: 't2',
        progress: 'IN_REVIEW'
      })
    ).rejects.toThrow('ステータスが完了のタスクはステータスを変更できません')

    expect(participantTaskRepo.save).not.toHaveBeenCalled()
  })
})
