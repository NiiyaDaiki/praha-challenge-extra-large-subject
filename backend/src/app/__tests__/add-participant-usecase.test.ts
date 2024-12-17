// AddParticipantUseCase.spec.ts

import { AddParticipantUseCase } from '../add-participant-usecase'
import { IParticipantRepository } from '../repository-interface/participant-repository-interface'
import { ITaskRepository } from '../repository-interface/task-repository-interface'
import { ITeamRepository } from '../repository-interface/team-repository-interface'
import { Participant } from '../../domain/entity/participant'
import { Task } from '../../domain/entity/task/task'
import { Team } from '../../domain/entity/team'
import { Pair } from '../../domain/entity/pair'
import { createRandomIdString } from '../../util/random'

jest.mock('../../util/random', () => {
  const actualRandom = jest.requireActual('../../util/random') as { [key: string]: any };
  return {
    ...actualRandom,
    createRandomIdString: jest.fn(),
  }
})


describe('AddParticipantUseCase', () => {
  let participantRepo: jest.Mocked<IParticipantRepository>
  let taskRepo: jest.Mocked<ITaskRepository>
  let teamRepo: jest.Mocked<ITeamRepository>
  let usecase: AddParticipantUseCase

  beforeEach(() => {
    participantRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      delete: jest.fn(),
    }

    taskRepo = {
      findAll: jest.fn(),
    }

    teamRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByPairId: jest.fn(),
      findByParticipantId: jest.fn(),
      save: jest.fn(),
    }

    usecase = new AddParticipantUseCase(participantRepo, taskRepo, teamRepo);

    // createRandomIdStringを安定させる
    (createRandomIdString as jest.Mock).mockReturnValue('fixed-random-id')

    // Math.randomを固定値に
    jest.spyOn(global.Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('[正常系]: メール重複なし・タスク取得成功・チーム取得成功', async () => {
    participantRepo.findByEmail.mockResolvedValueOnce(undefined)
    taskRepo.findAll.mockResolvedValueOnce([
      new Task({ id: 'task1', title: 'Task1', genre: 'BASIS', description: 'Description1' }),
      new Task({ id: 'task2', title: 'Task2', genre: 'TEST', description: 'Description2' })
    ])


    // チームにはペアがあり、最小参加人数ペアを取得できる
    const pairA = new Pair({ id: 'pairA', name: 'a', participantIds: ['p1', 'p2'] })
    const pairB = new Pair({ id: 'pairB', name: 'b', participantIds: ['p3', 'p4', 'p5'] })
    const team = new Team({ id: 'team1', name: '1', pairs: [pairA, pairB] })

    teamRepo.findAll.mockResolvedValueOnce([team])

    await expect(usecase.do({ name: 'John Doe', email: 'john@example.com' })).resolves.toBeUndefined()

    // Participant保存確認
    expect(participantRepo.save).toHaveBeenCalledTimes(1)
    const savedParticipant = participantRepo.save.mock.calls[0]?.[0] as Participant
    expect(savedParticipant.name).toBe('John Doe')
    expect(savedParticipant.email).toBe('john@example.com')
    // participantTasksが生成されているか
    expect(savedParticipant.participantTasks.length).toBe(2)
    expect(savedParticipant.participantTasks[0]?.taskId).toBe('task1')

    // チーム保存確認（参加者が追加されていること）
    expect(teamRepo.save).toHaveBeenCalledTimes(1)
    const savedTeam = teamRepo.save.mock.calls[0]?.[0] as Team
    // 元々pairAが最小数(2名)だったのでそこに追加される
    const pairAUpdated = savedTeam.getAllProperties().pairs.find(p => p.id === 'pairA')
    expect(pairAUpdated).not.toBeUndefined()
    expect(pairAUpdated?.getParticipantIds()).toContain(savedParticipant.id)
  })

  it('[正常系]: タスクが空でもエラーなく実行できる', async () => {
    participantRepo.findByEmail.mockResolvedValueOnce(undefined)
    taskRepo.findAll.mockResolvedValueOnce([]) // タスクなし
    const pair = new Pair({ id: 'pairA', name: 'a', participantIds: ['p1', 'p2', 'p3'] })
    const team = new Team({ id: 'team1', name: '1', pairs: [pair] })
    teamRepo.findAll.mockResolvedValueOnce([team])

    await expect(
      usecase.do({ name: 'No Task User', email: 'notask@example.com' })
    ).resolves.toBeUndefined()

    expect(participantRepo.save).toHaveBeenCalledTimes(1)
    const savedParticipant = participantRepo.save.mock.calls[0]?.[0] as Participant
    expect(savedParticipant.participantTasks.length).toBe(0)
  })

  it('[異常系]: メールアドレスが既に登録されている', async () => {
    participantRepo.findByEmail.mockResolvedValueOnce({
      id: 'p-existing',
      name: 'Existing User',
      email: 'existing@example.com',
      participantTasks: [],
      status: 'ACTIVE'
    } as unknown as Participant)

    await expect(
      usecase.do({ name: 'New User', email: 'existing@example.com' })
    ).rejects.toThrow('このメールアドレスは既に登録されています')

    expect(participantRepo.save).not.toHaveBeenCalled()
    expect(teamRepo.save).not.toHaveBeenCalled()
  })

  it('[異常系]: チームが存在しない場合エラー', async () => {
    participantRepo.findByEmail.mockResolvedValueOnce(undefined)
    taskRepo.findAll.mockResolvedValueOnce([
      new Task({ id: 'task1', title: 'Task1', genre: 'BASIS', description: 'Description1' })
    ])


    teamRepo.findAll.mockResolvedValueOnce([]) // チームなし

    await expect(
      usecase.do({ name: 'No Team User', email: 'no-team@example.com' })
    ).rejects.toThrow('チームが見つかりませんでした')

    expect(participantRepo.save).not.toHaveBeenCalled()
    expect(teamRepo.save).not.toHaveBeenCalled()
  })

  it('[異常系]: participantRepo.saveでエラーが発生', async () => {
    participantRepo.findByEmail.mockResolvedValueOnce(undefined)
    taskRepo.findAll.mockResolvedValueOnce([
      new Task({ id: 'task1', title: 'Task1', genre: 'BASIS', description: 'Description1' })
    ])


    const pairA = new Pair({ id: 'pairA', name: 'a', participantIds: ['p1', 'p2', 'p3'] })
    const team = new Team({ id: 'team1', name: '1', pairs: [pairA] })
    teamRepo.findAll.mockResolvedValueOnce([team])

    participantRepo.save.mockRejectedValueOnce(new Error('DB save error'))

    await expect(
      usecase.do({ name: 'DB Error User', email: 'dberror@example.com' })
    ).rejects.toThrow('参加者の追加に失敗しました')

    expect(teamRepo.save).not.toHaveBeenCalled()
  })

  it('[異常系]: teamRepo.saveでエラーが発生', async () => {
    participantRepo.findByEmail.mockResolvedValueOnce(undefined)
    taskRepo.findAll.mockResolvedValueOnce([
      new Task({ id: 'task1', title: 'Task1', genre: 'BASIS', description: 'Description1' })
    ])


    const pairA = new Pair({ id: 'pairA', name: 'a', participantIds: ['p1', 'p2'] })
    const team = new Team({ id: 'team1', name: '1', pairs: [pairA] })
    teamRepo.findAll.mockResolvedValueOnce([team])

    participantRepo.save.mockResolvedValueOnce() // participant保存は成功
    teamRepo.save.mockRejectedValueOnce(new Error('Team save error'))

    await expect(
      usecase.do({ name: 'Team Save Error User', email: 'teamsaveerror@example.com' })
    ).rejects.toThrow('参加者の追加に失敗しました')
  })

  it('[異常系]: 参加者のメールアドレスが無効フォーマット', async () => {
    participantRepo.findByEmail.mockResolvedValueOnce(undefined)
    taskRepo.findAll.mockResolvedValueOnce([
      new Task({ id: 'task1', title: 'Task1', genre: 'BASIS', description: 'Description1' })
    ])
    const pair = new Pair({ id: 'pairA', name: 'a', participantIds: ['p1', 'p2'] })
    const team = new Team({ id: 'team1', name: '1', pairs: [pair] })
    teamRepo.findAll.mockResolvedValueOnce([team])

    await expect(
      usecase.do({ name: 'Invalid Email', email: 'invalid-email-format' })
    ).rejects.toThrow('無効なメールアドレスが指定されました')

    // participant生成時点でエラーになるため、participantRepo.saveやteamRepo.saveは呼ばれないはず
    expect(participantRepo.save).not.toHaveBeenCalled()
    expect(teamRepo.save).not.toHaveBeenCalled()
  })

  it('[正常系]: 複数のチームがあり、最小参加数のチームが複数存在する場合も正常動作', async () => {
    participantRepo.findByEmail.mockResolvedValueOnce(undefined)
    taskRepo.findAll.mockResolvedValueOnce([
      new Task({ id: 'task1', title: 'Task1', genre: 'BASIS', description: 'Description1' })
    ])


    // 2チーム存在、両方2名ずつ
    const pairTeamA = new Pair({ id: 'pairA', name: 'a', participantIds: ['p1', 'p2'] })
    const teamA = new Team({ id: 'teamA', name: '1', pairs: [pairTeamA] })

    const pairTeamB = new Pair({ id: 'pairB', name: 'b', participantIds: ['p3', 'p4'] })
    const teamB = new Team({ id: 'teamB', name: '2', pairs: [pairTeamB] })

    // 両チームとも参加人数2名なので最小チームは両方が対象
    teamRepo.findAll.mockResolvedValueOnce([teamA, teamB])

    await expect(
      usecase.do({ name: 'Multi Min User', email: 'multimin@example.com' })
    ).resolves.toBeUndefined()

    // `Math.random()`を0.5に固定したため、最初の取得を再現
    expect(participantRepo.save).toHaveBeenCalledTimes(1)
    expect(teamRepo.save).toHaveBeenCalledTimes(1)
  })
})
